import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Home, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RoleSelection = () => {
  const navigate = useNavigate();
  
  // Check if user already has a permanent role on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.permanentRole) {
        // User already has a permanent role, redirect immediately
        if (userData.permanentRole === 'farmer') {
          navigate('/farmer-dashboard');
        } else if (userData.permanentRole === 'landowner') {
          navigate('/landowner-dashboard');
        } else if (userData.permanentRole === 'admin') {
          navigate('/admin-dashboard');
        }
      }
    }
  }, [navigate]);

  const handleRoleSelection = (role: 'farmer' | 'landowner' | 'admin') => {
    // Check if user is already logged in
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      
      // Check if user already has a permanent role assigned
      if (userData.permanentRole) {
        // User already has a permanent role, redirect to their dashboard
        if (userData.permanentRole === 'farmer') {
          navigate('/farmer-dashboard');
        } else if (userData.permanentRole === 'landowner') {
          navigate('/landowner-dashboard');
        } else if (userData.permanentRole === 'admin') {
          navigate('/admin-dashboard');
        }
        return;
      }
      
      // User is logged in but no permanent role - assign role and redirect to dashboard
      userData.role = role;
      userData.permanentRole = role;
      userData.roleAssignedAt = new Date().toISOString();
      
      // Update registered users database
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((user: any) => user.email === userData.email);
      if (userIndex !== -1) {
        registeredUsers[userIndex].role = role;
        registeredUsers[userIndex].permanentRole = role;
        registeredUsers[userIndex].roleAssignedAt = userData.roleAssignedAt;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (role === 'landowner') {
        navigate('/landowner-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    } else {
      // User is not logged in - store selected role and redirect to auth
      localStorage.setItem('selectedRole', role);
      navigate(`/auth?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">KisanConnect</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-muted-foreground">
              Select how you want to join the KisanConnect community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Farmer Card */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/10">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Sprout className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">I'm a Farmer</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  Find land, access market prices, and rent farming tools
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                  <li>• Access available agricultural land</li>
                  <li>• Get real-time market prices</li>
                  <li>• Rent affordable farming tools</li>
                  <li>• Track your farming progress</li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  onClick={() => handleRoleSelection('farmer')}
                >
                  Continue as Farmer
                </Button>
              </CardContent>
            </Card>

            {/* Landowner Card */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/10">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/50 rounded-full flex items-center justify-center group-hover:bg-secondary/70 transition-colors">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">I'm a Landowner</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  List your land and earn extra income from unused property
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                  <li>• List your agricultural land</li>
                  <li>• Earn rental income</li>
                  <li>• Connect with verified farmers</li>
                  <li>• Monitor land performance</li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  onClick={() => handleRoleSelection('landowner')}
                >
                  Continue as Landowner
                </Button>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/10">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">I'm an Admin</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  Government officer with administrative privileges
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                  <li>• Monitor platform activities</li>
                  <li>• Manage user accounts</li>
                  <li>• Oversee land transactions</li>
                  <li>• Generate system reports</li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  onClick={() => handleRoleSelection('admin')}
                >
                  Continue as Admin
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Select your role to continue with authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;