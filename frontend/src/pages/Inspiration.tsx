import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePreviewModal } from "@/components/inspiration/ImagePreviewModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { INSPIRATION_IMAGES, InspirationImage, DECOR_CATEGORIES } from "@/lib/inspirationData";
import { useInspiration, InspirationProvider } from "@/contexts/InspirationContext";
import { useEvent } from "@/contexts/EventContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Heart,
  Sparkles,
  Flower2,
  Tag,
  X,
} from "lucide-react";

/* ─── Style colour palette — luxury boho gold tones ─────────────────────── */
const STYLE_COLORS: Record<string, string> = {
  Romantic: "bg-[#FAF0E4] text-[#9A7340] border-[#C5A059]/30",
  Bohemian: "bg-[#F5EEE0] text-[#8A6830] border-[#C5A059]/30",
  Rustic: "bg-[#F0EAE0] text-[#7A6040] border-[#C5A059]/30",
  Modern: "bg-[#EEF0EE] text-[#5C5C5C] border-[#C5A059]/30",
  Glam: "bg-[#F5EDE8] text-[#9A6050] border-[#C5A059]/30",
  Dramatic: "bg-[#E8E4DC] text-[#5C4A3C] border-[#C5A059]/30",
};

const STYLE_ACTIVE: Record<string, string> = {
  Romantic: "bg-[#C5A059] text-white border-[#C5A059] shadow-[#C5A059]/20",
  Bohemian: "bg-[#C5A059] text-white border-[#C5A059] shadow-[#C5A059]/20",
  Rustic: "bg-[#C5A059] text-white border-[#C5A059] shadow-[#C5A059]/20",
  Modern: "bg-[#C5A059] text-white border-[#C5A059] shadow-[#C5A059]/20",
  Glam: "bg-[#C5A059] text-white border-[#C5A059] shadow-[#C5A059]/20",
  Dramatic: "bg-[#C5A059] text-white border-[#C5A059] shadow-[#C5A059]/20",
};

/* gradient fallbacks per style — all warm ivory tones */
const FALLBACK_BG: Record<string, string> = {
  Romantic: "from-[#F5EEE6] via-[#FAF6EE] to-[#FBF2E9]",
  Bohemian: "from-[#F0E8DC] via-[#F5EEE6] to-[#FBF2E9]",
  Rustic: "from-[#EDE4D8] via-[#F2EAE0] to-[#FBF2E9]",
  Modern: "from-[#EAE8E4] via-[#F0EDE8] to-[#FBF2E9]",
  Glam: "from-[#F0E4DC] via-[#F5EEE6] to-[#FBF2E9]",
  Dramatic: "from-[#E4DCD4] via-[#EDE8E0] to-[#FBF2E9]",
};

