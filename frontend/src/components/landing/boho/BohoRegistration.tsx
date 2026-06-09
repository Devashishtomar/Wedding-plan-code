import React, { useState } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import weddingImage from "@/assets/wedding-ceremony.jpg";
import corporateImage from "@/assets/corporate-event.jpg";
import djPartyImage from "@/assets/dj-party.jpg";
import heroImage from "@/assets/hero-event.jpg";
import RegistrationForm from "../RegistrationForm";

const eventTypes = [
  {
    id: "wedding",
    title: "Weddings",
    tagline: "Your Dream Wedding Starts Here",
    description: "Create romantic, bespoke moments that live in your hearts forever.",
    image: weddingImage,
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSflDOzD-8Nha1Ha7aD1x5WoUUJJqYju4ThDLUnu93r7D5fkeQ/viewform?usp=dialog",
  },
  {
    id: "corporate",
    title: "Corporate Events",
    tagline: "Impeccable Professional Productions",
    description: "Impress business partners and motivate colleagues with pristine designs.",
    image: corporateImage,
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfX1Ter1gTg4DtECpK873zydLLFZvQDj0dYv5L1HbtNdR0tig/viewform?usp=sharing&ouid=110771291170573337343",
  },
  {
    id: "dj-party",
    title: "DJ Parties",
    tagline: "Dance Beneath Vibrant Lights",
    description: "Electrifying soundtracks and customized dance stage productions.",
    image: djPartyImage,
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfZs2FEqRNsa5QwyZIAOgEKTnuh4MW3dB748eEGldTZzQbjHw/viewform?usp=header",
  },
  {
    id: "cultural",
    title: "Cultural Celebrations",
    tagline: "Upholding Heritage with Style",
    description: "Rich, authentic cultural décors combined with flawless modern coordination.",
    image: heroImage,
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSflDOzD-8Nha1Ha7aD1x5WoUUJJqYju4ThDLUnu93r7D5fkeQ/viewform?usp=dialog",
  },
];

export const BohoRegistration: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<{ id: string; title: string } | null>(null);

  const handleCardClick = (event: typeof eventTypes[0]) => {
    setCurrentEvent({ id: event.id, title: event.title });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentEvent(null);
  };

  return (
    <section id="registration" className="py-28" style={{ background: "#FAF5EE" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#C9973A" }}>
            Begin Your Journey
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
          >
            Register Your{" "}
            <span style={{ color: "#C9973A" }}>Dream Event</span>
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#6B5744" }}>
            Select your celebration type below. Easily initiate your smart planning dashboard or secure custom packages.
          </p>
        </div>

        {/* Mobile Dropdown */}
        <div className="block md:hidden mb-10 max-w-sm mx-auto">
          <div className="relative">
            <select
              className="w-full border rounded-xl py-3.5 px-4 text-sm focus:outline-none appearance-none shadow-sm font-medium"
              style={{
                background: "#FFFFFF",
                borderColor: "rgba(201,151,58,0.35)",
                color: "#1A1208",
              }}
              value={selectedEventType}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedEventType(val);
                if (val) {
                  const ev = eventTypes.find((x) => x.id === val);
                  if (ev) handleCardClick(ev);
                }
              }}
            >
              <option value="">Select Celebration Type...</option>
              {eventTypes.map((event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4" style={{ color: "#C9973A" }} />
          </div>
        </div>

        {/* Desktop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((event) => (
            <div
              key={event.id}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ border: "1px solid rgba(201,151,58,0.15)" }}
              onClick={() => handleCardClick(event)}
            >
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <span
                  className="inline-block text-[9px] font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-3"
                  style={{ background: "#C9973A" }}
                >
                  Explore
                </span>
                <h3 className="text-xl font-bold mb-1 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {event.title}
                </h3>
                <p className="text-[10px] uppercase tracking-wider font-semibold mb-2 text-amber-300">
                  {event.tagline}
                </p>
                <p className="text-xs text-gray-300 font-light mb-4 leading-normal">
                  {event.description}
                </p>
                <button
                  className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90"
                  style={{ background: "#C9973A", color: "#FFFFFF" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(event);
                  }}
                >
                  Register Now
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-8" style={{ borderTop: "1px solid rgba(201,151,58,0.15)" }}>
          <p className="mb-4 text-sm font-light" style={{ color: "#6B5744" }}>
            Need customized support to map out a bespoke celebration plan?
          </p>
          <button
            className="px-10 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider border transition-all duration-300 hover:text-white"
            style={{
              borderColor: "#C9973A",
              color: "#C9973A",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#C9973A";
              (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#C9973A";
            }}
            onClick={() => handleCardClick(eventTypes[0])}
          >
            Schedule a Consultation
          </button>
        </div>
      </div>

      {showForm && currentEvent && (
        <RegistrationForm
          eventType={currentEvent.id}
          eventTitle={currentEvent.title}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
};

export default BohoRegistration;
