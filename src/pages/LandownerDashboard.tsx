import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Shield,
  Zap,
  Droplets,
  Route,
  BarChart3,
  TrendingUp,
  MapPin,
  Award,
  Home,
  Sprout,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const LandownerDashboard = () => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

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

  const getLandListings = () => {
    try {
      const listings = localStorage.getItem('landListings');
      if (listings) {
        return JSON.parse(listings);
      }
    } catch (error) {
      console.error('Error reading land listings:', error);
    }
    return [];
  };

  // Toggle land listing status
  const toggleLandStatus = (landId: number) => {
    try {
      const listings = getLandListings();
      const updatedListings = listings.map((land: any) => {
        if (land.id === landId) {
          const newStatus = land.status === 'available' ? 'unlisted' : 'available';
          return { ...land, status: newStatus };
        }
        return land;
      });
      
      localStorage.setItem('landListings', JSON.stringify(updatedListings));
      setRefreshKey(prev => prev + 1); // Force re-render
      
      const updatedLand = updatedListings.find((land: any) => land.id === landId);
      toast({
        title: "Success!",
        description: `Land listing ${updatedLand.status === 'available' ? 'made available' : 'unlisted'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update land status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const userData = getUserData();
  const landListings = getLandListings();

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
              <Badge variant="secondary">Landowner Dashboard</Badge>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your land listings and track performance
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Profile Overview</CardTitle>
                    <CardDescription>
                      Your land ownership summary
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Land Statistics */}
                <div>
                  <h4 className="font-semibold mb-3">Land Portfolio</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Lands</span>
                      <Badge variant="outline">{landListings.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Available for Lease</span>
                      <Badge variant="outline">
                        {landListings.filter(land => land.status === 'available').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unlisted</span>
                      <Badge variant="outline">
                        {landListings.filter(land => land.status === 'unlisted').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Area</span>
                      <Badge variant="outline">
                        {landListings.reduce((total, land) => total + parseFloat(land.area || 0), 0)} acres
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Government Approved</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">KYC Completed</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Land Infrastructure */}
                <div>
                  <h4 className="font-semibold mb-3">Infrastructure Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Route className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Road Connectivity</span>
                      </div>
                      <Badge variant="default">Paved Road</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Electricity</span>
                      </div>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Water Access</span>
                      </div>
                      <Badge variant="default">Borewell + Canal</Badge>
                    </div>
                  </div>
                </div>

                {/* Soil & Testing */}
                <div>
                  <h4 className="font-semibold mb-3">Land Quality</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Soil Test Score</span>
                      <span className="font-medium text-green-600">8.5/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GPS Mapped</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Drone Survey</span>
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Analytics */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Performance Analytics
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Rental Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Rental Income
                    </CardTitle>
                    <CardDescription>
                      Monthly earnings from land rental
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This Month</span>
                        <span className="font-medium">₹15,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>This Year</span>
                        <span className="font-medium">₹1,50,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Earnings</span>
                        <span className="font-medium text-green-600">
                          ₹4,50,000
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Occupancy Rate</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Land Fertility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Fertility Index
                    </CardTitle>
                    <CardDescription>
                      Historical crop success on your land
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Rice Yield</span>
                        <span className="font-medium">28 Quintals/Acre</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Wheat Yield</span>
                        <span className="font-medium">22 Quintals/Acre</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium text-green-600">92%</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Fertility</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Land Listings */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Your Land Listings
              </h2>
              <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
                {landListings.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">
                      No land listings yet. Add your first land to get started.
                    </p>
                  </div>
                ) : (
                  landListings.map((land: any) => (
                    <Card key={land.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">
                              {land.title}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{land.area} Acres, {land.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>₹{land.rentalPrice}/month per acre</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge 
                                variant={
                                  land.status === 'available' ? 'secondary' : 
                                  land.status === 'unlisted' ? 'outline' : 'default'
                                }
                                className={
                                  land.status === 'available' ? 'bg-green-50 text-green-700' :
                                  land.status === 'unlisted' ? 'bg-gray-50 text-gray-700' :
                                  'bg-blue-50 text-blue-700'
                                }
                              >
                                {land.status === 'available' ? 'Available for Lease' : 
                                 land.status === 'unlisted' ? 'Unlisted' : 'Currently Rented'}
                              </Badge>
                              {land.certification && (
                                <Badge variant="outline">{land.certification}</Badge>
                              )}
                              {land.season && (
                                <Badge variant="outline">{land.season}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                            <Button
                              variant={land.status === 'available' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => toggleLandStatus(land.id)}
                              className="flex items-center space-x-2"
                            >
                              {land.status === 'available' ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  <span>Unlist Land</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span>List for Lease</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/landowner/add-new-land")
                  }
                >
                  <CardHeader className="p-6 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <CardTitle>
                      <span>Add New Land</span>
                    </CardTitle>
                    <CardDescription>
                      Register a new agricultural land
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/landowner/view-analytics")
                  }
                >
                  <CardHeader className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <CardTitle>
                      <span>View Analytics</span>
                    </CardTitle>
                    <CardDescription>
                      Check land performance metrics
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/landowner/update-profile")
                  }
                >
                  <CardHeader className="p-6 text-center">
                    <User className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <CardTitle>
                      {/* <User className="flex items-center  text-primary" /> */}
                      <span>Update Profile</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your account settings
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandownerDashboard;
