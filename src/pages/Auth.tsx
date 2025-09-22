import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
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
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                  <li>• Access available agricultural land</li>
                  <li>• Get real-time market prices</li>
                  <li>• Rent affordable farming tools</li>
                  <li>• Track your farming progress</li>
                </ul>
                <Link to="/farmer-dashboard">
                  <Button size="lg" className="w-full">
                    Continue as Farmer
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Landowner Card */}
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Home className="h-10 w-10 text-secondary" />
                </div>
                <CardTitle className="text-2xl">I'm a Landowner</CardTitle>
                <CardDescription className="text-base">
                  List your land and earn extra income from unused property
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                  <li>• List your agricultural land</li>
                  <li>• Earn rental income</li>
                  <li>• Connect with verified farmers</li>
                  <li>• Monitor land performance</li>
                </ul>
                <Link to="/landowner-dashboard">
                  <Button size="lg" className="w-full" variant="secondary">
                    Continue as Landowner
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto">
                Sign in here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;