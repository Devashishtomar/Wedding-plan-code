import React, { memo } from "react";
import { Heart, Building2, Music, Sparkles } from "lucide-react";
import OptimizedImage from "../OptimizedImage";
import weddingImage from "@/assets/wedding-ceremony.jpg";
import corporateImage from "@/assets/corporate-event.jpg";
import partyImage from "@/assets/dj-party.jpg";

const services = [
  {
    icon: Heart,
    title: "Weddings",
    description: "Transform your special day into a fairytale with our bespoke, rose-tinted wedding planning services.",
    image: weddingImage,
    features: ["Venue decoration", "Lighting design", "Floral arrangements", "Photography coordination"],
  },
  {
    icon: Building2,
    title: "Corporate Events",
    description: "Elegant corporate gatherings that impress clients and inspire teams with sophisticated custom themes.",
    image: corporateImage,
    features: ["Conference setup", "Networking events", "Product launches", "Award ceremonies"],
  },
  {
    icon: Music,
    title: "DJ Parties",
    description: "Vibrant and energetic celebrations equipped with premium sound systems and interactive lighting.",
    image: partyImage,
    features: ["Sound & lighting", "DJ services", "Dance floor setup", "Interactive entertainment"],
  },
  {
    icon: Sparkles,
    title: "Cultural Celebrations",
    description: "Honor beautiful cultural traditions with luxury, authentic, and modern styling details.",
    image: weddingImage,
    features: ["Traditional décors", "Custom catering options", "Ritual coordination", "Traditional entertainment"],
  },
];

const ServiceCard = memo(({ service }: { service: typeof services[0] }) => (
  <div
    className="group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] flex flex-col h-full"
    style={{ background: "#FFFFFF", borderColor: "rgba(201,151,58,0.2)" }}
  >
    {/* Image */}
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <OptimizedImage
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        width={400}
        height={225}
      />
      <div
        className="absolute top-4 left-4 p-3 rounded-full shadow-md"
        style={{ background: "#FFFFFF", color: "#C9973A" }}
      >
        <service.icon className="w-5 h-5" />
      </div>
    </div>

    {/* Content */}
    <div className="p-7 flex flex-col flex-1">
      <h3
        className="text-xl font-bold mb-2 group-hover:text-[#C9973A] transition-colors"
        style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
      >
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B5744" }}>
        {service.description}
      </p>
      <ul className="space-y-2 mt-auto">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center text-xs" style={{ color: "#6B5744" }}>
            <span
              className="w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0"
              style={{ background: "#C9973A" }}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </div>
));

ServiceCard.displayName = "ServiceCard";

export const BohoServices: React.FC = () => {
  return (
    <section id="services" className="py-28" style={{ background: "#F7F0E6" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#C9973A" }}
          >
            Exclusive Offerings
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
          >
            Our Premium{" "}
            <span style={{ color: "#C9973A" }}>Services</span>
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#6B5744" }}>
            From intimate gatherings to grand ballroom ceremonies, we design absolute magic for every milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BohoServices;
