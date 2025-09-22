import { Card } from "@/components/ui/card";
import { Search, Handshake, FileCheck, Banknote } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Explore available land, check market prices, or find tools to rent in your area",
    },
    {
      icon: Handshake,
      title: "Connect & Negotiate",
      description: "Contact landowners, compare prices, and discuss terms directly through our platform",
    },
    {
      icon: FileCheck,
      title: "Secure Agreement",
      description: "Generate legal agreements automatically with all terms clearly documented",
    },
    {
      icon: Banknote,
      title: "Start Farming",
      description: "Complete the transaction and begin your agricultural journey with confidence",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How KisanConnect Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and secure process to help you succeed
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-sm text-primary font-semibold mb-2">Step {index + 1}</div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 bg-background rounded-full border-2 border-primary/20 transform -translate-y-1/2 z-20"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;