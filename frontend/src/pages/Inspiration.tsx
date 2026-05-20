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

/* ─── Style colour palette ───────────────────────────────────────────────── */
const STYLE_COLORS: Record<string, string> = {
  Romantic: "bg-rose-100 text-rose-700 border-rose-200",
  Bohemian: "bg-amber-100 text-amber-700 border-amber-200",
  Rustic: "bg-orange-100 text-orange-700 border-orange-200",
  Modern: "bg-sky-100 text-sky-700 border-sky-200",
  Glam: "bg-purple-100 text-purple-700 border-purple-200",
  Dramatic: "bg-zinc-200 text-zinc-700 border-zinc-300",
};

const STYLE_ACTIVE: Record<string, string> = {
  Romantic: "bg-rose-500 text-white border-rose-500 shadow-rose-200",
  Bohemian: "bg-amber-500 text-white border-amber-500 shadow-amber-200",
  Rustic: "bg-orange-500 text-white border-orange-500 shadow-orange-200",
  Modern: "bg-sky-500 text-white border-sky-500 shadow-sky-200",
  Glam: "bg-purple-500 text-white border-purple-500 shadow-purple-200",
  Dramatic: "bg-zinc-700 text-white border-zinc-700 shadow-zinc-300",
};

/* gradient fallbacks per style */
const FALLBACK_BG: Record<string, string> = {
  Romantic: "from-rose-200 via-pink-100 to-rose-50",
  Bohemian: "from-amber-200 via-yellow-100 to-amber-50",
  Rustic: "from-orange-200 via-orange-100 to-stone-50",
  Modern: "from-sky-200 via-blue-100 to-sky-50",
  Glam: "from-purple-200 via-fuchsia-100 to-purple-50",
  Dramatic: "from-zinc-300 via-zinc-200 to-zinc-50",
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
  const fallback = FALLBACK_BG[image.style] ?? "from-rose-100 via-pink-50 to-white";

  return (
    <div
      className="relative group overflow-hidden rounded-2xl break-inside-avoid cursor-zoom-in mb-4 shadow-sm hover:shadow-xl transition-shadow duration-300"
      onClick={() => onImageClick(image)}
    >
      {imgError ? (
        /* ── Fallback card when image fails to load ── */
        <div className={`w-full min-h-[220px] bg-gradient-to-br ${fallback} flex flex-col items-center justify-center p-6 text-center select-none`}>
          <Flower2 className="w-10 h-10 text-rose-300 mb-3" />
          <p className="text-zinc-600 font-semibold text-sm leading-snug mb-2">{image.title}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${STYLE_COLORS[image.style] ?? ""}`}>
            {image.style}
          </span>
        </div>
      ) : (
        <>
          {/* shimmer placeholder while loading */}
          {!imgLoaded && (
            <div className={`w-full min-h-[220px] bg-gradient-to-br ${fallback} animate-pulse`} />
          )}
          <img
            src={image.url}
            alt={image.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 block ${imgLoaded ? "opacity-100" : "opacity-0 h-0"
              }`}
          />
          {/* gradient overlay */}
          {imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </>
      )}

      {/* heart button */}
      <button
        aria-label={saved ? "Remove from board" : "Save to board"}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200
          ${saved
            ? "bg-rose-500 text-white scale-110"
            : "bg-white/90 text-zinc-700 opacity-0 group-hover:opacity-100 hover:bg-rose-50"
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
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1.5 inline-block ${STYLE_COLORS[image.style] ?? "bg-white/20 text-white border-white/30"}`}>
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
      <div className="flex flex-col items-center justify-center h-72 text-center mt-10 rounded-2xl border border-dashed border-rose-200 bg-rose-50/30 p-10">
        <Flower2 className="w-14 h-14 text-rose-300 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-700 mb-2">
          No décor ideas found
        </h3>
        <p className="text-zinc-400 max-w-sm text-sm">
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
        <div className="bg-zinc-100 rounded-2xl h-64 w-full" />
        <div className="space-y-2 px-2">
          <div className="h-4 bg-zinc-100 rounded w-3/4" />
          <div className="h-3 bg-zinc-100 rounded w-1/2" />
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-white to-pink-50/40 pb-16">

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 100%)" }}
      >
        {/* decorative petals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {["top-4 left-8", "top-8 right-16", "bottom-4 left-1/3", "bottom-8 right-1/4"].map(
            (pos, i) => (
              <Flower2
                key={i}
                className={`absolute ${pos} text-rose-200 opacity-40`}
                style={{ width: 40 + i * 12, height: 40 + i * 12 }}
              />
            )
          )}
        </div>

        <div className="relative container mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-rose-200 text-rose-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Wedding Décor Inspiration
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-800 mb-3">
            Décor{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Inspiration
            </span>{" "}
            Board
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Explore curated wedding decoration ideas — from floral arches and
            fairy light canopies to table settings and candlelit backdrops.
          </p>

          {/* stats row */}
          <div className="flex items-center justify-center gap-10 mt-8">
            {[
              { label: "Décor Ideas", value: `${INSPIRATION_IMAGES.length}+` },
              { label: "Styles", value: allStyles.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-rose-500">{value}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-8">
        <Tabs defaultValue="feed" className="w-full">

          {/* Tab switcher */}
          <TabsList className="grid grid-cols-2 p-1 bg-white border border-zinc-100 rounded-full shadow-sm w-full sm:w-72 mb-6">
            <TabsTrigger
              value="feed"
              className="rounded-full text-sm px-6 py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="rounded-full text-sm px-6 py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow"
            >
              <Heart className="w-4 h-4 mr-1.5" />
              My Board
              {savedImages.length > 0 && (
                <span className="ml-1.5 bg-white text-rose-500 text-xs font-bold px-1.5 py-0.5 rounded-full">
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
            {/* Context Bubble Status Banner indicating correct isolation boundaries */}
            <div className="flex gap-2 items-center mb-4 bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-xs text-zinc-600">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              <span>
                Workspace View: <strong className="text-zinc-800">{selectedEvent ? selectedEvent.name : "All Events Combined"}</strong>
                {selectedEvent ? "" : " (Roll-up Dashboard)"} · Space: <span className="font-semibold capitalize">{viewMode === 'collaborative' ? 'Shared workspace' : 'Private section'}</span>
              </span>
            </div>

            {/* Live Interactive Search Box Input Field Component Component */}
            <div className="relative mb-6 max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
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
                className="rounded-xl pl-10 pr-10 py-6 text-sm border-zinc-200 focus-visible:ring-rose-400 focus-visible:ring-offset-0 bg-white shadow-sm"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch("");
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Style filter bar */}
            <div className="bg-white border border-zinc-100 rounded-2xl px-5 py-4 shadow-sm mb-6 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider shrink-0">
                <Tag className="w-3.5 h-3.5" />
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
                        ? STYLE_ACTIVE[style] ?? "bg-zinc-700 text-white border-zinc-700"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-rose-300 hover:text-rose-500"
                      }`}
                  >
                    {style}
                  </button>
                );
              })}

              {activeStyles.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Result count */}
            <p className="text-sm text-zinc-400 mb-2">
              Showing{" "}
              <span className="font-semibold text-zinc-600">{filteredImages.length}</span>{" "}
              décor idea{filteredImages.length !== 1 ? "s" : ""}
              {activeStyles.length > 0 && (
                <span>
                  {" "}·{" "}
                  {activeStyles.map((s, i) => (
                    <span key={s}>
                      <span
                        className={`font-medium ${STYLE_COLORS[s]
                          ?.split(" ")
                          .find((c) => c.startsWith("text-")) ?? "text-rose-500"
                          }`}
                      >
                        {s}
                      </span>
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
                      className="rounded-full px-8 py-3 border border-zinc-200 bg-white text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm disabled:opacity-50"
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
                    <Flower2 className="w-4 h-4 text-rose-400" />
                    <p className="text-sm text-zinc-500">
                      You have{" "}
                      <span className="font-semibold text-zinc-700">{savedImages.length}</span>{" "}
                      décor idea{savedImages.length !== 1 ? "s" : ""} pinned to your isolated view.
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
