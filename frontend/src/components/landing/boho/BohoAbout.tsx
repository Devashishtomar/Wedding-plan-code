import React from "react";
import { Users, Award, Clock, Heart } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "500+",
    label: "Happy Couples",
    description: "Weddings planned with deep devotion.",
  },
  {
    icon: Award,
    number: "50+",
    label: "Excellence Awards",
    description: "Celebrated for luxury details.",
  },
  {
    icon: Clock,
    number: "5+ Years",
    label: "Trusted Experience",
    description: "Executing premium events flawlessly.",
  },
  {
    icon: Heart,
    number: "100%",
    label: "Loving Devotion",
    description: "Personal attention to every couple.",
  },
];

export const BohoAbout: React.FC = () => {
  return (
    <section id="about" className="py-28" style={{ background: "#FAF5EE" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div className="space-y-8 text-left">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#C9973A" }}>
                Our Legacy
              </p>
              <h2
                className="text-4xl sm:text-5xl font-black uppercase mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
              >
                About{" "}
                <span style={{ color: "#C9973A" }}>TikTechno Events</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#6B5744" }}>
                TikTechno operates at the intersection of modern smart technologies and high-end romantic visual arts. We curate wedding narratives that are deeply personal and technically flawless.
              </p>
            </div>

            <div className="space-y-6 text-sm" style={{ color: "#6B5744" }}>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#C9973A" }}>
                  Our Promise
                </h3>
                <p className="leading-relaxed">
                  Every love story is unique, and our absolute promise is to handle every planning detail with meticulous care so you can savor every magical moment of your celebration.
                </p>
              </div>

              <div className="pt-2" style={{ borderTop: "1px solid rgba(201,151,58,0.15)" }}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs uppercase tracking-wider font-semibold" style={{ color: "#6B5744" }}>
                  {[
                    "Bespoke Custom Themes",
                    "Adaptive AI Checklists",
                    "Meticulous Seating Setup",
                    "Complete Peace of Mind",
                  ].map((item) => (
                    <li key={item} className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0" style={{ background: "#C9973A" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(201,151,58,0.2)",
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ background: "rgba(201,151,58,0.1)", color: "#C9973A" }}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div
                  className="text-3xl font-black mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#C9973A" }}
                >
                  {stat.number}
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: "#1A1208" }}>
                  {stat.label}
                </div>
                <div className="text-xs" style={{ color: "#6B5744" }}>
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BohoAbout;
