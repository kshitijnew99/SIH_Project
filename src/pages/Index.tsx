import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GovernmentSchemes from "@/components/GovernmentSchemes";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Government Schemes Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Latest Government Updates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed about the latest government schemes, policies, and initiatives for farmers
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <GovernmentSchemes compact={true} />
          </div>
        </div>
      </section>
      
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
