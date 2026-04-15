import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// ===== Google Form config (Contact) =====
const GOOGLE_FORM_ID = "1FAIpQLSf_1AlWKfn60UmoEBHLoortTKrmzwek079tWpjZPYRSRvXAWw";

const CONTACT_ENTRY_IDS = {
  source: "583306411",
  eventType: "937126066",
  fullName: "384454838",
  email: "531447686",
  phone: "57537300",
  message: "176199803",
};

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: ""
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

    if (formData.phone) {
      body.append(`entry.${CONTACT_ENTRY_IDS.phone}`, formData.phone);
    }

    fetch(formAction, { method: "POST", mode: "no-cors", body })
      .then(() => {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours to discuss your event.",
        });
        setFormData({ name: "", email: "", phone: "", eventType: "", message: "" });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappNumbers = {
    USA: "19294969494",
    India: "919343256764"
  };

  const whatsappMessage = "Hi! I'm interested in planning an event with TikTechno.";

  const openWhatsAppChat = () => {
    const number = whatsappNumbers[selectedRegion];
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
  };

  return (
    <section id="contact" className="py-20 bg-landing-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-landing-foreground">
            Let's Create Your <span className="text-gradient-gold">Perfect Event</span>
          </h2>
          <p className="text-xl text-landing-muted-foreground max-w-3xl mx-auto">
            Ready to bring your vision to life? Get in touch with us and let's start
            planning an unforgettable experience together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* WhatsApp Chat Dropdown */}
          <div className="flex flex-col space-y-4 lg:col-span-1">
            <select
              className="px-4 py-2 border rounded-md text-landing-foreground bg-landing-background border-landing-border"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as "USA" | "India")}
            >
              <option value="USA">USA +1 (929) 496-9494</option>
              <option value="India">India +91 93432-56764</option>
            </select>

            <Button
              variant="hero"
              className="w-full"
              onClick={openWhatsAppChat}
            >
              <MessageCircle className="mr-2" size={20} />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant bg-landing-card border-landing-border">
              <CardHeader>
                <CardTitle className="text-2xl text-landing-foreground">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-landing-foreground">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="border-landing-border bg-landing-background text-landing-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-landing-foreground">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="border-landing-border bg-landing-background text-landing-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-landing-foreground">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="123-456-7890"
                        className="border-landing-border bg-landing-background text-landing-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventType" className="text-landing-foreground">Event Type *</Label>
                      <Input
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        placeholder="Wedding, Corporate, Party, etc."
                        required
                        className="border-landing-border bg-landing-background text-landing-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-landing-foreground">Tell Us About Your Event *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your event vision, date, location, and any specific requirements..."
                      className="min-h-[120px] border-landing-border bg-landing-background text-landing-foreground"
                      required
                    />
                  </div>

                  <Button type="submit" variant="glow" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
