import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let users = [];
let lands = [];
let userIdCounter = 1;
let landIdCounter = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, phone, governmentId, department } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email,
      password,
      role,
      phone,
      governmentId,
      department,
      token: `token_${userIdCounter-1}_${Date.now()}`,
      isVerified: false
    };

    users.push(user);
    console.log('User registered:', email, 'as', role);

    res.json({
      success: true,
      message: 'User registered successfully',
      token: user.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        governmentId: user.governmentId,
        department: user.department,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User logged in:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token: user.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        governmentId: user.governmentId,
        department: user.department,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Land endpoints
app.get('/api/lands', (req, res) => {
  try {
    res.json({
      success: true,
      lands: lands
    });
  } catch (error) {
    console.error('Get lands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lands'
    });
  }
});

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
    const user = users.find(u => u.token === token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const landData = req.body;
    const land = {
      id: landIdCounter++,
      ...landData,
      owner: user.id,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    lands.push(land);
    console.log('Land created:', land.id, 'by user', user.id);

    res.status(201).json({
      success: true,
      message: 'Land created successfully',
      land: land
    });
  } catch (error) {
    console.error('Create land error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create land'
    });
  }
});

app.get('/api/lands/my/lands', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const user = users.find(u => u.token === token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const userLands = lands.filter(land => land.owner === user.id);
    console.log(`Fetching lands for user ${user.id}:`, userLands.length, 'lands found');
    
    res.json({
      success: true,
      lands: userLands
    });
  } catch (error) {
    console.error('Get user lands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user lands'
    });
  }
});

const PORT = 5005;

app.listen(PORT, () => {
  console.log(`Ì∫Ä KisanConnect Backend Server running on port ${PORT}`);
  console.log(`Ì≥° Health check: http://localhost:${PORT}/health`);
  console.log(`Ì¥ê Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Ì±§ Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`ÌøûÔ∏è  Lands: GET/POST http://localhost:${PORT}/api/lands`);
});
EOFcat > backend/simple-working-server.js << 'EOF'
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let users = [];
let lands = [];
let userIdCounter = 1;
let landIdCounter = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, phone, governmentId, department } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email,
      password,
      role,
      phone,
      governmentId,
      department,
      token: `token_${userIdCounter-1}_${Date.now()}`,
      isVerified: false
    };

    users.push(user);
    console.log('User registered:', email, 'as', role);

    res.json({
      success: true,
      message: 'User registered successfully',
      token: user.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        governmentId: user.governmentId,
        department: user.department,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User logged in:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token: user.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        governmentId: user.governmentId,
        department: user.department,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Land endpoints
app.get('/api/lands', (req, res) => {
  try {
    res.json({
      success: true,
      lands: lands
    });
  } catch (error) {
    console.error('Get lands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lands'
    });
  }
});

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
    const user = users.find(u => u.token === token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const landData = req.body;
    const land = {
      id: landIdCounter++,
      ...landData,
      owner: user.id,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    lands.push(land);
    console.log('Land created:', land.id, 'by user', user.id);

    res.status(201).json({
      success: true,
      message: 'Land created successfully',
      land: land
    });
  } catch (error) {
    console.error('Create land error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create land'
    });
  }
});

app.get('/api/lands/my/lands', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const user = users.find(u => u.token === token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const userLands = lands.filter(land => land.owner === user.id);
    console.log(`Fetching lands for user ${user.id}:`, userLands.length, 'lands found');
    
    res.json({
      success: true,
      lands: userLands
    });
  } catch (error) {
    console.error('Get user lands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user lands'
    });
  }
});

const PORT = 5005;

app.listen(PORT, () => {
  console.log(`Ì∫Ä KisanConnect Backend Server running on port ${PORT}`);
  console.log(`Ì≥° Health check: http://localhost:${PORT}/health`);
  console.log(`Ì¥ê Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Ì±§ Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`ÌøûÔ∏è  Lands: GET/POST http://localhost:${PORT}/api/lands`);
});
