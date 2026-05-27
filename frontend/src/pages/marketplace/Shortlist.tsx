import { useMarketplace } from "@/hooks/use-marketplace";
import { VendorCard } from "@/components/marketplace/VendorCard";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/contexts/EventContext";
import { Heart, ArrowRight, Trash2, LayoutGrid, List, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/marketplaceData";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Shortlist = () => {
  const { shortlist, toggleShortlist } = useMarketplace();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedEventId, viewMode: eventViewMode } = useEvent();

  const viewParam = eventViewMode === 'collaborative' ? 'SHARED' : 'PRIVATE';

  // Group shortlisted vendors by category dynamically
  const groupedShortlist = shortlist.reduce((acc: any, vendor) => {
    if (!acc[vendor.category]) acc[vendor.category] = [];
    acc[vendor.category].push(vendor);
    return acc;
  }, {});

  // =========================================================================
  // ⚡ MUTATION LOOP HANDLER FOR WIKING OUT ENTIRE SHORTLIST BUCKETS
  // =========================================================================
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      // Execute parallel deletion requests across all currently saved shortlist IDs
      const deletePromises = shortlist.map(vendor =>
        api.post(`/api/marketplace/shortlist/toggle?view=${viewParam}`, {
          vendorId: vendor.id,
          eventId: selectedEventId === 'all' ? null : selectedEventId
        })
      );
      return await Promise.all(deletePromises);
    },
    onSuccess: () => {
      // Instantly flush the TanStack validation caches to trigger UI redraws
      queryClient.invalidateQueries({ queryKey: ['marketplace-shortlist', selectedEventId, eventViewMode] });
      toast({
        title: "Shortlist Cleared",
        description: "All vendor selections removed from this workspace view tab safely."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Clear Operation Failed",
        description: error.response?.data?.message || "An error occurred purging selections.",
        variant: "destructive"
      });
    }
  });

  // Empty State Layout Guard
  if (shortlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative h-40 w-40 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden group">
            <Heart className="h-20 w-20 text-primary transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-4xl font-bold font-display tracking-tight">Nothing here yet...</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Build your dream wedding team by shortlisting professionals you love. We'll synchronize them across your active workspace context layers safely here.
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="rounded-full px-12 py-8 text-xl shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 font-bold">
            Explore Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Panel Metadata controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight leading-tight">My Shortlist</h1>
          <p className="text-muted-foreground text-sm font-medium">
            You have <span className="text-primary font-bold">{shortlist.length}</span> curated selections across {Object.keys(groupedShortlist).length} categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-lg h-9 w-9 p-0"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-lg h-9 w-9 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            className="rounded-full text-destructive border-destructive/20 hover:bg-destructive/10 font-bold px-5"
            disabled={clearAllMutation.isPending}
            onClick={() => {
              if (window.confirm("Are you absolutely sure you want to remove all shortlisted vendors from this current workspace filter scope?")) {
                clearAllMutation.mutate();
              }
            }}
          >
            {clearAllMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Clear All
          </Button>
        </div>
      </div>

      {/* Grouped Catalog View Sections Loop */}
      {Object.keys(groupedShortlist).map((catId) => {
        // Safe categorization matching using backend uppercase/lowercase contracts conversion safeguards
        const category = CATEGORIES.find(c => c.id === catId);
        const vendors = groupedShortlist[catId];

        return (
          <section key={catId} className="space-y-8">
            <div className="flex items-center justify-between group border-b border-dashed pb-2 border-border/60">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                <h2 className="text-2xl font-bold font-display flex items-center gap-3 capitalize">
                  {category?.name || catId}
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border">
                    {vendors.length}
                  </span>
                </h2>
              </div>
            </div>

            {/* Configured responsive workspace displaying grid systems */}
            <div className={cn(
              "grid gap-8 transition-all duration-500",
              viewMode === 'grid'
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-3xl"
            )}>
              {vendors.map((vendor: any) => (
                <div key={vendor.id} className="relative transition-all duration-500 hover:-translate-y-1">
                  <VendorCard vendor={vendor} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Shortlist;