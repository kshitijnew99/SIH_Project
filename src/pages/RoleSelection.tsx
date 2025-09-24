import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Home } from "lucide-react";
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
        } else {
          navigate('/landowner-dashboard');
        }
      }
    }
  }, [navigate]);

  const handleRoleSelection = (role: 'farmer' | 'landowner') => {
    // Get existing user data
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      
      // Check if user already has a permanent role assigned
      if (userData.permanentRole) {
        // User already has a permanent role, redirect to their dashboard
        if (userData.permanentRole === 'farmer') {
          navigate('/farmer-dashboard');
        } else {
          navigate('/landowner-dashboard');
        }
        return;
      }
      
      // First time role selection - make it permanent
      userData.role = role;
      userData.permanentRole = role; // Set permanent role that cannot be changed
      userData.roleAssignedAt = new Date().toISOString(); // Track when role was assigned
      
      // Also update the registered users database
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((user: any) => user.email === userData.email);
      if (userIndex !== -1) {
        registeredUsers[userIndex].role = role;
        registeredUsers[userIndex].permanentRole = role;
        registeredUsers[userIndex].roleAssignedAt = userData.roleAssignedAt;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      // Save back to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Navigate to the appropriate dashboard
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/landowner-dashboard');
      }
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

          <div className="grid md:grid-cols-2 gap-8">
            {/* Farmer Card */}
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Sprout className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">I'm a Farmer</CardTitle>
                <CardDescription className="text-base">
                  Find land, access market prices, and rent farming tools
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button 
                  size="lg"
                  onClick={() => handleRoleSelection('farmer')}
                >
                  Continue as Farmer
                </Button>
              </CardContent>
            </Card>

            {/* Land Owner Card */}
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Sprout className="h-10 w-10 text-primary transform rotate-180" />
                </div>
                <CardTitle className="text-2xl">I'm a Land Owner</CardTitle>
                <CardDescription className="text-base">
                  List your land and manage your agricultural properties
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button 
                  size="lg"
                  onClick={() => handleRoleSelection('landowner')}
                >
                  Continue as Land Owner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;