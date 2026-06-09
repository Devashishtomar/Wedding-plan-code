import React from "react";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export const BohoFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToRegistration = () => {
    document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/people/Technoid-LLC/100091558797908/?mibextid=ZbWKwL", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/tiktechnonyc?igsh=a3kzbThuNWFjaTNw", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/technoid-usa/about/", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@TechnoidUSA", label: "YouTube" },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Bespoke Wedding Styling",
    "Real-time Budget Mapping",
    "Digital Smart Invitations",
    "Interactive Seating Planner",
    "Direct Google RSVP Integrations",
    "Expert Floral Curations",
  ];

  return (
    <footer
      className="pt-20 pb-6"
      style={{
        background: "#F7F0E6",
        borderTop: "1px solid rgba(201,151,58,0.15)",
        color: "#6B5744",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">

          {/* Brand */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <h3
              className="text-xl font-bold tracking-wide uppercase"
              style={{ fontFamily: "'Playfair Display', serif", color: "#C9973A" }}
            >
              TikTechno Events
            </h3>
            <p className="text-sm font-light leading-relaxed max-w-sm">
              We operate at the forefront of digital excellence and high-end design to construct unforgettable real-life wedding ceremonies and social galas.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-full border transition-all duration-300"
                  style={{
                    background: "#FFFFFF",
                    borderColor: "rgba(201,151,58,0.2)",
                    color: "#6B5744",
                  }}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#C9973A";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9973A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#FFFFFF";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#6B5744";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,151,58,0.2)";
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#1A1208" }}>
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm font-light">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:text-[#C9973A]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#1A1208" }}>
              Smart Capabilities
            </h3>
            <ul className="space-y-2.5 text-sm font-light">
              {services.map((service) => (
                <li key={service} className="hover:text-[#C9973A] transition-colors cursor-pointer">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & CTA */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#1A1208" }}>
                Office & Hours
              </h3>
              <div className="space-y-1.5 text-sm font-light">
                <div>Monday – Friday: 9 AM – 7 PM</div>
                <div>Saturday: 10 AM – 6 PM</div>
                <div className="font-medium" style={{ color: "#C9973A" }}>24/7 Producer Support Active</div>
              </div>
            </div>
            <button
              className="w-full py-3.5 rounded-full text-sm font-semibold text-white tracking-wider uppercase transition-all hover:opacity-90 shadow-sm"
              style={{ background: "#C9973A" }}
              onClick={scrollToRegistration}
            >
              Free Consultation
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: "rgba(201,151,58,0.15)" }} />

        {/* Copyright */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light">
          <div>© {currentYear} TikTechno Events. Crafted with pure devotion.</div>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
              <a key={item} href="#" className="hover:text-[#C9973A] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BohoFooter;