/* ─── Single card ────────────────────────────────────────────────────────── */
const InspirationCard = ({
  image,
  onImageClick,
}: {
  image: InspirationImage;
  onImageClick: (img: InspirationImage) => void;
}) => {
  const { isSaved, saveImage, removeImage } = useInspiration();
  const saved = isSaved(image.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fallback = FALLBACK_BG[image.style] ?? "from-[#F5EEE6] via-[#FAF6EE] to-[#FBF2E9]";

  return (
    <div
      className="relative group overflow-hidden rounded-2xl break-inside-avoid cursor-zoom-in mb-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C5A059]/10 hover:border-[#C5A059]/30"
      onClick={() => onImageClick(image)}
    >
      {imgError ? (
        <div className={`w-full min-h-[220px] bg-gradient-to-br ${fallback} flex flex-col items-center justify-center p-6 text-center select-none`}>
          <Flower2 className="w-10 h-10 text-[#C5A059]/50 mb-3" />
          <p className="text-[#5C4A3C] font-semibold text-sm leading-snug mb-2">{image.title}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${STYLE_COLORS[image.style] ?? ""}`}>
            {image.style}
          </span>
        </div>
      ) : (
        <>
          {!imgLoaded && (
            <div className={`w-full min-h-[220px] bg-gradient-to-br ${fallback} animate-pulse`} />
          )}
          <img
            src={image.url}
            alt={image.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 block ${imgLoaded ? "opacity-100" : "opacity-0 h-0"}`}
          />
          {/* gradient overlay */}
          {imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </>
      )}

      {/* heart button */}
      <button
        aria-label={saved ? "Remove from board" : "Save to board"}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200
          ${saved
            ? "bg-[#C5A059] text-white scale-110"
            : "bg-[#FBF2E9]/90 text-[#5C4A3C] opacity-0 group-hover:opacity-100 hover:bg-[#FBF2E9]"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          saved ? removeImage(image.id) : saveImage(image);
        }}
      >
        <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
      </button>

      {/* bottom info (only on real loaded image) */}
      {!imgError && imgLoaded && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1.5 inline-block ${STYLE_COLORS[image.style] ?? "bg-[#FBF2E9]/20 text-white border-white/30"}`}>
            {image.style}
          </span>
          <p className="text-white font-semibold text-sm leading-snug drop-shadow-md truncate">
            {image.title}
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── Masonry grid ───────────────────────────────────────────────────────── */
const ImageGrid = ({
  images,
  onImageClick,
}: {
  images: InspirationImage[];
  onImageClick: (img: InspirationImage) => void;
}) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center mt-10 rounded-2xl border border-dashed border-[#C5A059]/30 bg-[#FBF2E9] dark:bg-[#15120F] p-10">
        <Flower2 className="w-14 h-14 text-[#C5A059]/40 mb-4" />
        <h3 className="text-xl font-display font-semibold text-[#2E251E] dark:text-[#FAF6EE] mb-2">
          No décor ideas found
        </h3>
        <p className="text-[#5C4A3C] dark:text-[#C5B9AC] max-w-sm text-sm font-light">
          Try selecting a different style, or browse the Discover tab to pin ideas you love.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mt-6">
      {images.map((image) => (
        <InspirationCard
          key={image.id}
          image={image}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

const InspirationGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="space-y-3 animate-pulse">
        <div className="bg-[#F0E8DC] dark:bg-[#1A1610] rounded-2xl h-64 w-full" />
        <div className="space-y-2 px-2">
          <div className="h-4 bg-[#F0E8DC] dark:bg-[#1A1610] rounded w-3/4" />
          <div className="h-3 bg-[#F0E8DC] dark:bg-[#1A1610] rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Main content ───────────────────────────────────────────────────────── */
const InspirationContent = () => {
  const [selectedImage, setSelectedImage] = useState<InspirationImage | null>(null);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const { selectedEvent, viewMode } = useEvent();
  const { canManageEvents } = usePermissions();
  const {
    savedImages,
    discoveredImages,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    loadingBoard,
    loadingDiscovery,
    loadMoreDiscovery,
    hasMore
  } = useInspiration();

  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  React.useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const filteredImages = useMemo(() => {
    if (!discoveredImages) return [];
    return discoveredImages.filter((img) => {
      const matchesStyle = activeStyles.length === 0 || activeStyles.includes(img.style);
      return matchesStyle;
    });
  }, [discoveredImages, activeStyles]);

  const allStyles = useMemo(
    () => Array.from(new Set(INSPIRATION_IMAGES.map((i) => i.style))),
    []
  );

  const toggleStyle = (style: string) => {
    setActiveStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const clearFilters = () => setActiveStyles([]);


  return (
    <div className="min-h-screen bg-[#FBF2E9] dark:bg-[#0D0B0A] pb-16 transition-colors duration-500">

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#FBF2E9] dark:bg-[#0D0B0A]">
        {/* decorative petals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {["top-6 left-10", "top-12 right-20", "bottom-6 left-1/3", "bottom-10 right-1/4"].map(
            (pos, i) => (
              <Flower2
                key={i}
                className={`absolute ${pos} text-[#C5A059] opacity-10`}
                style={{ width: 40 + i * 14, height: 40 + i * 14 }}
              />
            )
          )}
          {/* Subtle gold circle accent */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-[#C5A059]/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-[#C5A059]/10 pointer-events-none" />
        </div>

        <div className="relative container mx-auto px-4 pt-14 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Wedding Décor Inspiration
          </div>
          <h1
            className="font-display font-light uppercase tracking-wide text-[#2E251E] dark:text-[#FAF6EE] mb-4 leading-[1.1]"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Décor{" "}
            <span className="font-semibold text-[#C5A059]">Inspiration</span>{" "}
            Board
          </h1>
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#C5A059]/50" />
            <svg viewBox="0 0 56 18" className="w-14 h-4 text-[#C5A059]" fill="none">
              <path d="M2 9 Q14 4 28 9 Q42 14 54 9" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="28" cy="9" r="2.2" fill="currentColor" />
              <circle cx="10" cy="8.5" r="1" fill="currentColor" opacity="0.5" />
              <circle cx="46" cy="8.5" r="1" fill="currentColor" opacity="0.5" />
            </svg>
            <div className="h-px w-10 bg-[#C5A059]/50" />
          </div>

          <p className="text-[#5C4A3C] dark:text-[#C5B9AC] text-base max-w-2xl mx-auto font-light leading-relaxed">
            Explore curated wedding decoration ideas from floral arches and
            fairy light canopies to table settings and candlelit backdrops.
          </p>

          {/* stats row */}
          <div className="flex items-center justify-center gap-12 mt-10">
            {[
              { label: "Décor Ideas", value: `${INSPIRATION_IMAGES.length}+` },
              { label: "Styles", value: allStyles.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-display font-bold text-[#C5A059]">{value}</p>
                <p className="text-[10px] text-[#5C4A3C] dark:text-[#C5B9AC] uppercase tracking-wider mt-1 font-light">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-8">
        <Tabs defaultValue="feed" className="w-full">

          {/* Tab switcher */}
          <TabsList className="grid grid-cols-2 p-1 bg-[#F5EEE6] dark:bg-[#1A1610] border border-[#C5A059]/20 rounded-full shadow-sm w-full sm:w-72 mb-6">
            <TabsTrigger
              value="feed"
              className="rounded-full text-sm px-6 py-2 text-[#5C4A3C] dark:text-[#C5B9AC] data-[state=active]:bg-[#C5A059] data-[state=active]:text-white data-[state=active]:shadow font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="rounded-full text-sm px-6 py-2 text-[#5C4A3C] dark:text-[#C5B9AC] data-[state=active]:bg-[#C5A059] data-[state=active]:text-white data-[state=active]:shadow font-medium transition-all"
            >
              <Heart className="w-4 h-4 mr-1.5" />
              My Board
              {savedImages.length > 0 && (
                <span className="ml-1.5 bg-white text-[#C5A059] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {savedImages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Discover tab ──────────────────────────────────────────── */}
          <TabsContent
            value="feed"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Context Banner */}
            <div className="flex gap-2 items-center mb-4 bg-[#F5EEE6] dark:bg-[#1A1610] border border-[#C5A059]/15 p-3 rounded-xl text-xs text-[#5C4A3C] dark:text-[#C5B9AC]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              <span>
                Workspace View: <strong className="text-[#2E251E] dark:text-[#F3EFE9]">{selectedEvent ? selectedEvent.name : "All Events Combined"}</strong>
                {selectedEvent ? "" : " (Roll-up Dashboard)"} · Space: <span className="font-semibold capitalize">{viewMode === 'collaborative' ? 'Shared Workspace' : 'Private Section'}</span>
              </span>
            </div>

            {/* Live Interactive Search Box Input Field Component Component */}
            <div className="relative mb-6 max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60 group-focus-within:text-[#C5A059] transition-colors" />
              <Input
                type="text"
                placeholder="Search decor inspiration (Press Enter to search)..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  // Only push lookups down to network layers when user declares completion via Enter click
                  if (e.key === 'Enter') {
                    setSearchQuery(localSearch);
                  }
                }}
                className="rounded-full pl-10 pr-10 py-5 text-sm border-[#C5A059]/25 focus-visible:ring-[#C5A059] focus-visible:ring-offset-0 bg-[#F5EEE6] dark:bg-[#1A1610] text-[#2E251E] dark:text-[#F3EFE9] placeholder:text-[#5C4A3C]/50 shadow-sm font-light"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch("");
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4A3C]/50 hover:text-[#C5A059] p-1 rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Style filter bar */}
            <div className="bg-[#F5EEE6] dark:bg-[#1A1610] border border-[#C5A059]/15 rounded-2xl px-5 py-4 shadow-sm mb-6 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#5C4A3C]/70 dark:text-[#C5B9AC] uppercase tracking-wider shrink-0">
                <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                Filter by Style
              </span>

              {allStyles.map((style) => {
                const isActive = activeStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 shadow-sm
                      ${isActive
                        ? STYLE_ACTIVE[style] ?? "bg-[#C5A059] text-white border-[#C5A059]"
                        : "bg-[#FBF2E9] dark:bg-[#0D0B0A] text-[#5C4A3C] dark:text-[#C5B9AC] border-[#C5A059]/20 hover:border-[#C5A059] hover:text-[#C5A059]"
                      }`}
                  >
                    {style}
                  </button>
                );
              })}

              {activeStyles.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-[#5C4A3C]/60 hover:text-[#C5A059] transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Result count */}
            <p className="text-sm text-[#5C4A3C]/60 dark:text-[#C5B9AC] mb-2 font-light">
              Showing{" "}
              <span className="font-semibold text-[#2E251E] dark:text-[#F3EFE9]">{filteredImages.length}</span>{" "}
              décor idea{filteredImages.length !== 1 ? "s" : ""}
              {activeStyles.length > 0 && (
                <span>
                  {" "}·{" "}
                  {activeStyles.map((s, i) => (
                    <span key={s}>
                      <span className="font-medium text-[#C5A059]">{s}</span>
                      {i < activeStyles.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              )}
            </p>

            {loadingDiscovery && filteredImages.length === 0 ? (
              <InspirationGridSkeleton />
            ) : (
              <>
                <ImageGrid images={filteredImages} onImageClick={setSelectedImage} />

                {hasMore && filteredImages.length >= 30 && (
                  <div className="flex justify-center items-center pt-8 pb-4">
                    <button
                      onClick={loadMoreDiscovery}
                      disabled={loadingDiscovery}
                      className="rounded-full px-8 py-3 border border-[#C5A059] bg-transparent text-sm font-medium text-[#C5A059] hover:bg-[#C5A059]/10 transition-all shadow-sm disabled:opacity-50 tracking-wide"
                    >
                      {loadingDiscovery ? "Loading Next 30 Concepts..." : "Show More Ideas"}
                    </button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ── My Board tab ──────────────────────────────────────────── */}
          <TabsContent
            value="board"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {loadingBoard ? (
              <InspirationGridSkeleton />
            ) : (
              <>
                {savedImages.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Flower2 className="w-4 h-4 text-[#C5A059]" />
                    <p className="text-sm text-[#5C4A3C] dark:text-[#C5B9AC] font-light">
                      You have{" "}
                      <span className="font-semibold text-[#2E251E] dark:text-[#F3EFE9]">{savedImages.length}</span>{" "}
                      décor idea{savedImages.length !== 1 ? "s" : ""} pinned to your board.
                    </p>
                  </div>
                )}
                <ImageGrid images={savedImages} onImageClick={setSelectedImage} />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview modal */}
      <ImagePreviewModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

/* ─── Export ─────────────────────────────────────────────────────────────── */
export default function Inspiration() {
  return (
    <InspirationProvider>
      <InspirationContent />
    </InspirationProvider>
  );
}
