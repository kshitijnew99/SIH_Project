import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const stats = [
    { icon: Users, value: "50,000+", label: "Farmers Connected" },
    { icon: TrendingUp, value: "₹2.5 Cr", label: "Income Generated" },
    { icon: Wrench, value: "1,000+", label: "Tools Shared" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center">
          {/* Main Heading */}
          <div className="mb-24">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Empowering{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Small-Scale Farmers
              </span>
              <br />
              Across India
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Access land opportunities, real-time market prices, and affordable farming tools. 
              Build a sustainable future for your agricultural journey.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <stat.icon className="h-10 w-10 text-primary mb-4 mx-auto" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-earth opacity-10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;