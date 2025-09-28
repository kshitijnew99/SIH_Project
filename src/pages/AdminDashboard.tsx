import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Users, 
  Building2, 
  FileCheck, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Sprout,
  BarChart3,
  Settings,
  Database,
  Activity,
  Handshake,
  Bell,
  AlertCircle,
  FileText,
  MessageSquare,
  Zap,
  Eye,
  Edit,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalLandowners: 0,
    totalAdmins: 0,
    pendingVerifications: 0,
    totalLands: 0,
    activeListings: 0,
    totalAgreements: 0,
    pendingAgreements: 0,
    approvedAgreements: 0,
    rejectedAgreements: 0,
    totalNotifications: 0,
    activeNotifications: 0,
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    highPriorityIssues: 0,
    totalPolicies: 0,
    activePolicies: 0
  });

  const [verifications, setVerifications] = useState([]);
  const [showVerifications, setShowVerifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [showAgreements, setShowAgreements] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [issues, setIssues] = useState([]);
  const [showIssues, setShowIssues] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [showPolicies, setShowPolicies] = useState(false);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error reading user data:', error);
    }
    return { name: 'Admin', role: 'admin' }; // Default fallback
  };

  // Fetch platform statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');
        
        console.log('AdminDashboard: Fetching stats...');
        console.log('Token present:', !!token);
        console.log('User data:', userData);
        
        if (!token) {
          console.error('AdminDashboard: No token found');
          alert('Please login again to access admin dashboard');
          return;
        }

        console.log('AdminDashboard: Making API call to backend...');
        const response = await fetch('http://localhost:5001/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('AdminDashboard: API response status:', response.status);
        const data = await response.json();
        console.log('AdminDashboard: API response data:', data);

        if (data.success) {
          console.log('AdminDashboard: Updating stats:', data.stats);
          setStats({
            totalUsers: data.stats.totalUsers,
            totalFarmers: data.stats.totalFarmers,
            totalLandowners: data.stats.totalLandowners,
            totalAdmins: data.stats.totalAdmins,
            pendingVerifications: data.stats.pendingVerifications,
            totalLands: data.stats.totalLands,
            activeListings: data.stats.activeLands,
            totalAgreements: data.stats.totalAgreements || 0,
            pendingAgreements: data.stats.pendingAgreements || 0,
            approvedAgreements: data.stats.approvedAgreements || 0,
            rejectedAgreements: data.stats.rejectedAgreements || 0
          });
        } else {
          console.error('AdminDashboard: Failed to fetch stats:', data.message);
          if (response.status === 401 || response.status === 403) {
            alert('Access denied. Please login as admin.');
          }
        }
      } catch (error) {
        console.error('AdminDashboard: Error fetching stats:', error);
        alert('Error connecting to server. Please check your connection.');
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const userData = getUserData();

  // Fetch pending verifications
  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/verifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setVerifications(data.verifications);
        setShowVerifications(true);
      } else {
        alert('Failed to fetch verifications: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
      alert('Error fetching verifications');
    } finally {
      setLoading(false);
    }
  };

  // Approve verification
  const approveVerification = async (verificationId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Verification approved successfully!');
        fetchVerifications(); // Refresh the list
        
        // Refresh stats from backend
        const refreshStats = async () => {
          try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5001/api/admin/stats', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            const statsData = await response.json();
            if (statsData.success) {
              setStats({
                totalUsers: statsData.stats.totalUsers,
                totalFarmers: statsData.stats.totalFarmers,
                totalLandowners: statsData.stats.totalLandowners,
                totalAdmins: statsData.stats.totalAdmins,
                pendingVerifications: statsData.stats.pendingVerifications,
                totalLands: statsData.stats.totalLands,
                activeListings: statsData.stats.activeLands,
                totalAgreements: statsData.stats.totalAgreements || 0,
                pendingAgreements: statsData.stats.pendingAgreements || 0,
                approvedAgreements: statsData.stats.approvedAgreements || 0,
                rejectedAgreements: statsData.stats.rejectedAgreements || 0
              });
            }
          } catch (error) {
            console.error('Error refreshing stats:', error);
          }
        };
        refreshStats();
      } else {
        alert('Failed to approve verification: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Error approving verification');
    }
  };

  // Reject verification
  const rejectVerification = async (verificationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Verification rejected successfully!');
        fetchVerifications(); // Refresh the list
      } else {
        alert('Failed to reject verification: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Error rejecting verification');
    }
  };

  // Fetch all users for management
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setShowUserManagement(true);
      } else {
        alert('Failed to fetch users: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status (activate/suspend)
  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} this user?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'suspended' : 'active' })
      });

      const data = await response.json();
      if (data.success) {
        alert(`User ${action}d successfully!`);
        fetchUsers(); // Refresh the list
      } else {
        alert(`Failed to ${action} user: ` + data.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Error ${action}ing user`);
    }
  };

  // Fetch all agreements for management
  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/agreements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAgreements(data.agreements);
        console.log('Agreements fetched:', data.agreements.length);
      } else {
        console.error('Failed to fetch agreements:', data.message);
        alert('Failed to fetch agreements: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
      alert('Error fetching agreements');
    } finally {
      setLoading(false);
    }
  };

  // Approve agreement
  const approveAgreement = async (agreementId) => {
    const approvalNotes = prompt('Add approval notes (optional):');
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/agreements/${agreementId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approvalNotes })
      });

      const data = await response.json();
      if (data.success) {
        alert('Agreement approved successfully!');
        fetchAgreements(); // Refresh the list
      } else {
        alert('Failed to approve agreement: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving agreement:', error);
      alert('Error approving agreement');
    }
  };

  // Reject agreement
  const rejectAgreement = async (agreementId) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5001/api/admin/agreements/${agreementId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Agreement rejected successfully!');
        fetchAgreements(); // Refresh the list
      } else {
        alert('Failed to reject agreement: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting agreement:', error);
      alert('Error rejecting agreement');
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        console.log('Notifications fetched:', data.notifications.length);
      } else {
        console.error('Failed to fetch notifications:', data.message);
        alert('Failed to fetch notifications: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch issues
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/issues', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setIssues(data.issues);
        console.log('Issues fetched:', data.issues.length);
      } else {
        console.error('Failed to fetch issues:', data.message);
        alert('Failed to fetch issues: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      alert('Error fetching issues');
    } finally {
      setLoading(false);
    }
  };

  // Fetch policies
  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/policies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPolicies(data.policies);
        console.log('Policies fetched:', data.policies.length);
      } else {
        console.error('Failed to fetch policies:', data.message);
        alert('Failed to fetch policies: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      alert('Error fetching policies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">KisanConnect</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-accent/20 text-primary border-accent">
                <Shield className="h-3 w-3 mr-1" />
                {t("admin.dashboard")}
              </Badge>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userData.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Government Administration Panel - Monitor and manage the KisanConnect platform
          </p>
          
          {/* Admin Status */}
          <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Admin Status:</span>
              </div>
              {userData.adminApproved ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Approval
                </Badge>
              )}
            </div>
            {!userData.adminApproved && (
              <p className="text-xs text-muted-foreground mt-2">
                Your admin account is awaiting approval from senior officials. Some features may be limited.
              </p>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmers</CardTitle>
              <Sprout className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalFarmers}</div>
              <p className="text-xs text-muted-foreground">
                Active farmers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Landowners</CardTitle>
              <Building2 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalLandowners}</div>
              <p className="text-xs text-muted-foreground">
                Property owners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Agreements</CardTitle>
              <Handshake className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.pendingAgreements || 0}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Notifications</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeNotifications || 0}</div>
              <p className="text-xs text-muted-foreground">
                System notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.pendingIssues || 0}</div>
              <p className="text-xs text-muted-foreground">
                Need resolution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <FileText className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.activePolicies || 0}</div>
              <p className="text-xs text-muted-foreground">
                Platform policies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Platform Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Land Listings</span>
                  <span className="font-medium">{stats.totalLands}</span>
                </div>
                <Progress value={(stats.totalLands / 100) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Listings</span>
                  <span className="font-medium">{stats.activeListings}</span>
                </div>
                <Progress 
                  value={stats.totalLands > 0 ? (stats.activeListings / stats.totalLands) * 100 : 0} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>User Verification Rate</span>
                  <span className="font-medium">
                    {stats.totalUsers > 0 ? 
                      Math.round(((stats.totalUsers - stats.pendingVerifications) / stats.totalUsers) * 100) : 0
                    }%
                  </span>
                </div>
                <Progress 
                  value={stats.totalUsers > 0 ? 
                    ((stats.totalUsers - stats.pendingVerifications) / stats.totalUsers) * 100 : 0
                  } 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Admin Actions</span>
              </CardTitle>
              <CardDescription>
                Administrative tools and platform management
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-6">
              <Link to="/admin/verification-management" className="w-full">
                <Button className="w-full justify-start h-12" variant="outline">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Review Pending Verifications ({stats.pendingVerifications})
                </Button>
              </Link>
              
              <Link to="/admin/user-management" className="w-full">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage User Accounts
                </Button>
              </Link>
              
              <Link to="/admin/agreement-management" className="w-full">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Handshake className="h-4 w-4 mr-2" />
                  Manage Agreements
                </Button>
              </Link>
              
              <Link to="/admin/notification-system" className="w-full">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification System
                </Button>
              </Link>
              
              <Link to="/admin/issue-management" className="w-full">
                <Button className="w-full justify-start h-12" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Issue Management
                </Button>
              </Link>
              
              <Link to="/admin/policy-management" className="w-full">
                <Button className="w-full justify-start h-12" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Policy Management
                </Button>
              </Link>
              
              <Button className="w-full justify-start h-12" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Platform Analytics
              </Button>
              
              <Button 
                className="w-full justify-start h-12" 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Platform Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">New farmer registration</span>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Land listing created</span>
                </div>
                <span className="text-xs text-muted-foreground">4 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Verification pending review</span>
                </div>
                <span className="text-xs text-muted-foreground">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Management Modal */}
        {showVerifications && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>Pending Verifications ({verifications.length})</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowVerifications(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {verifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium">No pending verifications!</p>
                  <p className="text-sm">All users are verified and approved.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {verifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4 bg-secondary/10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {verification.type.replace('_', ' ')}
                            </Badge>
                            <Badge 
                              variant={verification.status === 'pending' ? 'secondary' : 'default'}
                            >
                              {verification.status}
                            </Badge>
                          </div>
                          
                          {verification.user && (
                            <div>
                              <p className="font-medium">{verification.user.name}</p>
                              <p className="text-sm text-muted-foreground">{verification.user.email}</p>
                              <p className="text-sm text-muted-foreground capitalize">Role: {verification.user.role}</p>
                            </div>
                          )}
                          
                          {verification.data && (
                            <div className="text-sm text-muted-foreground">
                              {verification.type === 'aadhaar_verification' && (
                                <p>Aadhaar: {verification.data.aadhaar}</p>
                              )}
                              {verification.type === 'admin_approval' && (
                                <div>
                                  <p>Employee ID: {verification.data.employeeId}</p>
                                  <p>Department: {verification.data.department}</p>
                                  <p>Designation: {verification.data.designation}</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(verification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => approveVerification(verification.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => rejectVerification(verification.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* User Management Modal */}
        {showUserManagement && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Account Management ({users.length} total users)</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUserManagement(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm">Users will appear here once they register.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 bg-secondary/10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {user.role}
                            </Badge>
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 'destructive'}
                            >
                              {user.status || 'active'}
                            </Badge>
                            {user.verificationStatus && (
                              <Badge 
                                variant={user.verificationStatus === 'verified' ? 'default' : 'secondary'}
                              >
                                {user.verificationStatus}
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <p className="font-medium">{user.fullName || user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.phone && (
                              <p className="text-sm text-muted-foreground">Phone: {user.phone}</p>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <p>Registered: {new Date(user.registeredAt).toLocaleString()}</p>
                            {user.role === 'admin' && user.department && (
                              <p>Department: {user.department}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant={user.status === 'active' ? 'destructive' : 'default'}
                            onClick={() => toggleUserStatus(user.id, user.status || 'active')}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Agreement Management Modal */}
        {showAgreements && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2">
                  <Handshake className="h-5 w-5" />
                  <span>Agreement Management ({agreements.length} total agreements)</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAgreements(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {agreements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Handshake className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No agreements found</p>
                  <p className="text-sm">Agreements between farmers and landowners will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agreements.map((agreement) => (
                    <div key={agreement.id} className="border rounded-lg p-4 bg-secondary/10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {agreement.agreementType}
                            </Badge>
                            <Badge 
                              variant={
                                agreement.status === 'approved' ? 'default' : 
                                agreement.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {agreement.status}
                            </Badge>
                            <Badge variant="outline">
                              {agreement.cropType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-sm text-muted-foreground">Farmer</p>
                              <p className="font-medium">{agreement.farmerName}</p>
                              <p className="text-sm text-muted-foreground">{agreement.farmerEmail}</p>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-muted-foreground">Landowner</p>
                              <p className="font-medium">{agreement.landownerName}</p>
                              <p className="text-sm text-muted-foreground">{agreement.landownerEmail}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Duration</p>
                              <p>{agreement.duration}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Start Date</p>
                              <p>{new Date(agreement.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">End Date</p>
                              <p>{new Date(agreement.endDate).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {agreement.sharePercentage && (
                            <div>
                              <p className="font-medium text-sm text-muted-foreground">Share Percentage</p>
                              <p className="text-sm">Farmer: {agreement.sharePercentage}%, Landowner: {100 - agreement.sharePercentage}%</p>
                            </div>
                          )}

                          {agreement.rentAmount && (
                            <div>
                              <p className="font-medium text-sm text-muted-foreground">Rent Amount</p>
                              <p className="text-sm">₹{agreement.rentAmount.toLocaleString()} per month</p>
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-sm text-muted-foreground">Terms & Conditions</p>
                            <p className="text-sm text-gray-600">{agreement.terms}</p>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <p>Created: {new Date(agreement.createdAt).toLocaleString()}</p>
                            {agreement.farmerAgreedAt && (
                              <p>Farmer agreed: {new Date(agreement.farmerAgreedAt).toLocaleString()}</p>
                            )}
                            {agreement.landownerAgreedAt && (
                              <p>Landowner agreed: {new Date(agreement.landownerAgreedAt).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                        
                        {agreement.status === 'pending' && (
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button 
                              size="sm" 
                              onClick={() => approveAgreement(agreement.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => rejectAgreement(agreement.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {agreement.status === 'approved' && (
                          <div className="ml-4">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                            {agreement.approvalNotes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Notes: {agreement.approvalNotes}
                              </p>
                            )}
                          </div>
                        )}

                        {agreement.status === 'rejected' && (
                          <div className="ml-4">
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                            {agreement.rejectionReason && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Reason: {agreement.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
