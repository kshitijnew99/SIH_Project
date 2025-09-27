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
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalLandowners: 0,
    totalAdmins: 0,
    pendingVerifications: 0,
    totalLands: 0,
    activeListings: 0
  });

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

  // Calculate platform statistics
  useEffect(() => {
    const calculateStats = () => {
      try {
        // Get registered users
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const landListings = JSON.parse(localStorage.getItem('landListings') || '[]');

        const farmers = registeredUsers.filter((user: any) => user.role === 'farmer');
        const landowners = registeredUsers.filter((user: any) => user.role === 'landowner');
        const admins = registeredUsers.filter((user: any) => user.role === 'admin');
        
        const pendingVerifications = registeredUsers.filter((user: any) => 
          user.verificationStatus === 'pending' || !user.aadhaarVerified || !user.adminApproved
        ).length;

        const activeListings = landListings.filter((land: any) => land.status === 'available').length;

        setStats({
          totalUsers: registeredUsers.length,
          totalFarmers: farmers.length,
          totalLandowners: landowners.length,
          totalAdmins: admins.length,
          pendingVerifications,
          totalLands: landListings.length,
          activeListings
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
      }
    };

    calculateStats();
  }, []);

  const userData = getUserData();

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
                Admin Dashboard
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
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <FileCheck className="h-4 w-4 mr-2" />
                Review Pending Verifications ({stats.pendingVerifications})
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage User Accounts
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Platform Analytics
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                System Health Monitor
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
      </div>
    </div>
  );
};

export default AdminDashboard;
