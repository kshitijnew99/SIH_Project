import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sprout } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileMenu } from "./ui/profile-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const checkAuthState = () => {
      const storedData = localStorage.getItem('userData');
      const token = localStorage.getItem('userToken');
      if (storedData && token) {
        try {
          const parsedData = JSON.parse(storedData);
          // Only update if data has changed
          if (!userData || userData.name !== parsedData.name || userData.role !== parsedData.role) {
            setUserData(parsedData);
          }
        } catch (error) {
          console.error('Error parsing userData:', error);
          // Clear invalid data
          localStorage.removeItem('userData');
          localStorage.removeItem('userToken');
          setUserData(null);
        }
      } else {
        // No valid auth data, clear user state
        if (userData) {
          setUserData(null);
        }
      }
    };

    // Initial check
    checkAuthState();

    // Set up periodic check for auth state changes
    const interval = setInterval(checkAuthState, 1000);

    return () => clearInterval(interval);
  }, [userData]);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.findLand"), path: "/land" },
    { name: t("nav.market"), path: "/market" },
    { name: t("nav.equipment"), path: "/tools" },
    { name: t("nav.schemes"), path: "/schemes" },
    { name: t("nav.about"), path: "/about" },
    { name: "🏦 Lender Portal", path: "/lender/dashboard", isNew: true },
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
                className={`text-foreground/80 hover:text-primary transition-colors duration-200 font-medium ${
                  link.isNew ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <LanguageSwitcher />
            {userData ? (
              <ProfileMenu userData={userData} />
            ) : (
              <Link to="/role-selection">
                <Button variant="hero" size="sm">
                  {t("nav.register")} / {t("nav.login")}
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
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            {userData ? (
              <div className="px-3 py-2">
                <ProfileMenu userData={userData} />
              </div>
            ) : (
              <Link
                to="/role-selection"
                className="block px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button variant="hero" size="sm" className="w-full">
                  {t("nav.register")} / {t("nav.login")}
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