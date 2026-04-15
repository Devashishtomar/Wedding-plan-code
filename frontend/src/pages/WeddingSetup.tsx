import { useState } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";

interface WeddingSetupProps {
  isEditing?: boolean;
  onClose?: () => void;
  initialData?: any;
}

const WeddingSetup = ({ isEditing = false, onClose, initialData, }: WeddingSetupProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    location?: string;
    budget?: string;
    guestCount?: string;
    weddingType?: string;
  }>({});


  const [weddingDate, setWeddingDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );

  const [location, setLocation] = useState(
    initialData?.location || ""
  );

  const [budget, setBudget] = useState(
    initialData?.budget ? String(initialData.budget) : "25000"
  );

  const [guestCount, setGuestCount] = useState(
    initialData?.guestCount ? String(initialData.guestCount) : "100"
  );

  const [weddingType, setWeddingType] = useState(
    initialData?.weddingType || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const newErrors: typeof errors = {};

    if (!weddingDate) newErrors.date = "Please select a wedding date";
    if (!location.trim()) newErrors.location = "Location is required";

    if (!budget || Number(budget) <= 0)
      newErrors.budget = "Budget must be a positive number";

    if (!guestCount || Number(guestCount) <= 0)
      newErrors.guestCount = "Guest count must be greater than 0";

    if (!weddingType)
      newErrors.weddingType = "Please select a wedding type";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const weddingDetails = {
      weddingDate: weddingDate.toISOString(),
      location,
      budget,
      guestCount,
      weddingType,
    };

    try {
      await api.patch("/api/weddings/setup", {
        date: weddingDate.toISOString(),
        location,
        budget: Number(budget),
        guestCount: Number(guestCount),
        weddingType,
      });

      toast({
        title: isEditing ? "Wedding details updated!" : "Wedding created!",
        description: isEditing
          ? "Your wedding details have been saved."
          : "Let's start planning your perfect wedding.",
      });

      if (isEditing && onClose) {
        onClose();
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description:
          error?.response?.data?.message ||
          "Unable to save wedding details. Please try again.",
        variant: "destructive",
      });
    }
    finally {
      setLoading(false);
    }
  };

  const weddingTypes = [
    { value: "traditional", label: "Traditional" },
    { value: "modern", label: "Modern" },
    { value: "destination", label: "Destination" },
    { value: "intimate", label: "Intimate/Elopement" },
    { value: "rustic", label: "Rustic/Outdoor" },
    { value: "beach", label: "Beach" },
    { value: "religious", label: "Religious" },
    { value: "cultural", label: "Cultural" },
  ];

  const content = (
    <Card className={cn("w-full", isEditing ? "border-0 shadow-none" : "max-w-lg")}>
      <CardHeader className="text-center">
        {!isEditing && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-semibold">AI Wedding Planner</span>
            </div>
          </div>
        )}
        <CardTitle className="text-2xl">
          {isEditing ? "Edit Wedding Details" : "Set Up Your Wedding"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your wedding information"
            : "Tell us about your special day so we can help you plan it perfectly"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wedding Date */}
            <div className="space-y-2">
              <Label>Wedding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !weddingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {weddingDate ? format(weddingDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={weddingDate}
                    onSelect={(date) => {
                      setWeddingDate(date);
                      setErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="City, State or Venue"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setErrors((prev) => ({ ...prev, location: undefined }));
                }}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setErrors((prev) => ({ ...prev, budget: undefined }));
                }}
              />
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget}</p>
              )}
            </div>

            {/* Expected Guest Count */}
            <div className="space-y-2">
              <Label htmlFor="guestCount">Expected Guest Count</Label>
              <Input
                id="guestCount"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={guestCount}
                onChange={(e) => {
                  setGuestCount(e.target.value);
                  setErrors((prev) => ({ ...prev, guestCount: undefined }));
                }}
              />
              {errors.guestCount && (
                <p className="text-sm text-destructive">{errors.guestCount}</p>
              )}
            </div>
          </div>

          {/* Wedding Type */}
          <div className="space-y-2">
            <Label>Wedding Type</Label>
            <Select
              value={weddingType}
              onValueChange={(value) => {
                setWeddingType(value);
                setErrors((prev) => ({ ...prev, weddingType: undefined }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select wedding type" />
              </SelectTrigger>
              <SelectContent>
                {weddingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.weddingType && (
              <p className="text-sm text-destructive">{errors.weddingType}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {isEditing && onClose && (
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={isEditing ? "flex-1" : "w-full"}
              disabled={
                loading ||
                !weddingDate ||
                !location ||
                !budget ||
                !guestCount ||
                !weddingType
              }
            >
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Wedding"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  if (isEditing) {
    return content;
  }

  return (
    <>
      <SEOHead
        title="Set Up Your Wedding | AI Wedding Planner"
        description="Set up your wedding details to get started with AI Wedding Planner."
        noIndex={true}
      />
      <main className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        {content}
      </main>
    </>
  );
};

export default WeddingSetup;
