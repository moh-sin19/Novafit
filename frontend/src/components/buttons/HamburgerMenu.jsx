import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import Logo from "../ui/Logo";
import { X, Menu } from "lucide-react";

export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  return (
    <div>
      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} className="text-primary" />
      </button>

      {/* Full Page Overlay Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all  duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background Overlay */}
        <div
          className={`absolute inset-0 bg-white backdrop-blur-md transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-100"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`relative h-screen flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-stroke">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Close menu"
            >
              <X size={24} className="text-primary" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white flex-1 flex flex-col items-center justify-center px-6 space-y-8">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "features")}
              className="sh1 text-primary hover:text-lavender-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, "about")}
              className="sh1 text-primary hover:text-lavender-600 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className="sh1 text-primary hover:text-lavender-600 transition-colors"
            >
              Contact
            </a>
            <div className="h-px w-24 bg-stroke my-4" />
            <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
              <SecondaryButton fullWidth={true}>Sign In</SecondaryButton>
            </Link>
            <Link to="/auth/create-profile" onClick={() => setMenuOpen(false)}>
              <PrimaryButton fullWidth={true}>REGISTER FOR FREE</PrimaryButton>
            </Link>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stroke bg-white">
            <p className="p4 text-center text-tertiary">
              © 2025 NovaFit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
