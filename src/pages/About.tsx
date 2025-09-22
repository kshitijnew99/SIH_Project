import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Target,
  Users,
  Sprout,
  HandshakeIcon,
  Building2,
  GanttChartSquare,
  Tractor,
  LandPlot,
  Leaf,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Sprout className="h-12 w-12 text-primary" />,
      title: "Agricultural Innovation",
      description: "Empowering farmers with modern tools and technology to enhance India's primary sector"
    },
    {
      icon: <HandshakeIcon className="h-12 w-12 text-primary" />,
      title: "Community Connection",
      description: "Building bridges between farmers, landowners, and agricultural resources"
    },
    {
      icon: <GanttChartSquare className="h-12 w-12 text-primary" />,
      title: "Resource Optimization",
      description: "Efficient management and processing of agricultural produce and resources"
    }
  ];

  const offerings = [
    {
      icon: <Tractor className="h-8 w-8 text-primary" />,
      title: "Equipment Sharing",
      description: "Access to modern farming equipment through an innovative rental system"
    },
    {
      icon: <LandPlot className="h-8 w-8 text-primary" />,
      title: "Land Leasing",
      description: "Connecting landowners with farmers for sustainable cultivation"
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Sustainable Practices",
      description: "Promoting eco-friendly and efficient farming methods"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Transforming Indian Agriculture
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              An AICTE-supported initiative to revolutionize and strengthen India's agricultural sector through technology and innovation.
            </p>
          </div>

          {/* Mission Card */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-8 w-8 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground">
                Kisan Connect is a government-backed platform designed to address the evolving needs of India's agricultural sector. Our mission is to enhance agricultural productivity, promote resource sharing, and create sustainable farming practices through innovative technology solutions.
              </p>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center mb-8">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offerings.map((offering, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      {offering.icon}
                      <h3 className="text-xl font-semibold">{offering.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{offering.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Initiative Details */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building2 className="h-8 w-8 text-primary" />
                Government Initiative
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Problem Statement ID: 25126</li>
                    <li>Category: Software</li>
                    <li>Theme: Agriculture, FoodTech & Rural Development</li>
                    <li>Organization: AICTE</li>
                    <li>Department: AICTE, MIC-Student Innovation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Our Objectives</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Enhance the primary sector of India through technological innovation</li>
                    <li>Facilitate efficient management of agricultural resources</li>
                    <li>Create a sustainable ecosystem for farmers and landowners</li>
                    <li>Promote modern farming practices and equipment sharing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-8 w-8 text-primary" />
                Our Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-muted-foreground">
                Through our platform, we're working to create a more efficient and sustainable agricultural ecosystem in India. By connecting farmers with resources, promoting equipment sharing, and facilitating land leasing, we're helping to build a stronger agricultural sector that benefits all stakeholders.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;