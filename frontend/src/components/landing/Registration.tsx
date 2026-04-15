import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import weddingImage from "@/assets/wedding-ceremony.jpg";
import corporateImage from "@/assets/corporate-event.jpg";
import djPartyImage from "@/assets/dj-party.jpg";
import heroImage from "@/assets/hero-event.jpg";
import RegistrationForm from "./RegistrationForm";

const Registration = () => {
  const [selectedEventType, setSelectedEventType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<{ id: string, title: string } | null>(null);

  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  const eventTypes = [
    {
      id: "wedding",
      title: "Weddings",
      tagline: "Your Dream Wedding Starts Here",
      description: "Create magical moments that last forever",
      image: weddingImage,
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSflDOzD-8Nha1Ha7aD1x5WoUUJJqYju4ThDLUnu93r7D5fkeQ/viewform?usp=dialog",
    },
    {
      id: "corporate",
      title: "Corporate Events",
      tagline: "Professional Excellence Delivered",
      description: "Impress clients and colleagues alike",
      image: corporateImage,
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfX1Ter1gTg4DtECpK873zydLLFZvQDj0dYv5L1HbtNdR0tig/viewform?usp=sharing&ouid=110771291170573337343",
    },
    {
      id: "dj-party",
      title: "DJ Parties",
      tagline: "Dance the Night Away",
      description: "Unforgettable beats and electric atmosphere",
      image: djPartyImage,
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfZs2FEqRNsa5QwyZIAOgEKTnuh4MW3dB748eEGldTZzQbjHw/viewform?usp=header",
    },
    {
      id: "cultural",
      title: "Cultural Celebrations",
      tagline: "Honoring Traditions with Style",
      description: "Authentic experiences with modern flair",
      image: heroImage,
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdsSdr7IqCqfl0vQ9IApqLBoh1XUdGcayLZnfpnUsQasV_-JQ/viewform?usp=sharing&ouid=110771291170573337343",
    },
  ];

  const handleEventTypeSelect = (eventType: string) => {
    setSelectedEventType(eventType);
    const selectedEvent = eventTypes.find(event => event.id === eventType);
    if (selectedEvent) {
      setCurrentEvent({ id: selectedEvent.id, title: selectedEvent.title });
      setShowForm(true);
    }
  };

  const handleCardClick = (event: typeof eventTypes[0]) => {
    setCurrentEvent({ id: event.id, title: event.title });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentEvent(null);
    setSelectedEventType("");
  };

  return (
    <section id="registration" className="py-16 bg-landing-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">
              Register Your Event
            </span>
          </h2>
          <p className="text-xl text-landing-muted-foreground max-w-3xl mx-auto">
            Choose your event type and complete the quick registration form to get started
          </p>
        </div>

        {/* Dropdown Option */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <select
              value={selectedEventType}
              onChange={(e) => handleEventTypeSelect(e.target.value)}
              className="appearance-none bg-landing-card border border-landing-border rounded-lg px-6 py-3 pr-10 text-landing-foreground focus:ring-2 focus:ring-landing-primary focus:border-transparent transition-all duration-300 min-w-[250px]"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-landing-muted-foreground pointer-events-none" size={20} />
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((event, index) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-xl bg-landing-card border border-landing-border hover:border-landing-primary/50 transition-all duration-500 hover:shadow-glow transform hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.image}
                  alt={`${event.title} event styling by TikTechno`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-yellow-400 font-medium mb-2">
                  {event.tagline}
                </p>
                <p className="text-sm text-gray-200 mb-4">
                  {event.description}
                </p>

                <Button
                  variant="glow"
                  size="sm"
                  className="w-full opacity-90 group-hover:opacity-100"
                  onClick={() => handleCardClick(event)}
                >
                  Register Now
                  <ExternalLink size={16} />
                </Button>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-landing-primary/30 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-landing-muted-foreground mb-4">
            Need help choosing the right package for your event?
          </p>
          <Button size="lg" className="bg-transparent border-2 border-landing-primary text-landing-primary hover:bg-landing-primary hover:text-white font-semibold transition-all duration-300" onClick={scrollToRegistration}>
            Schedule a Consultation
          </Button>
        </div>
      </div>

      {/* Registration Form Modal */}
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

export default Registration;
