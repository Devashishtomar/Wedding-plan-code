import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Vendor } from '@/lib/marketplaceData';
import { useToast } from '@/hooks/use-toast';
import { useEvent } from '@/contexts/EventContext';

interface MarketplaceContextType {
  shortlist: Vendor[];
  compareList: Vendor[];
  toggleShortlist: (vendor: Vendor) => void;
  addToCompare: (vendor: Vendor) => void;
  removeFromCompare: (vendorId: string) => void;
  isShortlisted: (vendorId: string) => boolean;
  isInCompare: (vendorId: string) => boolean;
}

export const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedEventId, viewMode } = useEvent();

  // Aligned perfectly with EventContext: sends uniform SHARED or PRIVATE strings down to server context handlers
  const viewParam = viewMode === 'collaborative' ? 'SHARED' : 'PRIVATE';

  const { data: shortlist = [] } = useQuery<Vendor[]>({
    queryKey: ['marketplace-shortlist', selectedEventId, viewMode],
    queryFn: async () => {
      const res = await api.get(`/api/marketplace/shortlist?view=${viewParam}&eventId=${selectedEventId}`);
      return res.data?.shortlist || [];
    },
    refetchOnWindowFocus: false, // Blocks infinite background loops during mouse pointer moves
    staleTime: 2 * 60 * 1000 // Cache values securely for 2 minutes before allowing background checks
  });

  // Fetch preserved persistent comparison selections array
  const { data: compareList = [] } = useQuery<Vendor[]>({
    queryKey: ['marketplace-compare'],
    queryFn: async () => {
      const res = await api.get('/api/marketplace/compare');
      return res.data?.compareList || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // Cache evaluation grids up to 5 minutes cleanly
  });

  // =========================================================================
  // ⚡ MUTATIONS STATE HANDLERS
  // =========================================================================

  const shortlistToggleMutation = useMutation({
    mutationFn: async (vendor: Vendor) => {
      return await api.post(`/api/marketplace/shortlist/toggle?view=${viewParam}`, {
        vendorId: vendor.id,
        eventId: selectedEventId === 'all' ? null : selectedEventId
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-shortlist', selectedEventId, viewMode] });
      const isAdded = data.data?.action === 'ADDED';
      toast({
        title: isAdded ? "Added to Shortlist" : "Removed from Shortlist",
        description: data.data?.message || "Shortlist parameters synchronized safely."
      });
    }
  });

  const compareAddMutation = useMutation({
    mutationFn: async (vendor: Vendor) => {
      return await api.post('/api/marketplace/compare/toggle', {
        vendorId: vendor.id,
        category: vendor.category
      });
    },
    onSuccess: (_, vendor) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-compare'] });
      toast({
        title: "Added to Compare",
        description: `${vendor.name} appended into metrics grid.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Limit Reached",
        description: error.response?.data?.message || "Maximum of 4 items per group threshold reached.",
        variant: "destructive"
      });
    }
  });

  const compareRemoveMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      return await api.post('/api/marketplace/compare/toggle', { vendorId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-compare'] });
    }
  });

  const toggleShortlist = (vendor: Vendor) => {
    shortlistToggleMutation.mutate(vendor);
  };

  const addToCompare = (vendor: Vendor) => {
    const sameCategoryCount = compareList.filter(v => v.category === vendor.category).length;
    if (sameCategoryCount >= 4) {
      toast({
        title: "Limit Reached",
        description: "Comparison view matches criteria caps at 4 items.",
        variant: "destructive"
      });
      return;
    }
    compareAddMutation.mutate(vendor);
  };

  const removeFromCompare = (vendorId: string) => {
    compareRemoveMutation.mutate(vendorId);
  };

  const isShortlisted = (vendorId: string) => shortlist.some(v => v.id === vendorId);
  const isInCompare = (vendorId: string) => compareList.some(v => v.id === vendorId);

  return (
    <MarketplaceContext.Provider value={{
      shortlist,
      compareList,
      toggleShortlist,
      addToCompare,
      removeFromCompare,
      isShortlisted,
      isInCompare
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be parsed inside a active MarketplaceProvider root layout structure.');
  }
  return context;
};