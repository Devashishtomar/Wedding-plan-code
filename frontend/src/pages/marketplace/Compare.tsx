import { useMarketplace } from "@/hooks/use-marketplace";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Loader2
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES } from "@/lib/marketplaceData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Compare = () => {
  const { compareList, removeFromCompare } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { selectedEventId, viewMode } = useEvent();

  // Determine active category scoping context from search query parameters or fallback safely
  const categoryId = searchParams.get('category') || (compareList.length > 0 ? compareList[0].category : null);

  const vendors = compareList.filter(v => v.category === categoryId);
  const categoriesInCompare = Array.from(new Set(compareList.map(v => v.category)));

  // Aligned visibility filter strings tracking with EventContext specifications
  const viewParam = viewMode === 'collaborative' ? 'SHARED' : 'PRIVATE';

  // =========================================================================
  // ⚡ LEADS SUBMISSION AVAILABILITY MUTATION PIPELINE
  // =========================================================================
  const inquiryMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      return await api.post(`/api/marketplace/inquiries?view=${viewParam}`, {
        vendorId,
        eventId: selectedEventId === 'all' ? null : selectedEventId,
        message: "Inquired about date availability and package quotes matching my comparison matrix criteria parameters."
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Dispatched",
        description: "Availability query transmitted to vendor account dashboard channel logs successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "An error occurred dispatching availability parameters.",
        variant: "destructive"
      });
    }
  });

  // Empty State Guard
  if (compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative h-32 w-32 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/20 shadow-2xl">
            <AlertCircle className="h-16 w-16 text-primary" />
          </div>
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-4xl font-bold font-display tracking-tight">No Vendors to Compare</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Add vendors from the marketplace directory listings catalog to view profiles side-by-side. You can compare up to 4 items within the same category group.
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="rounded-full px-10 py-7 text-lg shadow-xl hover:shadow-primary/20 transition-all group font-bold">
            Start Exploring <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    );
  }

  // Compile unique item specification headings dynamically from matched profiles arrays
  const allFeatures = Array.from(new Set(vendors.flatMap(v => v.features.map(f => f.label))));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary drop-shadow-sm pb-1">
            Vendor Comparison
          </h2>
          <p className="text-muted-foreground text-sm font-semibold">
            Evaluating {vendors.length} service profiles in the {CATEGORIES.find(c => c.id === categoryId)?.name || 'Vendors'} directory
          </p>
        </div>

        {/* Dynamic Category Switch Tabs if alternative category items are staged inside workspace context */}
        {categoriesInCompare.length > 1 && (
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border/50 backdrop-blur-md">
            {categoriesInCompare.map(cat => (
              <Button
                key={cat}
                variant={categoryId === cat ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSearchParams({ tab: 'compare', category: cat })}
                className="rounded-lg text-xs font-bold"
              >
                {CATEGORIES.find(c => c.id === cat)?.name || cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/50 to-muted/30 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="w-1/5 p-8 text-left bg-muted/20 backdrop-blur-md sticky left-0 z-20 border-r">
                  <span className="text-xs uppercase tracking-widest font-black text-muted-foreground">Evaluation Parameters</span>
                </th>
                {vendors.map((vendor) => (
                  <th key={vendor.id} className="w-1/5 p-8 text-center relative group min-w-[250px]">
                    <div className="space-y-6">
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 group-hover:shadow-2xl transition-all duration-500">
                        <img
                          src={vendor.images[0]}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <button
                          onClick={() => removeFromCompare(vendor.id)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-destructive transition-colors shadow-md"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg font-display leading-tight truncate px-2">{vendor.name}</h3>
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold border border-green-500/10">
                            <Star className="h-3 w-3 fill-current" />
                            {vendor.rating}
                          </div>
                        </div>
                      </div>
                      <Link to={`/marketplace/vendor/${vendor.id}`}>
                        <Button variant="outline" size="sm" className="w-full rounded-xl font-bold border-border hover:bg-primary hover:text-white transition-all">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm font-medium">
              {/* Pricing Specification Row */}
              <tr className="group hover:bg-primary/5 transition-colors">
                <td className="p-8 font-bold uppercase tracking-wider bg-muted/20 backdrop-blur-md sticky left-0 z-10 border-r text-foreground/80 text-xs">Starting Quote Price</td>
                {vendors.map(vendor => (
                  <td key={vendor.id} className="p-8 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-primary font-display">{vendor.priceRange.split(' - ')[0]}</p>
                      <Badge variant="outline" className="text-[10px] font-black tracking-wider uppercase border-primary/20 text-primary">Baseline Tier</Badge>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Regional Geography Mapping Location Row */}
              <tr className="group hover:bg-primary/5 transition-colors">
                <td className="p-8 font-bold uppercase tracking-wider bg-muted/20 backdrop-blur-md sticky left-0 z-10 border-r text-foreground/80 text-xs">Operating Hub Region</td>
                {vendors.map(vendor => (
                  <td key={vendor.id} className="p-8 text-center text-muted-foreground font-semibold">
                    <div className="flex items-center justify-center gap-1.5 capitalize">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      {vendor.location}, {vendor.city.toLowerCase()}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Dynamic Feature Sub-Graph Row Renderings Matrices */}
              {allFeatures.map((label) => (
                <tr key={label} className="group hover:bg-primary/5 transition-colors">
                  <td className="p-8 font-bold uppercase tracking-wider bg-muted/20 backdrop-blur-md sticky left-0 z-10 border-r text-foreground/80 text-xs">{label}</td>
                  {vendors.map(vendor => {
                    const feature = vendor.features.find(f => f.label === label);
                    return (
                      <td key={vendor.id} className="p-8 text-center text-foreground/90 font-semibold">
                        {feature ? (
                          typeof feature.value === 'boolean' ? (
                            feature.value ? (
                              <div className="bg-green-500/10 p-1.5 rounded-full w-fit mx-auto border border-green-500/10">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              </div>
                            ) : (
                              <div className="bg-red-500/10 p-1.5 rounded-full w-fit mx-auto border border-red-500/10">
                                <X className="h-5 w-5 text-red-500" />
                              </div>
                            )
                          ) : (
                            <span className="font-bold text-sm text-foreground">{feature.value}</span>
                          )
                        ) : (
                          <span className="text-muted-foreground/60 italic text-xs font-normal">Not explicit</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Dynamic Action Trigger Bottom Row Panel */}
              <tr className="bg-muted/10">
                <td className="p-8 bg-muted/20 backdrop-blur-md sticky left-0 z-10 border-r"></td>
                {vendors.map(vendor => (
                  <td key={vendor.id} className="p-8 text-center">
                    <Link to={`/marketplace/vendor/${vendor.id}`}>
                      <Button className="w-full rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                        Contact Vendor
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-primary/80 font-bold leading-normal">
          Note: Comparison grids isolate metrics context rules up to a maximum criteria threshold cap of 4 concurrent listings per category group safely.
        </p>
      </div>
    </div>
  );
};

export default Compare;