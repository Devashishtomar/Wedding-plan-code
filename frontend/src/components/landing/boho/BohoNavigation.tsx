import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Gallery", href: "#gallery" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export const BohoNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled
          ? "bg-[#F7F0E6]/95 backdrop-blur-md shadow-sm border-b border-[#C9973A]/15 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className="text-xl font-bold tracking-wide"
              style={{ color: "#C9973A", fontFamily: "'Playfair Display', serif" }}
            >
              TikTechno
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-9">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#3B2A1A] hover:text-[#C9973A] transition-colors duration-300 text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-[#3B2A1A] hover:text-[#C9973A] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-6 py-2 rounded-full border border-[#C9973A] text-[#C9973A] hover:bg-[#C9973A] hover:text-white transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#3B2A1A] hover:text-[#C9973A] p-2"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#F7F0E6]/98 border-t border-[#C9973A]/15 px-6 pb-6 pt-4 space-y-3">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2.5 text-[#3B2A1A] hover:text-[#C9973A] font-medium text-sm transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-4 border-t border-[#C9973A]/15 flex flex-col gap-3">
            <Link
              to="/login"
              className="block text-center py-2.5 text-sm text-[#3B2A1A] font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block text-center py-2.5 px-6 rounded-full border border-[#C9973A] text-[#C9973A] font-semibold text-sm hover:bg-[#C9973A] hover:text-white transition-all"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BohoNavigation;
