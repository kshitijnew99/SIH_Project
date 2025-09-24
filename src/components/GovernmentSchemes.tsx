import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Calendar, 
  ExternalLink, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Megaphone,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const GovernmentSchemes = ({ compact = false }) => {
  // Sample government schemes and policies data
  const schemes = [
    {
      id: 1,
      title: "PM-KISAN Scheme 2024",
      description: "Direct income support of ₹6,000 per year to small and marginal farmers",
      category: "Financial Support",
      status: "Active",
      deadline: "2024-12-31",
      amount: "₹6,000/year",
      eligibility: "Small & marginal farmers with landholding up to 2 hectares",
      link: "https://pmkisan.gov.in/",
      priority: "high",
      datePosted: "2024-09-15"
    },
    {
      id: 2,
      title: "Soil Health Card Scheme",
      description: "Free soil testing and nutrient management recommendations for farmers",
      category: "Agricultural Support",
      status: "Ongoing",
      deadline: "2024-11-30",
      amount: "Free",
      eligibility: "All farmers",
      link: "https://soilhealth.dac.gov.in/",
      priority: "medium",
      datePosted: "2024-09-10"
    },
    {
      id: 3,
      title: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme providing financial support to farmers in case of crop failure",
      category: "Insurance",
      status: "Active",
      deadline: "2024-10-15",
      amount: "Up to ₹2 lakh per hectare",
      eligibility: "All farmers growing notified crops",
      link: "https://pmfby.gov.in/",
      priority: "high",
      datePosted: "2024-09-08"
    },
    {
      id: 4,
      title: "Kisan Credit Card (KCC)",
      description: "Easy access to credit for agricultural and allied activities",
      category: "Credit",
      status: "Active",
      deadline: "Open",
      amount: "Up to ₹3 lakh",
      eligibility: "All farmers, tenant farmers, and sharecroppers",
      link: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc",
      priority: "medium",
      datePosted: "2024-09-05"
    },
    {
      id: 5,
      title: "Agricultural Marketing Reforms",
      description: "New policies for direct marketing and better price realization for farmers",
      category: "Policy Update",
      status: "Recently Updated",
      deadline: "Ongoing",
      amount: "N/A",
      eligibility: "All agricultural producers",
      link: "#",
      priority: "medium",
      datePosted: "2024-09-20"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700';
      case 'Ongoing': return 'bg-blue-50 text-blue-700';
      case 'Recently Updated': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const displaySchemes = compact ? schemes.slice(0, 3) : schemes;

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Government Schemes</CardTitle>
            </div>
            <Link to="/schemes">
              <Button variant="ghost" size="sm">
                View All
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription>Latest government schemes and policies for farmers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displaySchemes.map((scheme) => (
            <div key={scheme.id} className="border-l-4 border-l-primary/20 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{scheme.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {scheme.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(scheme.status)}>
                      {scheme.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{scheme.amount}</span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`ml-2 ${getPriorityColor(scheme.priority)}`}
                >
                  {scheme.priority}
                </Badge>
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link to="/schemes">
              <Button variant="outline" size="sm" className="w-full">
                <Megaphone className="h-4 w-4 mr-2" />
                View All Schemes & Policies
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view for dedicated schemes page
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center">
          <Award className="h-8 w-8 mr-3 text-primary" />
          Government Schemes & Policies
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest government initiatives, schemes, and policies for farmers and agricultural sector
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{scheme.title}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">{scheme.description}</CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={getPriorityColor(scheme.priority)}
                >
                  {scheme.priority} priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={`ml-2 ${getStatusColor(scheme.status)}`}>
                      {scheme.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Amount:</span>
                    <span className="ml-2 font-semibold text-green-600">{scheme.amount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Category:</span>
                    <span className="ml-2">{scheme.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Deadline:</span>
                    <span className="ml-2 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {scheme.deadline}
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Eligibility Criteria:
                  </h4>
                  <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Posted: {scheme.datePosted}
                  </span>
                  <Button asChild size="sm">
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GovernmentSchemes;