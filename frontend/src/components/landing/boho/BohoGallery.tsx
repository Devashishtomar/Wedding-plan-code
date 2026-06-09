import React, { useState, useMemo, useCallback, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "../OptimizedImage";

import corporateImage from "@/assets/corporate-event.jpg";
import cul4 from "@/assets/cul_4.jpg";
import cul5 from "@/assets/cul_5.jpg";
import custom16 from "@/assets/custom-16.jpg";
import custom2 from "@/assets/custom-2.jpg";
import custom7 from "@/assets/custom-7.jpg";
import djParty from "@/assets/dj-party.jpg";
import dj4 from "@/assets/dj4.jpg";
import dj8 from "@/assets/dj8.jpg";
import dsc0928 from "@/assets/DSC_0928.jpg";
import emerArt1 from "@/assets/emerart-1.jpg";
import har7457 from "@/assets/HAR_7457.jpg";
import har7459 from "@/assets/HAR_7459.jpg";
import har7506 from "@/assets/HAR_7506.jpg";
import har7507 from "@/assets/HAR_7507.jpg";
import heroImage from "@/assets/hero-event.jpg";
import img6530 from "@/assets/IMG_6530.jpg";
import screenshot1 from "@/assets/screenshot1.jpg";
import screenshot2 from "@/assets/screenshot2.jpg";
import weddingImage from "@/assets/wedding-ceremony.jpg";

const galleryItems = [
  { src: weddingImage, alt: "Wedding Ceremony", category: "Wedding" },
  { src: corporateImage, alt: "Corporate Event", category: "Corporate" },
  { src: djParty, alt: "DJ Party", category: "Party" },
  { src: heroImage, alt: "Cultural Celebration", category: "Cultural" },
  { src: cul4, alt: "Culinary Event 4", category: "Food" },
  { src: cul5, alt: "Culinary Event 5", category: "Food" },
  { src: custom16, alt: "Custom Decoration 16", category: "Custom" },
  { src: custom2, alt: "Custom Decoration 2", category: "Custom" },
  { src: custom7, alt: "Custom Decoration 7", category: "Custom" },
  { src: dj4, alt: "DJ Setup 4", category: "Music" },
  { src: dj8, alt: "DJ Setup 8", category: "Music" },
  { src: dsc0928, alt: "Grand Event DSC_0928", category: "Bespoke" },
  { src: emerArt1, alt: "Mehndi Design EmerArt", category: "Art" },
  { src: har7457, alt: "Decoration Detail 7457", category: "Detail" },
  { src: har7459, alt: "Decoration Detail 7459", category: "Detail" },
  { src: har7506, alt: "Venue Setup 7506", category: "Venue" },
  { src: har7507, alt: "Venue Setup 7507", category: "Venue" },
  { src: img6530, alt: "Guest Gathering 6530", category: "Party" },
  { src: screenshot1, alt: "Event Planning Screenshot 1", category: "AI Dashboard" },
  { src: screenshot2, alt: "Event Planning Screenshot 2", category: "AI Dashboard" },
];

const categories = ["All", "Wedding", "Corporate", "Party", "Cultural", "Custom", "AI Dashboard"];

export const BohoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleImageClick = useCallback(
    (index: number) => {
      const clickedItem = filteredItems[index];
      const fullIndex = galleryItems.findIndex((x) => x.src === clickedItem.src);
      setSelectedImage(fullIndex);
    },
    [filteredItems]
  );

  const closeModal = useCallback(() => setSelectedImage(null), []);

  const nextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedImage === null) return;
      setSelectedImage((prev) =>
        prev !== null && prev < galleryItems.length - 1 ? prev + 1 : 0
      );
    },
    [selectedImage]
  );

  const prevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedImage === null) return;
      setSelectedImage((prev) =>
        prev !== null && prev > 0 ? prev - 1 : galleryItems.length - 1
      );
    },
    [selectedImage]
  );

  return (
    <section id="gallery" className="py-28" style={{ background: "#F7F0E6" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#C9973A" }}>
            Visual Portfolio
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
          >
            Explore Our{" "}
            <span style={{ color: "#C9973A" }}>Magic Portfolio</span>
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#6B5744" }}>
            Witness how we combine creative passion with precise smart systems to craft breathtaking real-life celebrations.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full text-xs font-semibold uppercase tracking-wider py-2 px-6 border transition-all duration-300"
              style={
                activeCategory === cat
                  ? { background: "#C9973A", color: "#FFFFFF", borderColor: "#C9973A" }
                  : { background: "transparent", color: "#6B5744", borderColor: "rgba(201,151,58,0.3)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{ border: "1px solid rgba(201,151,58,0.15)" }}
            >
              <OptimizedImage
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                width={300}
                height={300}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-5 right-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span
                  className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: "#C9973A" }}
                >
                  {item.category}
                </span>
                <p className="text-sm font-semibold mt-1.5 leading-tight">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={closeModal}>
          <DialogContent
            className="max-w-4xl max-h-[90vh] p-0 overflow-hidden"
            style={{ background: "#FAF5EE", border: "1px solid rgba(201,151,58,0.2)" }}
          >
            <DialogHeader className="p-6 pb-0">
              <DialogTitle
                className="text-lg font-bold text-left"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
              >
                {selectedImage !== null && galleryItems[selectedImage].category} Portfolio
              </DialogTitle>
            </DialogHeader>
            {selectedImage !== null && (
              <div className="relative">
                <img
                  src={galleryItems[selectedImage].src}
                  alt={galleryItems[selectedImage].alt}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  decoding="async"
                  width={800}
                  height={600}
                />
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border shadow-md transition-all hover:scale-110"
                  style={{ background: "#FFFFFF", borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                  onClick={prevImage}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border shadow-md transition-all hover:scale-110"
                  style={{ background: "#FFFFFF", borderColor: "rgba(201,151,58,0.3)", color: "#1A1208" }}
                  onClick={nextImage}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BohoGallery;
