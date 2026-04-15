import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, Users, MapPin, Phone, Mail, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ===== Google Form config (Registration) =====
const GOOGLE_FORM_ID = "1FAIpQLSf_1AlWKfn60UmoEBHLoortTKrmzwek079tWpjZPYRSRvXAWw";

const ENTRY_IDS = {
  source: "583306411",
  eventType: "937126066",
  firstName: "2028767834",
  lastName: "1813868822",
  email: "531447686",
  phone: "57537300",
  eventDate: "940187516",
  eventTime: "737883268",
  guestCount: "1679013550",
  venue: "313194379",
  budget: "1380161352",
  specialRequests: "176199803",
};

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Please select an event date"),
  eventTime: z.string().min(1, "Please select an event time"),
  guestCount: z.string().min(1, "Please specify the number of guests"),
  venue: z.string().min(1, "Please specify the venue or location"),
  budget: z.string().min(1, "Please select your budget range"),
  specialRequests: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  eventType: string;
  eventTitle: string;
  onClose: () => void;
}

const RegistrationForm = ({ eventType, eventTitle, onClose }: RegistrationFormProps) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const getBudgetOptions = () => {
    switch (eventType) {
      case 'wedding':
        return [
          '₹50,000 - ₹1,00,000',
          '₹1,00,000 - ₹2,50,000',
          '₹2,50,000 - ₹5,00,000',
          '₹5,00,000 - ₹10,00,000',
          '₹10,00,000+'
        ];
      case 'corporate':
        return [
          '₹25,000 - ₹50,000',
          '₹50,000 - ₹1,00,000',
          '₹1,00,000 - ₹2,50,000',
          '₹2,50,000 - ₹5,00,000',
          '₹5,00,000+'
        ];
      case 'dj-party':
        return [
          '₹15,000 - ₹30,000',
          '₹30,000 - ₹50,000',
          '₹50,000 - ₹1,00,000',
          '₹1,00,000 - ₹2,00,000',
          '₹2,00,000+'
        ];
      case 'cultural':
        return [
          '₹20,000 - ₹50,000',
          '₹50,000 - ₹1,00,000',
          '₹1,00,000 - ₹2,50,000',
          '₹2,50,000 - ₹5,00,000',
          '₹5,00,000+'
        ];
      default:
        return ['₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000+'];
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const formAction = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
      const body = new FormData();

      body.append(`entry.${ENTRY_IDS.source}`, "Registration");
      body.append(`entry.${ENTRY_IDS.eventType}`, eventTitle);

      if (data.firstName) body.append(`entry.${ENTRY_IDS.firstName}`, data.firstName);
      if (data.lastName) body.append(`entry.${ENTRY_IDS.lastName}`, data.lastName);
      if (data.email) body.append(`entry.${ENTRY_IDS.email}`, data.email);
      if (data.phone) body.append(`entry.${ENTRY_IDS.phone}`, data.phone);
      if (data.eventDate) body.append(`entry.${ENTRY_IDS.eventDate}`, data.eventDate);
      if (data.eventTime) body.append(`entry.${ENTRY_IDS.eventTime}`, data.eventTime);
      if (data.guestCount) body.append(`entry.${ENTRY_IDS.guestCount}`, data.guestCount);
      if (data.venue) body.append(`entry.${ENTRY_IDS.venue}`, data.venue);
      if (data.budget) body.append(`entry.${ENTRY_IDS.budget}`, data.budget);
      if (data.specialRequests) {
        body.append(`entry.${ENTRY_IDS.specialRequests}`, data.specialRequests);
      }

      await fetch(formAction, { method: "POST", mode: "no-cors", body });

      toast({
        title: "Registration Successful!",
        description: "We'll contact you within 24 hours to discuss your event details.",
      });

      reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-landing-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-landing-primary/20 shadow-glow bg-landing-card">
        <CardHeader className="relative pb-6">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 text-landing-muted-foreground hover:text-landing-foreground"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
          <CardTitle className="text-2xl text-gradient-hero">
            Register for {eventTitle}
          </CardTitle>
          <CardDescription className="text-landing-muted-foreground">
            Fill out the form below and we'll get back to you within 24 hours
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-landing-foreground flex items-center gap-2">
                <User size={20} className="text-landing-primary" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-landing-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter your first name"
                    className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-landing-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter your last name"
                    className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-landing-foreground">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="your.email@example.com"
                    className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-landing-foreground">
                    <Phone size={16} />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="123-456-7890"
                    className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-landing-foreground flex items-center gap-2">
                <Calendar size={20} className="text-landing-primary" />
                Event Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-landing-foreground">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    {...register("eventDate")}
                    className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-destructive">{errors.eventDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime" className="flex items-center gap-2 text-landing-foreground">
                    <Clock size={16} />
                    Event Time
                  </Label>
                  <Input
                    id="eventTime"
                    type="time"
                    {...register("eventTime")}
                    className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                  />
                  {errors.eventTime && (
                    <p className="text-sm text-destructive">{errors.eventTime.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="flex items-center gap-2 text-landing-foreground">
                    <Users size={16} />
                    Expected Guests
                  </Label>
                  <Controller
                    name="guestCount"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground">
                          <SelectValue placeholder="Select guest count" />
                        </SelectTrigger>
                        <SelectContent className="bg-landing-popover border-landing-border">
                          <SelectItem value="1-50">1-50 guests</SelectItem>
                          <SelectItem value="51-100">51-100 guests</SelectItem>
                          <SelectItem value="101-200">101-200 guests</SelectItem>
                          <SelectItem value="201-500">201-500 guests</SelectItem>
                          <SelectItem value="500+">500+ guests</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.guestCount && (
                    <p className="text-sm text-destructive">{errors.guestCount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-landing-foreground">Budget Range</Label>
                  <Controller
                    name="budget"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-landing-popover border-landing-border">
                          {getBudgetOptions().map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.budget && (
                    <p className="text-sm text-destructive">{errors.budget.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="flex items-center gap-2 text-landing-foreground">
                  <MapPin size={16} />
                  Venue/Location
                </Label>
                <Input
                  id="venue"
                  {...register("venue")}
                  placeholder="Enter venue name or location details"
                  className="border-landing-border focus:border-landing-primary bg-landing-background text-landing-foreground"
                />
                {errors.venue && (
                  <p className="text-sm text-destructive">{errors.venue.message}</p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests" className="text-landing-foreground">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                {...register("specialRequests")}
                placeholder="Any specific requirements, themes, or special requests for your event..."
                className="border-landing-border focus:border-landing-primary min-h-[100px] bg-landing-background text-landing-foreground"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-landing-border text-landing-foreground"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
