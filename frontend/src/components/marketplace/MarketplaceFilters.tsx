import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface MarketplaceFiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

export const MarketplaceFilters = ({ onFilterChange, initialFilters }: MarketplaceFiltersProps) => {
  const [selectedCity, setSelectedCity] = useState<string>(initialFilters?.cities?.[0] || "all");
  const currency = typeof window !== 'undefined' ? localStorage.getItem("app_currency") || "USD" : "USD";
  const isINR = currency === "INR";
  const maxLimit = isINR ? 2500000 : 100000;
  const stepAmount = isINR ? 25000 : 1000;

  const [priceRange, setPriceRange] = useState<number[]>(initialFilters?.priceRange || [0, maxLimit]);
  const [minRating, setMinRating] = useState<string>(initialFilters?.minRating || "all");

  // =========================================================================
  // 📡 LIVE TANSTACK CITIES QUERY FETCHING
  // =========================================================================
  const { data: serverCities = [], isLoading: isLoadingCities } = useQuery<string[]>({
    queryKey: ['marketplace-cities'],
    queryFn: async () => {
      const res = await api.get('/api/marketplace/cities');
      return res.data?.cities || [];
    },
    refetchOnWindowFocus: false, // Disables background window spam polling
    staleTime: 10 * 60 * 1000 // Cache uniquely for 10 minutes safely
  });

  const handleClear = () => {
    setSelectedCity("all");
    setPriceRange([0, maxLimit]);
    setMinRating("all");
  };

  useEffect(() => {
    onFilterChange({
      cities: selectedCity === "all" ? [] : [selectedCity],
      priceRange,
      minRating
    });
  }, [selectedCity, priceRange, minRating]);

  // Formatter mapping helper for short numeric notations
  const formatCurrencyLabel = (val: number) => {
    if (isINR) {
      if (val >= 100000) {
        return `₹${(val / 100000).toFixed(1)}L`;
      }
      return `₹${(val / 1000).toFixed(0)}k`;
    } else {
      return `$${(val / 1000).toFixed(0)}k`;
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 space-y-8">
        {/* Dynamic Location Filter Option Section */}
        <div>
          <h3 className="font-bold text-xl font-display mb-4 text-foreground flex items-center gap-2">
            Location
            {isLoadingCities && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </h3>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full rounded-2xl bg-white/50 backdrop-blur-md border-white/20 shadow-inner focus:ring-primary/50 transition-all hover:bg-white/80 font-semibold capitalize text-foreground">
              <SelectValue placeholder="Select city..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 backdrop-blur-xl bg-card/90">
              <SelectItem value="all" className="font-bold text-primary">All Cities</SelectItem>
              {serverCities.map((city) => (
                <SelectItem key={city} value={city} className="hover:bg-primary/10 capitalize font-medium">
                  {city.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/50" />

        {/* Budget Sliding Filter Option Section */}
        <div>
          <h3 className="font-bold text-xl font-display mb-4 text-foreground">Budget Range</h3>
          <div className="px-2">
            <Slider
              defaultValue={[maxLimit]}
              max={maxLimit}
              step={stepAmount}
              value={[priceRange[1]]}
              onValueChange={(val) => setPriceRange([0, val[0]])}
              className="mb-5 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-primary/30"
            />
          </div>
          <div className="flex justify-between text-sm font-bold text-muted-foreground px-1 bg-primary/5 py-2 rounded-xl border border-primary/5">
            <span>{isINR ? '₹0' : '$0'}</span>
            <span className="text-primary font-extrabold">
              {priceRange[1] >= maxLimit ? (isINR ? '₹25L+' : '$100k+') : formatCurrencyLabel(priceRange[1])}

            </span>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Rating Filter Option Section */}
        <div>
          <h3 className="font-bold text-xl font-display mb-4 text-foreground">Rating</h3>
          <RadioGroup value={minRating} onValueChange={setMinRating} className="space-y-3">
            {[
              { label: 'All Ratings', value: 'all' },
              { label: '4.5 & Above', value: '4.5' },
              { label: '4.0 & Above', value: '4.0' },
              { label: '3.5 & Above', value: '3.5' },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-primary/5 transition-colors group/item">
                <RadioGroupItem value={option.value} id={`rating-${option.value}`} className="border-primary/50 text-primary data-[state=checked]:border-primary" />
                <Label htmlFor={`rating-${option.value}`} className="cursor-pointer font-semibold text-sm text-foreground/80 group-hover/item:text-primary transition-colors">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-border/50" />

        <Button
          className="w-full rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold bg-white text-foreground border-border/50 hover:border-primary/50 hover:text-primary"
          variant="outline"
          onClick={handleClear}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};