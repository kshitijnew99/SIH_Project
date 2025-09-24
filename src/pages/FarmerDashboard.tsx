import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Star, 
  Award, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  FileText, 
  Home,
  Sprout
} from "lucide-react";
import { Link } from "react-router-dom";
import GovernmentSchemes from "@/components/GovernmentSchemes";

const FarmerDashboard = () => {
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
    return { name: 'User' }; // Default fallback
  };

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
              <Badge variant="outline">Farmer Dashboard</Badge>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {userData.name}!</h1>
          <p className="text-muted-foreground">Manage your farming activities and track your progress</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile Overview</CardTitle>
                    <CardDescription>Your farming profile summary</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reviews & Ratings */}
                <div>
                  <h4 className="font-semibold mb-3">Reviews & Ratings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Landowner Reviews</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Buyer Reviews</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.6</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Reviews */}
                <div>
                  <h4 className="font-semibold mb-3">Government Verification</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Verified</span>
                      <Badge variant="default">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scheme Eligibility</span>
                      <Badge variant="secondary">PM-KISAN</Badge>
                    </div>
                  </div>
                </div>

                {/* Points & Badges */}
                <div>
                  <h4 className="font-semibold mb-3">Points & Achievements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Points</span>
                      <span className="font-medium">2,450</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        Workshop Graduate
                      </Badge>
                      <Badge variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        Organic Certified
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Land Reports Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Land Reports</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Financial Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Financial Performance
                    </CardTitle>
                    <CardDescription>Earnings and profit analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Land Rental Savings</span>
                        <span className="font-medium">₹45,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Crop Revenue</span>
                        <span className="font-medium">₹1,20,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Net Profit</span>
                        <span className="font-medium text-green-600">₹75,000</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profit Margin</span>
                        <span>62.5%</span>
                      </div>
                      <Progress value={62.5} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Reports */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Physical Reports
                    </CardTitle>
                    <CardDescription>Land usage and yield data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Area Cultivated</span>
                        <span className="font-medium">2.5 Acres</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Yield</span>
                        <span className="font-medium">25 Quintals/Acre</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Soil Health Score</span>
                        <span className="font-medium text-green-600">8.2/10</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Land Efficiency</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/land">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Find Land</h3>
                      <p className="text-sm text-muted-foreground">Browse available land</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/market">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Market Prices</h3>
                      <p className="text-sm text-muted-foreground">Check current rates</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/tools">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Rent Tools</h3>
                      <p className="text-sm text-muted-foreground">Find farming equipment</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;