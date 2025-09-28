import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8086', 'http://localhost:8087', 'http://localhost:8088', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// In-memory databases (replace with real database in production)
let users = [];
let lands = [];
let verificationRequests = [];
let agreements = [];
let notifications = [];
let issues = [];
let policies = [];
let userIdCounter = 1;
let landIdCounter = 1;
let verificationIdCounter = 1;
let agreementIdCounter = 1;
let notificationIdCounter = 1;
let issueIdCounter = 1;
let policyIdCounter = 1;

// Utility functions
const generateToken = (userId) => `token_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

// Helper function to get user by ID
function getUserById(id) {
  return users.find(user => user.id === parseInt(id) || user.id === id);
}
const getUserByEmail = (email) => users.find(user => user.email === email);
const getUserByToken = (token) => users.find(user => user.token === token);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KisanConnect Backend Server Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      lands: '/api/lands/*',
      admin: '/api/admin/*'
    }
  });
});

// ==================== AUTHENTICATION ROUTES ====================

// Enhanced Registration with role-specific data
app.post('/api/auth/register', (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      password, 
      role,
      // Farmer/Landowner fields
      aadhaar,
      district,
      address,
      // Admin fields
      employeeId,
      department,
      designation
    } = req.body;

    console.log('Registration attempt:', { email, role });

    // Validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Role-specific validation
    if ((role === 'farmer' || role === 'landowner') && !aadhaar) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar number is required for farmers and landowners'
      });
    }

    if (role === 'admin' && (!employeeId || !department || !designation)) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, department, and designation are required for admin users'
      });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      name: fullName.split(' ')[0],
      fullName,
      email,
      phone: phone || '',
      password, // In production, hash this!
      role,
      permanentRole: role,
      token: generateToken(userIdCounter - 1),
      isAuthenticated: true,
      registeredAt: new Date().toISOString(),
      roleAssignedAt: new Date().toISOString(),
      
      // Role-specific data
      ...(aadhaar && { 
        aadhaar, 
        aadhaarVerified: false,
        verificationStatus: 'pending'
      }),
      ...(district && { district }),
      ...(address && { address }),
      ...(employeeId && { 
        employeeId, 
        department, 
        designation,
        adminApproved: false,
        verificationStatus: 'pending'
      })
    };

    users.push(user);

    // Create verification request if needed
    if (role === 'farmer' || role === 'landowner' || role === 'admin') {
      const verificationRequest = {
        id: verificationIdCounter++,
        userId: user.id,
        type: role === 'admin' ? 'admin_approval' : 'aadhaar_verification',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        data: role === 'admin' ? { employeeId, department, designation } : { aadhaar }
      };
      verificationRequests.push(verificationRequest);
    }

    console.log('User registered successfully:', email, 'as', role);

    // Return user data (exclude sensitive info)
    const { password: _, ...userResponse } = user;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: user.token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Enhanced Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate new token for security
    user.token = generateToken(user.id);
    user.lastLoginAt = new Date().toISOString();

    console.log('User logged in successfully:', email);

    // Return user data (exclude sensitive info)
    const { password: _, ...userResponse } = user;
    res.json({
      success: true,
      message: 'Login successful',
      token: user.token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Get current user profile
app.get('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const user = getUserByToken(token);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    const { password: _, ...userResponse } = user;
    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ==================== LAND MANAGEMENT ROUTES ====================

// Get all lands (public)
app.get('/api/lands', (req, res) => {
  try {
    const { status, location, minPrice, maxPrice, limit = 50 } = req.query;
    
    let filteredLands = [...lands];

    // Apply filters
    if (status) {
      filteredLands = filteredLands.filter(land => land.status === status);
    }
    if (location) {
      filteredLands = filteredLands.filter(land => 
        land.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (minPrice) {
      filteredLands = filteredLands.filter(land => land.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredLands = filteredLands.filter(land => land.price <= parseFloat(maxPrice));
    }

    // Limit results
    filteredLands = filteredLands.slice(0, parseInt(limit));

    res.json({ 
      success: true, 
      lands: filteredLands,
      total: filteredLands.length
    });

  } catch (error) {
    console.error('Get lands error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Create new land listing (landowners only)
app.post('/api/lands', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const user = getUserByToken(token);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    if (user.role !== 'landowner') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only landowners can create land listings' 
      });
    }

    if (!user.aadhaarVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Aadhaar verification required to list land' 
      });
    }

    const landData = req.body;
    const land = {
      id: landIdCounter++,
      ...landData,
      ownerId: user.id,
      ownerName: user.fullName,
      status: 'available',
      views: 0,
      inquiries: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    lands.push(land);

    console.log('Land created:', land.id, 'by user', user.id);

    res.status(201).json({
      success: true,
      message: 'Land listing created successfully',
      land: land
    });

  } catch (error) {
    console.error('Create land error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create land listing' 
    });
  }
});

// Get user's own lands
app.get('/api/lands/my', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const user = getUserByToken(token);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    const userLands = lands.filter(land => land.ownerId === user.id);

    console.log(`Fetching lands for user ${user.id}:`, userLands.length, 'lands found');

    res.json({ 
      success: true, 
      lands: userLands,
      total: userLands.length
    });

  } catch (error) {
    console.error('Get user lands error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user lands' 
    });
  }
});

// ==================== ADMIN ROUTES ====================

// Get platform statistics (admin only)
app.get('/api/admin/stats', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const user = getUserByToken(token);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const stats = {
      totalUsers: users.length,
      totalFarmers: users.filter(u => u.role === 'farmer').length,
      totalLandowners: users.filter(u => u.role === 'landowner').length,
      totalAdmins: users.filter(u => u.role === 'admin').length,
      pendingVerifications: verificationRequests.filter(v => v.status === 'pending').length,
      totalLands: lands.length,
      activeLands: lands.filter(l => l.status === 'available').length,
      verifiedUsers: users.filter(u => u.aadhaarVerified || u.adminApproved).length,
      totalAgreements: agreements.length,
      pendingAgreements: agreements.filter(a => a.status === 'pending').length,
      approvedAgreements: agreements.filter(a => a.status === 'approved').length,
      rejectedAgreements: agreements.filter(a => a.status === 'rejected').length,
      totalNotifications: notifications.length,
      activeNotifications: notifications.filter(n => n.status === 'active').length,
      totalIssues: issues.length,
      pendingIssues: issues.filter(i => i.status === 'open' || i.status === 'in-progress').length,
      resolvedIssues: issues.filter(i => i.status === 'resolved').length,
      highPriorityIssues: issues.filter(i => i.priority === 'high' || i.priority === 'urgent').length,
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.status === 'active').length
    };

    res.json({ 
      success: true, 
      stats 
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get pending verifications (admin only)
app.get('/api/admin/verifications', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const user = getUserByToken(token);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // Get pending verifications with user data
    const pendingVerifications = verificationRequests
      .filter(v => v.status === 'pending')
      .map(verification => {
        const verificationUser = getUserById(verification.userId);
        return {
          ...verification,
          user: verificationUser ? {
            id: verificationUser.id,
            name: verificationUser.fullName,
            email: verificationUser.email,
            role: verificationUser.role
          } : null
        };
      });

    res.json({ 
      success: true, 
      verifications: pendingVerifications,
      total: pendingVerifications.length
    });

  } catch (error) {
    console.error('Admin verifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Approve verification request (admin only)
app.post('/api/admin/verifications/:id/approve', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const verificationId = parseInt(req.params.id);
    const verification = verificationRequests.find(v => v.id === verificationId);

    if (!verification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Verification request not found' 
      });
    }

    // Update verification status
    verification.status = 'approved';
    verification.approvedBy = adminUser.id;
    verification.approvedAt = new Date().toISOString();

    // Update user status based on verification type
    const user = getUserById(verification.userId);
    if (user) {
      if (verification.type === 'aadhaar_verification') {
        user.aadhaarVerified = true;
        user.verificationStatus = 'verified';
      } else if (verification.type === 'admin_approval') {
        user.adminApproved = true;
        user.verificationStatus = 'verified';
      }
    }

    console.log(`Verification ${verificationId} approved by admin ${adminUser.id}`);
    
    res.json({ 
      success: true, 
      message: 'Verification approved successfully',
      verification: verification
    });

  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Reject verification request (admin only)
app.post('/api/admin/verifications/:id/reject', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rejection reason is required' 
      });
    }

    const verificationId = parseInt(req.params.id);
    const verification = verificationRequests.find(v => v.id === verificationId);

    if (!verification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Verification request not found' 
      });
    }

    // Update verification status
    verification.status = 'rejected';
    verification.rejectedBy = adminUser.id;
    verification.rejectedAt = new Date().toISOString();
    verification.rejectionReason = reason;

    // Update user status
    const user = getUserById(verification.userId);
    if (user) {
      user.verificationStatus = 'rejected';
    }

    console.log(`Verification ${verificationId} rejected by admin ${adminUser.id}: ${reason}`);
    
    res.json({ 
      success: true, 
      message: 'Verification rejected successfully',
      verification: verification
    });

  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// User Management Endpoints for Admin
app.get('/api/admin/users', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // Return all users with relevant information
    const allUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status || 'active',
      verificationStatus: user.verificationStatus,
      registeredAt: user.registeredAt,
      department: user.department,
      lastLogin: user.lastLogin
    }));

    console.log(`Admin ${adminUser.id} fetched ${allUsers.length} users`);
    
    res.json({ 
      success: true, 
      users: allUsers,
      totalCount: allUsers.length
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Toggle user status (suspend/activate)
app.post('/api/admin/users/:id/status', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const userId = req.params.id;
    const { status } = req.body;

    console.log('Toggle user status request:', { userId, status, body: req.body });

    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Valid status (active/suspended) is required. Received: ${status}` 
      });
    }

    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prevent admin from suspending themselves
    if (user.id === adminUser.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot modify your own account status' 
      });
    }

    // Update user status
    const previousStatus = user.status || 'active';
    user.status = status;
    user.statusChangedBy = adminUser.id;
    user.statusChangedAt = new Date().toISOString();

    console.log(`Admin ${adminUser.id} changed user ${userId} status from ${previousStatus} to ${status}`);
    
    res.json({ 
      success: true, 
      message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        statusChangedAt: user.statusChangedAt
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Agreement Management Endpoints for Admin
app.get('/api/admin/agreements', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // Get all agreements with user details
    const agreementsWithDetails = agreements.map(agreement => {
      const farmer = getUserById(agreement.farmerId);
      const landowner = getUserById(agreement.landownerId);
      
      return {
        ...agreement,
        farmerName: farmer ? farmer.name : 'Unknown',
        farmerEmail: farmer ? farmer.email : 'Unknown',
        landownerName: landowner ? landowner.name : 'Unknown',
        landownerEmail: landowner ? landowner.email : 'Unknown'
      };
    });

    console.log(`Admin ${adminUser.id} fetched ${agreementsWithDetails.length} agreements`);
    
    res.json({ 
      success: true, 
      agreements: agreementsWithDetails,
      totalCount: agreementsWithDetails.length
    });

  } catch (error) {
    console.error('Get agreements error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Approve agreement
app.post('/api/admin/agreements/:id/approve', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const agreementId = parseInt(req.params.id);
    const { approvalNotes } = req.body;

    const agreement = agreements.find(agreement => agreement.id === agreementId);
    if (!agreement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agreement not found' 
      });
    }

    // Update agreement status
    agreement.status = 'approved';
    agreement.approvedBy = adminUser.id;
    agreement.approvedAt = new Date().toISOString();
    agreement.approvalNotes = approvalNotes || '';

    console.log(`Agreement ${agreementId} approved by admin ${adminUser.id}`);
    
    res.json({ 
      success: true, 
      message: 'Agreement approved successfully',
      agreement: agreement
    });

  } catch (error) {
    console.error('Approve agreement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Reject agreement
app.post('/api/admin/agreements/:id/reject', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    const agreementId = parseInt(req.params.id);
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rejection reason is required' 
      });
    }

    const agreement = agreements.find(agreement => agreement.id === agreementId);
    if (!agreement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agreement not found' 
      });
    }

    // Update agreement status
    agreement.status = 'rejected';
    agreement.rejectedBy = adminUser.id;
    agreement.rejectedAt = new Date().toISOString();
    agreement.rejectionReason = rejectionReason;

    console.log(`Agreement ${agreementId} rejected by admin ${adminUser.id}: ${rejectionReason}`);
    
    res.json({ 
      success: true, 
      message: 'Agreement rejected successfully',
      agreement: agreement
    });

  } catch (error) {
    console.error('Reject agreement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Notification Management Endpoints
app.get('/api/admin/notifications', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    res.json({ 
      success: true, 
      notifications: notifications,
      totalCount: notifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new notification
app.post('/api/admin/notifications', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { title, message, type, targetUsers, priority } = req.body;

    const notification = {
      id: notificationIdCounter++,
      title,
      message,
      type: type || 'general', // general, matching, contract, issue
      targetUsers: targetUsers || 'all', // all, farmers, landowners, specific user IDs
      priority: priority || 'medium', // low, medium, high, urgent
      createdBy: adminUser.id,
      createdAt: new Date().toISOString(),
      status: 'active',
      readBy: []
    };

    notifications.push(notification);

    res.json({ 
      success: true, 
      message: 'Notification created successfully',
      notification: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Issue Management Endpoints
app.get('/api/admin/issues', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Get issues with reporter details
    const issuesWithDetails = issues.map(issue => {
      const reporter = getUserById(issue.reporterId);
      return {
        ...issue,
        reporterName: reporter ? reporter.name : 'Anonymous',
        reporterEmail: reporter ? reporter.email : 'N/A',
        reporterRole: reporter ? reporter.role : 'N/A'
      };
    });

    res.json({ 
      success: true, 
      issues: issuesWithDetails,
      totalCount: issuesWithDetails.length
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update issue status
app.post('/api/admin/issues/:id/update', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const issueId = parseInt(req.params.id);
    const { status, resolution, priority } = req.body;

    const issue = issues.find(issue => issue.id === issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (status) issue.status = status;
    if (resolution) issue.resolution = resolution;
    if (priority) issue.priority = priority;
    
    issue.updatedBy = adminUser.id;
    issue.updatedAt = new Date().toISOString();

    if (status === 'resolved') {
      issue.resolvedAt = new Date().toISOString();
      issue.resolvedBy = adminUser.id;
    }

    res.json({ 
      success: true, 
      message: 'Issue updated successfully',
      issue: issue
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Policy Management Endpoints
app.get('/api/admin/policies', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    res.json({ 
      success: true, 
      policies: policies,
      totalCount: policies.length
    });
  } catch (error) {
    console.error('Get policies error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new policy
app.post('/api/admin/policies', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { title, description, category, applicableTo, effectiveDate, expiryDate } = req.body;

    const policy = {
      id: policyIdCounter++,
      title,
      description,
      category: category || 'general', // general, land, contract, financial
      applicableTo: applicableTo || 'all', // all, farmers, landowners, specific regions
      effectiveDate: effectiveDate || new Date().toISOString(),
      expiryDate,
      createdBy: adminUser.id,
      createdAt: new Date().toISOString(),
      status: 'active',
      version: 1
    };

    policies.push(policy);

    res.json({ 
      success: true, 
      message: 'Policy created successfully',
      policy: policy
    });
  } catch (error) {
    console.error('Create policy error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update policy
app.put('/api/admin/policies/:id', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const adminUser = getUserByToken(token);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const policyId = parseInt(req.params.id);
    const { title, description, category, applicableTo, effectiveDate, expiryDate, status } = req.body;

    const policy = policies.find(policy => policy.id === policyId);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    if (title) policy.title = title;
    if (description) policy.description = description;
    if (category) policy.category = category;
    if (applicableTo) policy.applicableTo = applicableTo;
    if (effectiveDate) policy.effectiveDate = effectiveDate;
    if (expiryDate) policy.expiryDate = expiryDate;
    if (status) policy.status = status;
    
    policy.updatedBy = adminUser.id;
    policy.updatedAt = new Date().toISOString();
    policy.version += 1;

    res.json({ 
      success: true, 
      message: 'Policy updated successfully',
      policy: policy
    });
  } catch (error) {
    console.error('Update policy error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Submit verification request (for farmers/landowners to submit documents)
app.post('/api/verification/submit', (req, res) => {
  try {
    const { userId, landId, documentType, documentUrl, adminNotes } = req.body;
    
    const verification = {
      id: verificationIdCounter++,
      userId: parseInt(userId),
      landId: landId ? parseInt(landId) : null,
      documentType,
      documentUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      adminNotes: adminNotes || ''
    };
    
    verificationRequests.push(verification);
    
    res.json({
      success: true,
      message: 'Verification request submitted successfully',
      verification
    });
    
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create agreement (for farmers/landowners to create agreements)
app.post('/api/agreements/create', (req, res) => {
  try {
    const { farmerId, landownerId, landId, terms, duration, paymentTerms } = req.body;
    
    const farmer = getUserById(farmerId);
    const landowner = getUserById(landownerId);
    
    if (!farmer || !landowner) {
      return res.status(400).json({
        success: false,
        message: 'Invalid farmer or landowner ID'
      });
    }
    
    const agreement = {
      id: agreementIdCounter++,
      farmerId: parseInt(farmerId),
      landownerId: parseInt(landownerId),
      landId: landId ? parseInt(landId) : null,
      status: 'pending',
      terms,
      duration,
      paymentTerms,
      createdAt: new Date().toISOString(),
      farmerName: farmer.name || farmer.fullName,
      landowner: landowner.name || landowner.fullName,
      landLocation: 'Location TBD'
    };
    
    agreements.push(agreement);
    
    res.json({
      success: true,
      message: 'Agreement created successfully',
      agreement
    });
    
  } catch (error) {
    console.error('Create agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all users for testing (non-admin endpoint)
app.get('/api/users/all', (req, res) => {
  const allUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status || 'active'
  }));
  
  res.json({
    success: true,
    users: allUsers,
    total: allUsers.length
  });
});

// Add some sample data for testing before starting server
if (users.length === 0) {
  console.log(`📝 Adding sample data...`);
  
  // Sample users
    const sampleUsers = [
      {
        id: userIdCounter++,
        name: 'Raj',
        fullName: 'Raj Kumar',
        email: 'farmer@example.com',
        phone: '9876543210',
        password: 'password123',
        role: 'farmer',
        permanentRole: 'farmer',
        aadhaar: '123456789012',
        district: 'Karnataka',
        aadhaarVerified: true,
        verificationStatus: 'verified',
        token: generateToken(userIdCounter - 1),
        registeredAt: new Date().toISOString(),
        roleAssignedAt: new Date().toISOString()
      },
      {
        id: userIdCounter++,
        name: 'Priya',
        fullName: 'Priya Sharma',
        email: 'landowner@example.com',
        phone: '9876543211',
        password: 'password123',
        role: 'landowner',
        permanentRole: 'landowner',
        aadhaar: '123456789013',
        address: 'Mumbai, Maharashtra',
        aadhaarVerified: false,
        verificationStatus: 'pending',
        token: generateToken(userIdCounter - 1),
        registeredAt: new Date().toISOString(),
        roleAssignedAt: new Date().toISOString()
      }
    ];
    
    users.push(...sampleUsers);
    
    // Sample lands
    const sampleLands = [
      {
        id: landIdCounter++,
        title: 'Fertile Agricultural Land',
        description: 'Premium quality agricultural land suitable for all crops',
        location: 'Karnataka, India',
        area: 5.5,
        price: 25000,
        status: 'available',
        ownerId: 2,
        ownerName: 'Priya Sharma',
        views: 0,
        inquiries: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    lands.push(...sampleLands);
    
    // Sample verification requests
    const sampleVerifications = [
      {
        id: verificationIdCounter++,
        userId: 2, // Priya Sharma (landowner)
        type: 'aadhaar_verification',
        status: 'pending',
        data: { aadhaar: '123456789013' },
        createdAt: new Date().toISOString()
      },
      {
        id: verificationIdCounter++,
        userId: userIdCounter, // New admin user
        type: 'admin_approval',
        status: 'pending',
        data: { 
          employeeId: 'GOV2024001',
          department: 'Agriculture Department',
          designation: 'Assistant Commissioner'
        },
        createdAt: new Date().toISOString()
      }
    ];
    
    // Add a sample admin user for testing
    const adminUser = {
      id: userIdCounter++,
      name: 'Admin',
      fullName: 'Admin Kumar',
      email: 'admin@gov.in',
      phone: '9876543212',
      password: 'admin123',
      role: 'admin',
      permanentRole: 'admin',
      employeeId: 'GOV2024001',
      department: 'Agriculture Department',
      designation: 'Assistant Commissioner',
      adminApproved: false,
      verificationStatus: 'pending',
      token: generateToken(userIdCounter - 1),
      registeredAt: new Date().toISOString(),
      roleAssignedAt: new Date().toISOString()
    };
    
    users.push(adminUser);
    verificationRequests.push(...sampleVerifications);
    
    // Sample agreements between farmers and landowners
    const sampleAgreements = [
      {
        id: agreementIdCounter++,
        farmerId: 1, // Raj (farmer)
        landownerId: 2, // Priya (landowner)
        landId: 1,
        agreementType: 'Crop Sharing',
        cropType: 'Rice',
        duration: '6 months',
        sharePercentage: 70, // 70% to farmer, 30% to landowner
        startDate: '2025-01-15',
        endDate: '2025-07-15',
        terms: 'Farmer provides labor and seeds, landowner provides land. Harvest to be shared 70-30.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        farmerAgreed: true,
        landownerAgreed: true,
        farmerAgreedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        landownerAgreedAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
      },
      {
        id: agreementIdCounter++,
        farmerId: 1, // Raj (farmer)
        landownerId: 2, // Priya (landowner)
        landId: 1,
        agreementType: 'Fixed Rent',
        cropType: 'Wheat',
        duration: '4 months',
        rentAmount: 15000, // Monthly rent
        startDate: '2025-02-01',
        endDate: '2025-06-01',
        terms: 'Fixed monthly rent of ₹15,000. Farmer responsible for all farming activities.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        farmerAgreed: true,
        landownerAgreed: true,
        farmerAgreedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        landownerAgreedAt: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
      }
    ];
    
    agreements.push(...sampleAgreements);
    
    // Sample notifications
    const sampleNotifications = [
      {
        id: notificationIdCounter++,
        title: 'New Farmer-Landowner Match Available',
        message: 'A potential match has been found between Raj Kumar and available land in Karnataka. Review and approve the connection.',
        type: 'matching',
        targetUsers: 'all',
        priority: 'high',
        createdBy: 3,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
        readBy: []
      },
      {
        id: notificationIdCounter++,
        title: 'Contract Renewal Reminder',
        message: 'Contract between Raj and Priya expires in 30 days. Renewal required.',
        type: 'contract',
        targetUsers: [1, 2],
        priority: 'medium',
        createdBy: 3,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'active',
        readBy: []
      }
    ];
    
    // Sample issues
    const sampleIssues = [
      {
        id: issueIdCounter++,
        title: 'Payment Dispute',
        description: 'Farmer claims payment not received for last month\'s crop sharing agreement',
        category: 'financial',
        subcategory: 'payment',
        priority: 'high',
        status: 'open',
        reporterId: 1,
        landId: 1,
        agreementId: 1,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: issueIdCounter++,
        title: 'Land Access Issue',
        description: 'Landowner restricting farmer access to contracted land without proper notice',
        category: 'legal',
        subcategory: 'contract-breach',
        priority: 'urgent',
        status: 'in-progress',
        reporterId: 1,
        landId: 1,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        updatedAt: new Date(Date.now() - 21600000).toISOString(),
        assignedTo: 3
      },
      {
        id: issueIdCounter++,
        title: 'Land Registration Problem',
        description: 'Unable to complete land registration due to missing documentation',
        category: 'land-registration',
        subcategory: 'documentation',
        priority: 'medium',
        status: 'open',
        reporterId: 2,
        landId: 2,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: issueIdCounter++,
        title: 'App Not Loading',
        description: 'Mobile application crashes on startup, unable to access any features',
        category: 'technical-support',
        subcategory: 'app-crash',
        priority: 'high',
        status: 'open',
        reporterId: 1,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: issueIdCounter++,
        title: 'Account Login Issues',
        description: 'Cannot login to account, password reset not working',
        category: 'account-issues',
        subcategory: 'login',
        priority: 'medium',
        status: 'resolved',
        reporterId: 2,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        resolvedAt: new Date(Date.now() - 86400000).toISOString(),
        assignedTo: 3
      }
    ];
    
    // Sample policies
    const samplePolicies = [
      {
        id: policyIdCounter++,
        title: 'Fair Payment Terms Policy',
        description: 'All crop sharing agreements must include clear payment terms with maximum 30-day payment window after harvest.',
        category: 'financial',
        applicableTo: 'all',
        effectiveDate: '2025-01-01',
        expiryDate: '2025-12-31',
        createdBy: 3,
        createdAt: new Date(Date.now() - 2592000000).toISOString(),
        status: 'active',
        version: 1
      },
      {
        id: policyIdCounter++,
        title: 'Land Verification Requirements',
        description: 'All listed lands must undergo government verification process including soil quality, ownership verification, and legal clearance.',
        category: 'land',
        applicableTo: 'landowners',
        effectiveDate: '2025-02-01',
        createdBy: 3,
        createdAt: new Date(Date.now() - 1296000000).toISOString(),
        status: 'active',
        version: 2
      }
    ];
    
  agreements.push(...sampleAgreements);
  notifications.push(...sampleNotifications);
  issues.push(...sampleIssues);
  policies.push(...samplePolicies);
  
  console.log(`✅ Sample data added: ${users.length} users, ${lands.length} lands, ${verificationRequests.length} verifications, ${agreements.length} agreements, ${notifications.length} notifications, ${issues.length} issues, ${policies.length} policies`);
}

// Start server
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🌱 KisanConnect Backend Server`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📊 Current time: ${new Date().toISOString()}`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔒 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('🔒 Server closed');
    process.exit(0);
  });
});

export default app;