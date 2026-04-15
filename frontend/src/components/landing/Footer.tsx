import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/people/Technoid-LLC/100091558797908/?mibextid=ZbWKwL", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/tiktechnonyc?igsh=a3kzbThuNWFjaTNw", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/technoid-usa/about/", label: "Linkedin" },
    { icon: Youtube, href: "https://www.youtube.com/@TechnoidUSA", label: "YouTube" }
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "AI-Powered Event Planning",
    "Smart Venue Management",
    "Digital Event Solutions",
    "Audio-Visual Technology",
    "LED & Intelligent Lighting",
    "Interactive Entertainment Systems"
  ];

  const businessInfo = [
    "Event Technology Consulting",
    "Custom Event Apps",
    "Live Streaming Services",
    "Digital Check-in Systems",
    "Social Media Integration",
    "Event Analytics & Reporting"
  ];

  return (
    <footer className="bg-landing-card border-t border-landing-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <span className="text-3xl font-bold text-gradient-purple">
                TikTechno
              </span>
            </div>
            <p className="text-landing-muted-foreground leading-relaxed">
              Think Events. Build Experiences. Grow Memories. From AI-powered event planning
              to immersive digital experiences, we deliver intelligent solutions that help
              you create unforgettable moments in a technology-first world.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-landing-primary hover:text-landing-primary-foreground transition-colors"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon size={20} />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-landing-foreground">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-landing-muted-foreground hover:text-landing-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Tech */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-landing-foreground">Event Tech</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-landing-muted-foreground text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Solutions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-landing-foreground">Solutions</h3>
            <ul className="space-y-3">
              {businessInfo.slice(0, 4).map((info) => (
                <li key={info}>
                  <span className="text-landing-muted-foreground text-sm">
                    {info}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-12 border-t border-landing-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-landing-foreground">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-landing-accent flex-shrink-0 mt-0.5" />
                  <span className="text-landing-muted-foreground text-sm">
                    info@technoidusa.com
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-landing-accent flex-shrink-0 mt-0.5" />
                  <div className="text-landing-muted-foreground text-sm">
                    <div>USA: +1 (929) 496-9494</div>
                    <div>India: +91 93432-56764</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-landing-foreground">Our Address</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-landing-accent flex-shrink-0 mt-0.5" />
                  <div className="text-landing-muted-foreground text-sm">
                    <div className="font-medium text-landing-foreground">Head Office</div>
                    <div>611 South DuPont Highway, Suite 102</div>
                    <div>Dover, DE 19901</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-landing-accent flex-shrink-0 mt-0.5" />
                  <div className="text-landing-muted-foreground text-sm">
                    <div className="font-medium text-landing-foreground">Corporate Office</div>
                    <div>Suite N-220, 225 Old New Brunswick Rd</div>
                    <div>Piscataway, NJ 08854</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-landing-accent flex-shrink-0 mt-0.5" />
                  <div className="text-landing-muted-foreground text-sm">
                    <div className="font-medium text-landing-foreground">India Office</div>
                    <div>1000, Sudama Nagar</div>
                    <div>Indore 452009</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-landing-foreground">Business Hours</h3>
              <div className="space-y-2 text-sm text-landing-muted-foreground">
                <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                <div>Saturday: 10:00 AM - 6:00 PM</div>
                <div>Sunday: By Appointment</div>
                <div className="text-landing-accent font-medium">24/7 Event Support Available</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-landing-foreground">Get Started</h3>
              <Button variant="hero" className="w-full" onClick={scrollToRegistration}>
                Schedule Free Consultation
              </Button>
              <p className="text-xs text-landing-muted-foreground">
                Ready to transform your event with cutting-edge technology?
                Let's discuss your vision.
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-landing-border" />

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-landing-muted-foreground">
            © {currentYear} TikTechno Events. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-landing-muted-foreground hover:text-landing-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-landing-muted-foreground hover:text-landing-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-landing-muted-foreground hover:text-landing-accent transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
