
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { currentUser, userData, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    const baseLinks = [
      { name: t("nav.home"), href: "/", requiredAuth: false },
      { name: t("nav.dashboard"), href: "/dashboard", requiredAuth: true },
      { name: t("nav.appointments"), href: userData?.role === "doctor" ? "/doctor/appointments" : "/appointments", requiredAuth: true },
      { name: t("nav.doctors"), href: "/doctors", requiredAuth: false, hideForRoles: ["doctor", "admin"] },
      { name: t("nav.consultations"), href: "/consultations", requiredAuth: true },
      { name: t("nav.documents"), href: "/documents", requiredAuth: true },
      { name: t("nav.settings"), href: "/settings", requiredAuth: true },
    ];
    
    // Add doctor-specific links
    if (userData?.role === "doctor") {
      baseLinks.push({ name: "Patients", href: "/patients", requiredAuth: true });
    }
    
    // Filter links based on user role
    const filteredLinks = baseLinks.filter(link => {
      if (link.hideForRoles && userData?.role && link.hideForRoles.includes(userData.role)) {
        return false;
      }
      return true;
    });
    
    setNavLinks(filteredLinks);
  }, [t, userData]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="telecare-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-telecare-500">{t("general.appName")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks
              .filter((link) => !link.requiredAuth || currentUser)
              .map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-telecare-600 font-semibold"
                      : "text-gray-600 hover:text-telecare-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />

            {!currentUser ? (
              <div className="space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">{t("auth.login")}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t("auth.signup")}</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar>
                      <AvatarImage src={currentUser.photoURL || ""} alt={userData?.name || ""} />
                      <AvatarFallback>
                        {getInitials(userData?.name || currentUser.displayName || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userData && (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{userData.name}</p>
                        <p className="text-xs text-muted-foreground">{userData.email}</p>
                        {userData.role && (
                          <p className="text-xs text-muted-foreground capitalize">Role: {userData.role}</p>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">{t("nav.dashboard")}</Link>
                  </DropdownMenuItem>
                  {userData?.role === "doctor" && (
                    <DropdownMenuItem asChild>
                      <Link to="/patients">Manage Patients</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings">{t("nav.settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/features">Platform Features</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {navLinks
              .filter((link) => !link.requiredAuth || currentUser)
              .map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.href
                      ? "text-telecare-600 bg-gray-50"
                      : "text-gray-600 hover:text-telecare-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

            <div className="pt-4 flex flex-col space-y-2">
              {!currentUser ? (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      {t("auth.login")}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      {t("auth.signup")}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/features" onClick={() => setMobileMenuOpen(false)}>
                      Platform Features
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    {t("auth.logout")}
                  </Button>
                </>
              )}
            </div>
            
            <div className="pt-4">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
