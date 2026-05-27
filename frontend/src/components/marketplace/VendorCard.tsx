import { Vendor } from "@/lib/marketplaceData";
import { Star, MapPin, Heart, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useMarketplace } from "@/hooks/use-marketplace";

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard = ({ vendor }: VendorCardProps) => {
  const { toggleShortlist, isShortlisted, addToCompare, isInCompare, removeFromCompare } = useMarketplace();

  // Safeguard: Inject a high-resolution placeholder if the backend returns an empty images array
  const displayImage = vendor.images && vendor.images.length > 0
    ? vendor.images[0]
    : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800';

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the outer <Link> from navigating when checking the compare option
    e.stopPropagation();
    if (isInCompare(vendor.id)) {
      removeFromCompare(vendor.id);
    } else {
      addToCompare(vendor);
    }
  };

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the card's outer <Link> navigation trap from triggering
    e.stopPropagation();
    toggleShortlist(vendor);
  };

  return (
    <div className="group relative bg-gradient-to-br from-card to-card/50 rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-[0_10px_40px_rgba(236,72,153,0.15)] hover:-translate-y-1.5 transition-all duration-500">
      <Link to={`/marketplace/vendor/${vendor.id}`}>
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={displayImage}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Absolute floating operational button clusters */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
            <button
              onClick={handleShortlistToggle}
              className={cn(
                "p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 transform active:scale-90 shadow-sm",
                isShortlisted(vendor.id)
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                  : "bg-black/30 text-white hover:bg-black/50 border border-white/10"
              )}
            >
              <Heart className={cn("h-4 w-4 transition-all", isShortlisted(vendor.id) && "fill-current scale-110 text-white")} />
            </button>
            <button
              onClick={handleCompare}
              className={cn(
                "p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 transform active:scale-90 shadow-sm",
                isInCompare(vendor.id)
                  ? "bg-secondary text-secondary-foreground shadow-lg"
                  : "bg-black/30 text-white hover:bg-black/50 border border-white/10"
              )}
            >
              <ArrowRightLeft className={cn("h-4 w-4 transition-all", isInCompare(vendor.id) && "scale-110")} />
            </button>
          </div>
          <Badge className="absolute bottom-4 left-4 bg-white/95 text-primary font-bold shadow-md backdrop-blur-md border-none px-3 py-1 capitalize text-xs">
            {vendor.category}
          </Badge>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-bold text-xl font-display line-clamp-1 group-hover:text-primary transition-colors text-foreground">
                {vendor.name}
              </h3>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1 font-medium">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">{vendor.location}, {vendor.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-1 rounded-lg text-xs font-black border border-green-500/10 shrink-0 shadow-inner">
              <Star className="h-3.5 w-3.5 fill-current" />
              {vendor.rating.toFixed(1)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Starting Price</p>
              <p className="font-black text-xl text-primary font-display">
                {vendor.priceRange ? vendor.priceRange.split(' - ')[0] : 'Inquire'}
              </p>
            </div>
            <Button size="sm" className="rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border-none shadow-sm group-hover:shadow-md">
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};