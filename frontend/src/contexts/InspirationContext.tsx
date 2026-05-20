import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { InspirationImage } from "@/lib/inspirationData";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useEvent } from "@/contexts/EventContext";

interface InspirationContextType {
  savedImages: InspirationImage[];
  discoveredImages: InspirationImage[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  loadingBoard: boolean;
  loadingDiscovery: boolean;
  saveImage: (image: InspirationImage) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  isSaved: (id: string) => boolean;
  refreshBoard: () => Promise<void>;
  refreshDiscovery: () => Promise<void>;
  loadMoreDiscovery: () => void;
  hasMore: boolean;
}

const InspirationContext = createContext<InspirationContextType | undefined>(undefined);

export const InspirationProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { selectedEventId, viewMode } = useEvent();

  const [savedImages, setSavedImages] = useState<InspirationImage[]>([]);
  const [discoveredImages, setDiscoveredImages] = useState<InspirationImage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);
  const [loadingDiscovery, setLoadingDiscovery] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const viewParam = viewMode === "collaborative" ? "SHARED" : "PRIVATE";

  useEffect(() => {
    setPage(1);
    setDiscoveredImages([]);
    setHasMore(true);
  }, [selectedEventId, viewMode, searchQuery, selectedCategory]);

  const fetchBoard = async () => {
    setSavedImages([]);
    setLoadingBoard(true);
    try {
      const res = await api.get(`/api/inspirations/board?view=${viewParam}&eventId=${selectedEventId}`);
      if (res.data?.success) {
        setSavedImages(res.data.pins || []);
      }
    } catch (err) {
      console.error("Failed to load pinned inspirations board state context", err);
    } finally {
      setLoadingBoard(false);
    }
  };

  const fetchDiscovery = async (targetPageNum: number) => {
    if (targetPageNum > 2) {
      setHasMore(false);
      return;
    }
    setLoadingDiscovery(true);
    try {
      const res = await api.get(
        `/api/inspirations/search?query=${encodeURIComponent(searchQuery)}&eventId=${selectedEventId}&view=${viewParam}&category=${encodeURIComponent(selectedCategory)}&page=${targetPageNum}&perPage=30`
      );
      if (res.data?.success) {
        const batchResults = res.data.data || [];

        // Hard lock deployment constraints at page 2 threshold loops
        if (targetPageNum >= 2 || batchResults.length < 30) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setDiscoveredImages((prev) => (targetPageNum === 1 ? batchResults : [...prev, ...batchResults]));
      }
    } catch (err) {
      console.error("Failed to pull search discovery pool from background endpoints", err);
    } finally {
      setLoadingDiscovery(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [selectedEventId, viewMode]);

  useEffect(() => {
    fetchDiscovery(page);
  }, [page, selectedEventId, viewMode, searchQuery, selectedCategory]);

  const loadMoreDiscovery = () => {
    if (!loadingDiscovery && hasMore && page < 2) {
      setPage(2);
    }
  };

  const saveImage = async (image: InspirationImage) => {
    try {
      const res = await api.post(`/api/inspirations/pin?view=${viewParam}`, {
        url: image.url,
        title: image.title,
        category: image.category,
        description: image.description,
        tags: image.tags,
        style: image.style,
        eventId: selectedEventId === "all" ? null : selectedEventId
      });
      if (res.data?.success) {
        toast({ title: "Image Pinned", description: "Successfully saved to your isolated event board space." });
        fetchBoard();
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Pinning Failed", description: err.response?.data?.message || "Unauthorized action query context check." });
    }
  };

  const removeImage = async (id: string) => {
    try {
      const res = await api.delete(`/api/inspirations/pin/${id}`);
      if (res.data?.success) {
        toast({ title: "Image Unpinned", description: "Successfully removed idea item from active workspace logs." });
        fetchBoard();
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Removal Failed", description: err.response?.data?.message || "Forbidden action context validation." });
    }
  };

  const isSaved = (id: string) => {
    return savedImages.some((img) => img.url === id || img.id === id);
  };

  return (
    <InspirationContext.Provider
      value={{
        savedImages,
        discoveredImages,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        loadingBoard,
        loadingDiscovery,
        saveImage,
        removeImage,
        isSaved,
        refreshBoard: fetchBoard,
        refreshDiscovery: () => fetchDiscovery(page),
        loadMoreDiscovery,
        hasMore
      }}
    >
      {children}
    </InspirationContext.Provider>
  );
};

export const useInspiration = () => {
  const context = useContext(InspirationContext);
  if (context === undefined) {
    throw new Error("useInspiration must be used within an InspirationProvider");
  }
  return context;
};
