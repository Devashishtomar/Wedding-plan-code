import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-event.jpg";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ contain: 'layout' }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Elegant event setup showcasing TikTechno's professional event planning"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="block text-landing-foreground">Crafting</span>
          <span className="block text-gradient-hero">
            Unforgettable
          </span>
          <span className="block text-landing-foreground">Events</span>
        </h1>

        <p className="text-xl md:text-2xl text-landing-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          From dream weddings to corporate galas, we bring your vision to life with
          creative décor, stunning lighting, and personalized experiences that leave
          lasting impressions.
        </p>

        {/* AI Wedding Planner Feature Box */}
        <div className="bg-white/10 backdrop-blur-sm border border-landing-accent/30 rounded-xl p-4 mb-10 max-w-xl mx-auto text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-landing-accent/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-landing-accent" />
            </div>
            <span className="font-semibold text-landing-foreground">NEW: AI Wedding Planner</span>
          </div>
          <p className="text-landing-muted-foreground text-sm mb-3">
            Plan your wedding effortlessly with our AI assistant — manage guests, budgets, checklists, and custom invitations all in one place.
          </p>
          <Button variant="hero" size="sm" asChild>
            <Link to="/login">
              Try It Free
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-lg" onClick={scrollToServices}>
            Explore Our Services
          </Button>
          <Button variant="outline" size="lg" className="text-lg bg-white text-black font-semibold hover:bg-white/90 border-0" asChild>
            <Link to="/register">
              Create Your Wedding
            </Link>
          </Button>
        </div>
      </div>

      {/* Static decorative elements */}
      <div className="absolute top-1/3 left-10 opacity-10 hidden md:block">
        <div className="w-32 h-32 bg-purple-gradient rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-1/3 right-10 opacity-15 hidden md:block">
        <div className="w-20 h-20 bg-gold-gradient rounded-full blur-lg"></div>
      </div>
    </section>
  );
};

export default Hero;
