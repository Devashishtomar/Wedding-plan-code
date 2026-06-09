import React from "react";
import { Bot, Calendar, Users, DollarSign, Mail, CheckSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Bot,
    title: "AI Wedding Assistant",
    description: "Get instant answers and customized vendor suggestions from your 24/7 AI concierge companion.",
  },
  {
    icon: CheckSquare,
    title: "Smart Checklists",
    description: "AI-generated checklists that adapt dynamically to your personal timeline and ceremony style.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Track RSVPs, manage dietary requests, and coordinate custom guest seating plans dynamically.",
  },
  {
    icon: DollarSign,
    title: "Budget Tracker",
    description: "Stay in perfect control of your target budget with automatic expense breakdown and pricing warnings.",
  },
  {
    icon: Mail,
    title: "Custom Invitations",
    description: "Design stunning digital invitations with custom RSVP tracking and elegant theme presets.",
  },
  {
    icon: Calendar,
    title: "Timeline Planning",
    description: "Map out every hour of your special day seamlessly to ensure a flawless sequence of celebrations.",
  },
];

export const BohoAIFeatures: React.FC = () => {
  return (
    <section
      className="py-28"
      style={{ background: "#FAF5EE" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#C9973A" }}
          >
            Flawless Smart Planning
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
          >
            Bespoke{" "}
            <span style={{ color: "#C9973A" }}>AI Features</span>
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#6B5744" }}>
            Eliminate traditional stress. Plan your dream event with intelligent automation and real-time coordination.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              style={{
                background: "#FFFFFF",
                borderColor: "rgba(201,151,58,0.2)",
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ background: "rgba(201,151,58,0.1)", color: "#C9973A" }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold mb-2 group-hover:text-[#C9973A] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B5744" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ background: "#C9973A" }}
          >
            Try AI Planner Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BohoAIFeatures;
