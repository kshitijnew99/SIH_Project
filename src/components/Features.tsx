import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Wrench, FileText, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Find Agricultural Land",
      description: "Browse available land with complete details about water, electricity, soil quality, and climate conditions.",
      benefits: ["Transparent pricing", "Verified listings", "Legal agreement generation"],
      link: "/land",
      color: "bg-gradient-primary",
    },
    {
      icon: TrendingUp,
      title: "Real-time Market Prices",
      description: "Get updated prices from different mandis to ensure you sell your crops at the best rates.",
      benefits: ["Live price updates", "Multiple mandi comparison", "Price trend analysis"],
      link: "/market",
      color: "bg-gradient-earth",
    },
    {
      icon: Wrench,
      title: "Rent Farming Equipment",
      description: "Access affordable farming tools and machinery from your community without heavy investment.",
      benefits: ["Low rental costs", "Quality equipment", "Flexible rental periods"],
      link: "/tools",
      color: "bg-gradient-hero",
    },
  ];

  const additionalBenefits = [
    { icon: FileText, title: "Digital Agreements", description: "Secure and legal documentation for all transactions" },
    { icon: Shield, title: "Verified Listings", description: "All land and equipment verified for authenticity" },
    { icon: Users, title: "Community Support", description: "Connect with fellow farmers and share knowledge" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Solutions for Modern Farming
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in agriculture, from land access to market intelligence
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link to={feature.link}>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-card rounded-2xl p-8 shadow-md">
          <h3 className="text-2xl font-semibold text-center mb-8">Why Choose KisanConnect?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <benefit.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;