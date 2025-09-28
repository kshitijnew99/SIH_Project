import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Home, User, Mail, Lock, Shield, Phone, CreditCard, Building2, Badge } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";

const AuthForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'farmer' | 'landowner' | 'admin'>('farmer');

  // Get role from URL parameter or localStorage
  useEffect(() => {
    const urlRole = searchParams.get('role') as 'farmer' | 'landowner' | 'admin';
    const storageRole = localStorage.getItem('selectedRole') as 'farmer' | 'landowner' | 'admin';
    
    if (urlRole && ['farmer', 'landowner', 'admin'].includes(urlRole)) {
      setRole(urlRole);
      localStorage.setItem('selectedRole', urlRole);
    } else if (storageRole && ['farmer', 'landowner', 'admin'].includes(storageRole)) {
      setRole(storageRole);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get form data
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';

      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }

      // Use backend API for login
      const result = await api.auth.login(email, password);
      
      if (result.success) {
        // Clear selected role from localStorage
        localStorage.removeItem('selectedRole');
        
        // Update user role to match selected role
        const userData = result.user;
        userData.role = role;
        userData.permanentRole = role;
        localStorage.setItem('userData', JSON.stringify(userData));

        // Navigate to appropriate dashboard based on selected role
        if (role === 'farmer') {
          navigate('/farmer-dashboard');
        } else if (role === 'landowner') {
          navigate('/landowner-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
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
      const phone = formData.get('phone')?.toString() || '';

      // Get role-specific data
      let roleSpecificData = {};
      if (role === 'farmer') {
        const farmerAadhaar = formData.get('farmerAadhaar')?.toString() || '';
        // Basic Aadhaar validation for farmers
        if (!/^\d{12}$/.test(farmerAadhaar)) {
          alert('Please enter a valid 12-digit Aadhaar number');
          return;
        }
        roleSpecificData = {
          aadhaar: farmerAadhaar,
          district: formData.get('district')?.toString() || '',
          verificationStatus: 'pending', // Requires Aadhaar verification
          aadhaarVerified: false
        };
      } else if (role === 'landowner') {
        const aadhaar = formData.get('aadhaar')?.toString() || '';
        // Basic Aadhaar validation
        if (!/^\d{12}$/.test(aadhaar)) {
          alert('Please enter a valid 12-digit Aadhaar number');
          return;
        }
        roleSpecificData = {
          aadhaar: aadhaar,
          address: formData.get('address')?.toString() || '',
          verificationStatus: 'pending', // Requires Aadhaar verification
          aadhaarVerified: false
        };
      } else if (role === 'admin') {
        roleSpecificData = {
          employeeId: formData.get('employeeId')?.toString() || '',
          department: formData.get('department')?.toString() || '',
          designation: formData.get('designation')?.toString() || '',
          verificationStatus: 'pending', // Requires manual approval
          adminApproved: false
        };
      }

      // Prepare user data for backend API
      const userData = {
        fullName,
        email,
        phone,
        password,
        role,
        ...roleSpecificData
      };

      // Use backend API for registration
      const result = await api.auth.register(userData);
      
      if (result.success) {
        // Clear selected role from localStorage
        localStorage.removeItem('selectedRole');
        
        // Show role-specific success message
        let successMessage = 'Account created successfully!';
        if (role === 'farmer') {
          successMessage += ' Your Aadhaar verification is pending. You can explore lands after verification.';
        } else if (role === 'landowner') {
          successMessage += ' Your Aadhaar verification is pending. You can list lands after verification.';
        } else if (role === 'admin') {
          successMessage += ' Your account is pending approval from senior officials.';
        }
        
        alert(successMessage);

        // Navigate to appropriate dashboard based on role
        if (role === 'farmer') {
          navigate('/farmer-dashboard');
        } else if (role === 'landowner') {
          navigate('/landowner-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // More detailed error messages
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      } else if (error.name === 'NetworkError') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      alert(errorMessage);
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
            <div className="flex items-center justify-center mb-4">
              {role === 'farmer' && <Sprout className="h-8 w-8 text-green-600 mr-2" />}
              {role === 'landowner' && <Home className="h-8 w-8 text-orange-600 mr-2" />}
              {role === 'admin' && <Shield className="h-8 w-8 text-red-600 mr-2" />}
              <div className="text-left">
                <h2 className="text-lg font-semibold capitalize text-foreground">
                  {role} Authentication
                </h2>
                <p className="text-sm text-muted-foreground">
                  {role === 'farmer' && 'Access farming resources and land rentals'}
                  {role === 'landowner' && 'Manage your properties and listings'}
                  {role === 'admin' && 'Government administration panel'}
                </p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to KisanConnect
            </h1>
            <p className="text-muted-foreground">
              Sign in to your {role} account or create a new one
            </p>
            <div className="flex items-center justify-center mt-4">
              <Link 
                to="/role-selection" 
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                Want to change role? Click here
              </Link>
            </div>
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
                    {/* Common Fields */}
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
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Role-Specific Fields */}
                    {role === 'farmer' && (
                      <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border">
                        <h4 className="font-medium text-foreground">Farmer Verification</h4>
                        <div className="space-y-2">
                          <Label htmlFor="farmerAadhaar">Aadhaar Number</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="farmerAadhaar"
                              name="farmerAadhaar"
                              type="text"
                              placeholder="Enter your 12-digit Aadhaar number"
                              required
                              maxLength={12}
                              pattern="[0-9]{12}"
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Required for farmer identity verification
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">District</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="district"
                              name="district"
                              type="text"
                              placeholder="Enter your district"
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {role === 'landowner' && (
                      <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border">
                        <h4 className="font-medium text-foreground">Landowner Verification</h4>
                        <div className="space-y-2">
                          <Label htmlFor="aadhaar">Aadhaar Number</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="aadhaar"
                              name="aadhaar"
                              type="text"
                              placeholder="Enter your 12-digit Aadhaar number"
                              required
                              maxLength={12}
                              pattern="[0-9]{12}"
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Required for land ownership verification
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Property Address</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="address"
                              name="address"
                              type="text"
                              placeholder="Enter your property address"
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {role === 'admin' && (
                      <div className="space-y-4 p-4 bg-accent/10 rounded-lg border border-accent/30">
                        <h4 className="font-medium text-foreground">Government Admin Verification</h4>
                        <div className="space-y-2">
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <div className="relative">
                            <Badge className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="employeeId"
                              name="employeeId"
                              type="text"
                              placeholder="Enter your government employee ID"
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="department"
                              name="department"
                              type="text"
                              placeholder="Enter your department"
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation">Designation</Label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="designation"
                              name="designation"
                              type="text"
                              placeholder="Enter your designation"
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="p-3 bg-accent/20 rounded-md">
                          <p className="text-xs text-foreground font-medium">
                            🔒 Admin accounts require manual verification by senior officials
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="registerPassword"
                          name="registerPassword"
                          type="password"
                          placeholder="Create a strong password"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
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