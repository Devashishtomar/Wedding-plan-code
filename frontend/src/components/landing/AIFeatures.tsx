import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, Users, DollarSign, Mail, CheckSquare, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Bot,
    title: "AI Wedding Assistant",
    description: "Get instant answers and personalized recommendations from your 24/7 AI planning companion."
  },
  {
    icon: CheckSquare,
    title: "Smart Checklists",
    description: "AI-generated task lists that adapt to your timeline and wedding style."
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Track RSVPs, manage seating, and organize guest information effortlessly."
  },
  {
    icon: DollarSign,
    title: "Budget Tracker",
    description: "Stay on budget with smart expense tracking and spending insights."
  },
  {
    icon: Mail,
    title: "Custom Invitations",
    description: "Design beautiful digital invitations with full customization options."
  },
  {
    icon: Calendar,
    title: "Timeline Planning",
    description: "Organize your wedding day schedule down to the last detail."
  }
];

const AIFeatures = () => {
  return (
    <section className="py-20 bg-black/95 relative overflow-hidden">
      {/* Decorative elements matching hero */}
      <div className="absolute top-20 left-10 opacity-10 hidden md:block">
        <div className="w-40 h-40 bg-purple-gradient rounded-full blur-2xl"></div>
      </div>
      <div className="absolute bottom-20 right-20 opacity-15 hidden md:block">
        <div className="w-32 h-32 bg-gold-gradient rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-landing-accent/20 border border-landing-accent/40 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-landing-accent" />
            <span className="text-sm font-medium text-landing-accent">Wedding Planning Tool</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-landing-foreground">
            Plan Your <span className="text-gradient-hero">Dream Wedding</span> with AI
          </h2>
          <p className="text-xl text-landing-muted-foreground max-w-3xl mx-auto">
            Our AI-powered wedding planner handles the details, so you can focus on 
            what matters most — celebrating your special day.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="group hover:shadow-glow transition-all duration-300 bg-white/5 backdrop-blur-sm border-white/10 hover:border-landing-accent/50"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-landing-accent/20 rounded-xl flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-landing-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-landing-foreground mb-2 group-hover:text-landing-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-landing-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg" asChild>
            <Link to="/login">
              Try AI Planner Free
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;