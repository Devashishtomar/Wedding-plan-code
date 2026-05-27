import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CATEGORIES, Vendor } from "@/lib/marketplaceData";
import { VendorCard } from "@/components/marketplace/VendorCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, Search, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const VendorListing = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = CATEGORIES.find(c => c.id === categoryId);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const currency = typeof window !== 'undefined' ? localStorage.getItem("app_currency") || "USD" : "USD";
  const isINR = currency === "INR";
  const maxLimit = isINR ? 2500000 : 100000;


  const [filters, setFilters] = useState({
    cities: searchParams.get("city") ? [searchParams.get("city") as string] : [] as string[],
    priceRange: [0, maxLimit],
    minRating: "all"
  });

  // Sync state cleanly when URL parameters are modified by the top search navbar
  useEffect(() => {
    const q = searchParams.get("q");
    setSearchQuery(q || "");

    const city = searchParams.get("city");
    if (city) {
      setFilters(prev => ({ ...prev, cities: [city] }));
    }
  }, [searchParams]);

  // =========================================================================
  // 📡 LIVE TANSTACK SELECTION QUERY PIPELINE
  // =========================================================================
  const qParam = searchParams.get("q");

  const { data: vendors = [], isLoading, isFetching } = useQuery<Vendor[]>({
    queryKey: ['marketplace-vendors-catalog', categoryId, sortBy, filters, qParam],
    queryFn: async () => {
      const queryParams: any = {
        category: categoryId, // Case insensitive lower-to-upper mapped in controller
        sortBy,
      };

      if (filters.cities && filters.cities.length > 0) {
        queryParams.city = filters.cities[0];
      }
      if (filters.minRating && filters.minRating !== "all") {
        queryParams.minRating = filters.minRating;
      }
      if (filters.priceRange) {
        queryParams.minPrice = filters.priceRange[0];
        queryParams.maxPrice = filters.priceRange[1];
      }
      if (qParam) {
        queryParams.q = qParam;
      }

      const res = await api.get('/api/marketplace/vendors', { params: queryParams });
      return res.data?.vendors || [];
    },
    refetchOnWindowFocus: false, // Blocks mouse moves background spam triggers
    staleTime: 30 * 1000 // Safely caches results for 30 seconds
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery.trim()) prev.set("q", searchQuery.trim());
      else prev.delete("q");
      return prev;
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Breadcrumbs navigation tracks */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/marketplace">Marketplace</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category?.name || "All Vendors"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Targeted context lookups searching */}
          <form onSubmit={handleSearch} className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 rounded-full bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchParams(prev => { prev.delete("q"); return prev; });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"

              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight capitalize">
              {category?.name || "All Wedding Vendors"} in India
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              {isFetching && !isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              Showing {vendors.length} {category?.name?.toLowerCase() || "vendors"} found
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] sm:w-[180px] rounded-full bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <MarketplaceFilters initialFilters={filters} onFilterChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Canvas Configuration Panel - Desktop */}
        <div className="hidden lg:block space-y-8">
          <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-24 shadow-sm">
            <MarketplaceFilters initialFilters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Dynamic Vendor Results Display Grid Layout */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 border border-border/40 p-4 rounded-3xl bg-card">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-xl" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>

              {vendors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/30 rounded-3xl border-2 border-dashed border-border animate-in fade-in zoom-in duration-300">
                  <div className="bg-background p-4 rounded-full shadow-sm">
                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">No vendors found</h3>
                    <p className="text-muted-foreground max-w-xs font-medium text-sm">
                      We couldn't locate active profiles matching your exact parameter thresholds.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full font-bold px-6 border-border/80 hover:border-primary/50"
                    onClick={() => {
                      setFilters({ cities: [], priceRange: [0, maxLimit], minRating: "all" });
                      setSearchParams(new URLSearchParams());
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorListing;