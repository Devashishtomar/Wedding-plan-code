import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Building2, Music, Sparkles } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import weddingImage from "@/assets/wedding-ceremony.jpg";
import corporateImage from "@/assets/corporate-event.jpg";
import partyImage from "@/assets/dj-party.jpg";

const services = [
  {
    icon: Heart,
    title: "Weddings",
    description: "Transform your special day into a fairytale with our bespoke wedding planning services.",
    image: weddingImage,
    features: ["Venue decoration", "Lighting design", "Floral arrangements", "Photography coordination"]
  },
  {
    icon: Building2,
    title: "Corporate Events",
    description: "Professional events that impress clients and inspire teams with sophisticated planning.",
    image: corporateImage,
    features: ["Conference setup", "Networking events", "Product launches", "Award ceremonies"]
  },
  {
    icon: Music,
    title: "DJ Parties",
    description: "Energetic celebrations with top-tier sound systems and vibrant lighting effects.",
    image: partyImage,
    features: ["Sound & lighting", "DJ services", "Dance floor setup", "Interactive entertainment"]
  },
  {
    icon: Sparkles,
    title: "Cultural Celebrations",
    description: "Honor traditions with culturally authentic décor and meaningful ceremonies.",
    image: weddingImage,
    features: ["Traditional décor", "Cultural music", "Authentic cuisine", "Ceremonial coordination"]
  }
];

const ServiceCard = memo(({ service }: { service: typeof services[0] }) => (
  <Card 
    className="group hover:shadow-elegant transition-shadow duration-300 overflow-hidden bg-landing-card border-landing-border"
    style={{ contain: 'layout paint' }}
  >
    <div className="relative h-48 overflow-hidden">
      <OptimizedImage
        src={service.image}
        alt={`${service.title} event setup by TikTechno`}
        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        width={600}
        height={192}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-landing-card to-transparent opacity-60"></div>
      <div className="absolute bottom-4 left-4">
        <service.icon className="w-8 h-8 text-landing-accent" />
      </div>
    </div>
    
    <CardHeader>
      <CardTitle className="text-2xl group-hover:text-landing-accent transition-colors text-landing-foreground">
        {service.title}
      </CardTitle>
      <CardDescription className="text-base text-landing-muted-foreground">
        {service.description}
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <ul className="space-y-2">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center text-sm text-landing-muted-foreground">
            <Sparkles className="w-4 h-4 text-landing-accent mr-2 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
));

ServiceCard.displayName = "ServiceCard";

const Services = () => {
  return (
    <section id="services" className="py-20 bg-landing-secondary/30" style={{ contain: 'layout' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-landing-foreground">
            Our <span className="text-gradient-purple">Services</span>
          </h2>
          <p className="text-xl text-landing-muted-foreground max-w-3xl mx-auto">
            We specialize in creating extraordinary experiences across all types of events, 
            bringing creativity and professionalism to every celebration.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
