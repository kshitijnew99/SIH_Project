import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sprout } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileMenu } from "./ui/profile-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    }
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Land", path: "/land" },
    { name: "Market Prices", path: "/market" },
    { name: "Rent Tools", path: "/tools" },
    { name: "Gov Schemes", path: "/schemes" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-sm border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              KisanConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            {userData ? (
              <ProfileMenu userData={userData} />
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Register / Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 text-foreground/80 hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {userData ? (
              <div className="px-3 py-2">
                <ProfileMenu userData={userData} />
              </div>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button variant="hero" size="sm" className="w-full">
                  Register / Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;