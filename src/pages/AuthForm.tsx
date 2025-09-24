import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Home, User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'landowner' | 'farmer'>('landowner');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get form data
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';

      // Check if user is registered (simulate database check)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = registeredUsers.find((user: any) => user.email === email && user.password === password);
      
      if (!existingUser) {
        // User not found or wrong credentials
        alert('Invalid credentials or user not registered. Please register first.');
        return;
      }

      // User found, proceed with login
      const userData = {
        name: existingUser.name,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role || 'landowner',
        permanentRole: existingUser.permanentRole,
        roleAssignedAt: existingUser.roleAssignedAt,
        isAuthenticated: true
      };

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));

      // Navigate based on whether user has permanent role
      if (userData.permanentRole) {
        // User has permanent role, go directly to dashboard
        if (userData.permanentRole === 'farmer') {
          navigate('/farmer-dashboard');
        } else {
          navigate('/landowner-dashboard');
        }
      } else {
        // First time login, need to select role
        navigate('/role-selection');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get form data
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get('fullName')?.toString() || '';
      const firstName = fullName.split(' ')[0]; // Get the first name
      const email = formData.get('registerEmail')?.toString() || '';
      const password = formData.get('registerPassword')?.toString() || '';

      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = registeredUsers.find((user: any) => user.email === email);
      
      if (existingUser) {
        alert('User with this email already exists. Please login instead.');
        return;
      }

      // Create new user data
      const newUser = {
        name: firstName,
        fullName,
        email,
        password, // In production, this should be hashed!
        registeredAt: new Date().toISOString()
      };

      // Add to registered users database
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Set current user data for session
      const userData = {
        name: firstName,
        fullName,
        email,
        role: 'landowner', // Will be set in role selection
        isAuthenticated: true
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      navigate("/role-selection");
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to KisanConnect
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Authentication</CardTitle>
              <CardDescription className="text-center">
                Choose to login or register below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerEmail"
                          name="registerEmail"
                          type="email"
                          placeholder="Enter your email"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerPassword"
                          name="registerPassword"
                          type="password"
                          placeholder="Create a password"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;