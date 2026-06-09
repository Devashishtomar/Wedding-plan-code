import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_FORM_ID = "1FAIpQLSf_1AlWKfn60UmoEBHLoortTKrmzwek079tWpjZPYRSRvXAWw";

const CONTACT_ENTRY_IDS = {
  source: "583306411",
  eventType: "937126066",
  fullName: "384454838",
  email: "531447686",
  phone: "57537300",
  message: "176199803",
};

export const BohoContact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });
  const [selectedRegion, setSelectedRegion] = useState<"USA" | "India">("USA");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formAction = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
    const body = new FormData();
    body.append(`entry.${CONTACT_ENTRY_IDS.source}`, "Contact");
    body.append(`entry.${CONTACT_ENTRY_IDS.fullName}`, formData.name);
    body.append(`entry.${CONTACT_ENTRY_IDS.email}`, formData.email);
    body.append(`entry.${CONTACT_ENTRY_IDS.eventType}`, formData.eventType);
    body.append(`entry.${CONTACT_ENTRY_IDS.message}`, formData.message);
    if (formData.phone) body.append(`entry.${CONTACT_ENTRY_IDS.phone}`, formData.phone);

    fetch(formAction, { method: "POST", mode: "no-cors", body })
      .then(() => {
        toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
        setFormData({ name: "", email: "", phone: "", eventType: "", message: "" });
      })
      .catch(() => {
        toast({ variant: "destructive", title: "Error", description: "Please try again." });
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = selectedRegion === "USA" ? "+19179930707" : "+917006888494";
    const text = encodeURIComponent("Hello TikTechno Events! I'm interested in discussing a bespoke celebration planning layout.");
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="py-28" style={{ background: "#FAF5EE" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#C9973A" }}>
            Connect With Us
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
          >
            Contact{" "}
            <span style={{ color: "#C9973A" }}>Our Producers</span>
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#6B5744" }}>
            Ready to design your fairytale? Send us a message or initiate an instant WhatsApp consultation call.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left: Contact Info + WhatsApp */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left">
            <div className="space-y-6">
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
              >
                TikTechno Events Office
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: "#6B5744" }}>
                Whether you have a fully realized vision or are just starting to plan, our producers are here to help execute absolute magic.
              </p>
              <div className="space-y-4 text-sm" style={{ color: "#6B5744" }}>
                {[
                  "USA Hotline: +1 (917) 993-0707",
                  "India Support: +91 70068 88494",
                  "Email Concierge: support@tiktechno.com",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C9973A" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Block */}
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: "#FFFFFF", border: "1px solid rgba(201,151,58,0.2)" }}
            >
              <h4 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}>
                Instant Consultation Chat
              </h4>
              <p className="text-xs leading-normal" style={{ color: "#6B5744" }}>
                Choose your region to launch a WhatsApp chat directly with our event manager:
              </p>
              <div className="flex gap-2">
                {(["USA", "India"] as const).map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className="flex-1 rounded-full text-xs font-semibold uppercase tracking-wider py-2.5 border transition-all duration-300"
                    style={
                      selectedRegion === region
                        ? { background: "#C9973A", color: "#FFFFFF", borderColor: "#C9973A" }
                        : { background: "transparent", color: "#6B5744", borderColor: "rgba(201,151,58,0.3)" }
                    }
                  >
                    {region} Office
                  </button>
                ))}
              </div>
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full py-3 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: "#25D366" }}
              >
                <MessageCircle size={16} className="fill-current" />
                Launch WhatsApp
              </button>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl overflow-hidden shadow-lg h-full"
              style={{ background: "#FFFFFF", border: "1px solid rgba(201,151,58,0.2)" }}
            >
              <div
                className="p-8 pb-4 text-left"
                style={{ borderBottom: "1px solid rgba(201,151,58,0.1)" }}
              >
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
                >
                  Send a Detailed Request
                </h3>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1A1208" }}>
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="rounded-lg placeholder:text-gray-400"
                        style={{ borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1A1208" }}>
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        className="rounded-lg placeholder:text-gray-400"
                        style={{ borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1A1208" }}>
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="rounded-lg placeholder:text-gray-400"
                        style={{ borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventType" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1A1208" }}>
                        Celebration Type *
                      </Label>
                      <Input
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        placeholder="Wedding, Corporate, Party…"
                        required
                        className="rounded-lg placeholder:text-gray-400"
                        style={{ borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1A1208" }}>
                      Tell Us About Your Event *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your event vision, target date, location, and styling requests..."
                      className="min-h-[120px] rounded-lg placeholder:text-gray-400"
                      style={{ borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full text-sm font-semibold text-white tracking-wider uppercase transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ background: "#C9973A" }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BohoContact;
