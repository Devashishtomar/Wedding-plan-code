import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/marketplaceData";
import { ArrowRight, Search, MapPin, Store, Heart, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Shortlist from "./Shortlist";
import Compare from "./Compare";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "explore";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  // Fetch unique populated destination indices dynamically from backend catalog row items
  const { data: serverCities = [] } = useQuery<string[]>({
    queryKey: ['marketplace-cities'],
    queryFn: async () => {
      const res = await api.get('/api/marketplace/cities');
      return res.data?.cities || [];
    },
    refetchOnWindowFocus: false, // Prevents server flooding when window focus shifts or mouse moves
    staleTime: 15 * 60 * 1000 // Cache destination nodes safely for 15 minutes
  });

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCity && selectedCity !== 'all') params.set("city", selectedCity);

    navigate(`/marketplace/category/venues?${params.toString()}`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight">Vendor Marketplace</h1>
          <p className="text-muted-foreground">Find and manage your perfect wedding team.</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="explore" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Explore</span>
            </TabsTrigger>
            <TabsTrigger value="shortlist" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Shortlist</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="explore" className="mt-0 outline-none space-y-12">
          {/* Hero Section */}
          <section className="relative min-h-[500px] sm:min-h-[400px] py-16 sm:py-0 rounded-3xl overflow-hidden flex items-center justify-center text-center px-4">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519225495810-7517592281e2?auto=format&fit=crop&q=80&w=1600)' }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white font-display tracking-tight leading-tight drop-shadow-xl">
                Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-secondary italic drop-shadow-2xl">Wedding Team</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                Discover the best venues and vendors for your perfect day. Verified reviews, best prices, and exclusive deals.
              </p>

              <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search vendor or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-white/60 pl-10 focus-visible:ring-0"
                  />
                </div>
                <div className="h-px w-full bg-white/20 md:hidden" />
                <div className="w-px bg-white/20 hidden md:block" />
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-transparent border-none text-white placeholder:text-white/60 pl-10 focus:ring-0 ring-0 focus-visible:ring-0">
                      <SelectValue placeholder="Select city..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                      <SelectItem value="all" className="font-bold">All Cities</SelectItem>
                      {serverCities.map(city => (
                        <SelectItem key={city} value={city} className="hover:bg-primary/10 capitalize">
                          {city.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-6">
                  Search
                </Button>
              </form>
            </div>
          </section>

          {/* Category Grid */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight font-display">Browse by Category</h2>
                <p className="text-muted-foreground">Find the best vendors across all categories</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/marketplace/category/${category.id}`}
                  className="group relative h-72 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)] ring-1 ring-border/50 hover:ring-primary/50 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-black font-display tracking-tight group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-white/80 text-sm font-medium line-clamp-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {category.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform md:group-hover:rotate-45 md:group-hover:scale-110 shadow-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="shortlist" className="mt-0 outline-none">
          <Shortlist />
        </TabsContent>

        <TabsContent value="compare" className="mt-0 outline-none">
          <Compare />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;