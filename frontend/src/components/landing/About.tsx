import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Clock, Heart } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Happy Clients",
      description: "Events planned with passion"
    },
    {
      icon: Award,
      number: "50+",
      label: "Awards Won",
      description: "Recognition for excellence"
    },
    {
      icon: Clock,
      number: "5+",
      label: "Years Experience",
      description: "Creating memorable moments"
    },
    {
      icon: Heart,
      number: "100%",
      label: "Client Satisfaction",
      description: "Dedication to perfection"
    }
  ];

  return (
    <section id="about" className="py-20 bg-landing-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-landing-foreground">
                About <span className="text-gradient-purple">TikTechno</span>
              </h2>
              <p className="text-xl text-landing-muted-foreground leading-relaxed mb-6">
                Founded with a passion for creating extraordinary experiences, TikTechno has been 
                at the forefront of event planning and management, transforming visions into 
                unforgettable realities.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-landing-accent">Our Story</h3>
                <p className="text-landing-muted-foreground leading-relaxed">
                  What started as a small team with big dreams has grown into a full-service 
                  event planning company. We believe every celebration deserves to be 
                  extraordinary, and we pour our creativity and expertise into making that happen.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-landing-accent">Our Vision</h3>
                <p className="text-landing-muted-foreground leading-relaxed">
                  To be the leading event planning company that creates magical moments through 
                  innovative design, flawless execution, and personalized service that exceeds 
                  every client's expectations.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-landing-accent">Our Values</h3>
                <ul className="space-y-2 text-landing-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-landing-accent rounded-full mr-3"></div>
                    Creativity in every detail
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-landing-accent rounded-full mr-3"></div>
                    Personalized client experience
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-landing-accent rounded-full mr-3"></div>
                    Quality without compromise
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-landing-accent rounded-full mr-3"></div>
                    Innovation in event design
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="text-center hover:shadow-glow transition-all duration-300 animate-scale-in bg-landing-card border-landing-border" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-gradient rounded-full">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gradient-gold">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-landing-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-landing-muted-foreground">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
