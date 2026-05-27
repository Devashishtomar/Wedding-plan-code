import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CATEGORIES, Vendor } from "@/lib/marketplaceData";
import {
  Star,
  MapPin,
  Heart,
  ArrowRightLeft,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useMarketplace } from "@/hooks/use-marketplace";
import { cn } from "@/lib/utils";

const VendorDetails = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { toggleShortlist, isShortlisted, addToCompare, isInCompare } = useMarketplace();
  const [isContactOpen, setIsContactOpen] = useState(false);

  // =========================================================================
  // 📡 TANSTACK SELECTION HOOK QUERY PIPELINE
  // =========================================================================
  const { data: vendor, isLoading } = useQuery<Vendor>({
    queryKey: ['marketplace-vendor-detail', vendorId],
    queryFn: async () => {
      const res = await api.get(`/api/marketplace/vendors/${vendorId}`);
      return res.data?.vendor;
    },
    refetchOnWindowFocus: false, // Blocks mouse moves background re-fetch signals
    staleTime: 5 * 60 * 1000, // Caches full profile specs for 5 minutes cleanly
    enabled: !!vendorId
  });

  if (isLoading) {
    return (
      <div className="space-y-8 pb-32 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </div>
        <div className="h-12 w-1/2 bg-muted rounded-xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <h3 className="text-2xl font-bold">Profile Not Located</h3>
        <p className="text-muted-foreground text-sm font-medium">
          The requested vendor configuration token could not be verified in the active index.
        </p>
        <Link to="/marketplace">
          <Button variant="outline" className="rounded-full font-bold">
            Return to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  // Gallery fallbacks guarding missing imagery configurations securely
  const galleryImage1 = vendor.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800';
  const galleryImage2 = vendor.images[1] || galleryImage1;
  const galleryImage3 = vendor.images[2] || galleryImage1;

  return (
    <div className="space-y-8 pb-32">
      {/* Upper Section: Gallery & Quick Actions Action Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Explicitly max-bounded layout h-frame wrapper blocks clipping anomalies */}
          <div className="grid grid-cols-2 gap-4 h-[350px] max-h-[350px] w-full">
            <div className="col-span-2 sm:col-span-1 rounded-2xl overflow-hidden shadow-lg group h-full">
              <img
                src={galleryImage1}
                alt={vendor.name}
                className="w-full h-full object-cover max-h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="hidden sm:grid grid-rows-2 gap-4 h-full">
              <div className="rounded-2xl overflow-hidden shadow-lg group h-full max-h-[165px]">
                <img
                  src={galleryImage2}
                  alt={vendor.name}
                  className="w-full h-full object-cover max-h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group h-full max-h-[165px]">
                <img
                  src={galleryImage3}
                  alt={vendor.name}
                  className="w-full h-full object-cover max-h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-bold text-sm">+ {vendor.images.length} Photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Context Aggregation Action Card Column Block */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-xl sticky top-24 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 capitalize font-bold">
                  {vendor.category}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant={isShortlisted(vendor.id) ? "default" : "ghost"}
                    size="icon"
                    className="rounded-full shadow-sm"
                    onClick={() => toggleShortlist(vendor)}
                  >
                    <Heart className={cn("h-4 w-4", isShortlisted(vendor.id) && "fill-current text-primary")} />
                  </Button>
                </div>
              </div>
              <h1 className="text-2xl font-bold font-display tracking-tight">{vendor.name}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{vendor.location}, {vendor.city}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-2xl flex flex-col items-center justify-center text-center">
                <Star className="h-5 w-5 text-yellow-500 mb-1 fill-current" />
                <span className="font-black text-base">{vendor.rating}</span>
              </div>
              <div className="p-3 bg-muted/50 rounded-2xl flex flex-col items-center justify-center text-center">
                <IndianRupee className="h-5 w-5 text-green-600 mb-1" />
                <span className="font-bold text-xs text-muted-foreground">Starts at</span>
                <span className="font-black text-sm text-foreground uppercase">
                  {vendor.priceValue ? `${(vendor.priceValue / 1000).toFixed(0)}k` : 'Contact'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                onClick={() => setIsContactOpen(true)}
              >
                Contact Vendor
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 rounded-2xl text-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300 font-bold"
                onClick={() => addToCompare(vendor)}
              >
                <ArrowRightLeft className="h-5 w-5 mr-2 text-secondary shrink-0" />
                {isInCompare(vendor.id) ? "In Comparison" : "Add to Compare"}
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <span>{vendor.contact.phone}</span>
              </div>
              {vendor.contact.email && (
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="truncate max-w-[200px]">{vendor.contact.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Tabs Parameter Routing Content Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar flex-nowrap">
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 h-full font-bold text-sm"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 h-full font-bold text-sm"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 h-full font-bold text-sm"
              >
                Pricing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 outline-none">
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold font-display">About {vendor.name}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm font-medium">
                  {vendor.description || "No supplemental descriptive summary catalog logs have been populated for this provider entry yet."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dashed">
                  {vendor.features && vendor.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{feature.label}</p>
                        <p className="font-semibold text-sm text-foreground mt-0.5">
                          {typeof feature.value === 'boolean' ? (feature.value ? 'Yes' : 'No') : feature.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6 outline-none">
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold font-display mb-6">Services Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendor.services && vendor.services.map((service, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/20 transition-all select-none">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-semibold text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6 outline-none">
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold font-display mb-6">Pricing Information</h2>
                <div className="space-y-6">
                  {/* Stripped out split row & Book Now button to display clean informational package cards */}
                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <p className="text-sm text-primary font-bold uppercase tracking-wider">Starting Package Price</p>
                    <p className="text-3xl font-black font-display text-foreground mt-1">
                      {vendor.priceRange ? vendor.priceRange.split(' - ')[0] : 'Inquire'}
                    </p>
                  </div>

                  <div className="p-6 bg-muted/30 rounded-3xl space-y-3 text-sm font-medium text-muted-foreground leading-relaxed">
                    <p className="font-bold flex items-center gap-2 text-foreground text-base mb-1">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      Pricing reference boundaries: {vendor.priceRange}
                    </p>
                    <p>
                      * Listed thresholds are compiled indicators for initial tier estimates. Peak season adjustments or multi-day configuration packages will alter structural rates.
                    </p>
                    <p>
                      Please connect directly via the communications gateway to generate a finalized breakdown matching your sub-event parameters.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Copy-Paste Gateway Popup for Socials, Phone, Website Information */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="rounded-3xl max-w-md p-6 bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display">Contact Details</DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground">
              Select or copy coordinates to connect directly with the vendor team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-4 bg-muted/40 rounded-2xl flex flex-col space-y-1 border">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Phone Number</span>
              <span className="font-bold text-base select-all text-foreground tracking-tight">{vendor.contact.phone}</span>
            </div>
            {vendor.contact.email && (
              <div className="p-4 bg-muted/40 rounded-2xl flex flex-col space-y-1 border">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Email Address</span>
                <span className="font-bold text-sm select-all text-foreground truncate">{vendor.contact.email}</span>
              </div>
            )}
            {vendor.contact.website && (
              <div className="p-4 bg-muted/40 rounded-2xl flex flex-col space-y-1 border">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Official Website</span>
                <a href={vendor.contact.website} target="_blank" rel="noreferrer" className="font-bold text-sm text-primary hover:underline truncate focus-visible:outline-none">
                  {vendor.contact.website}
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDetails;