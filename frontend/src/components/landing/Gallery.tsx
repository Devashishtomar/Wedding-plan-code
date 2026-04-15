import { useState, useMemo, useCallback, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

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
  { src: dsc0928, alt: "Event Photo DSC_0928", category: "Photography" },
  { src: emerArt1, alt: "EmerArt Installation", category: "Art" },
  { src: har7457, alt: "Corporate Event HAR_7457", category: "Corporate" },
  { src: har7459, alt: "Corporate Event HAR_7459", category: "Corporate" },
  { src: har7506, alt: "Corporate Event HAR_7506", category: "Corporate" },
  { src: har7507, alt: "Corporate Event HAR_7507", category: "Corporate" },
  { src: img6530, alt: "IMG 6530 Event", category: "Photography" },
  { src: screenshot1, alt: "Website Screenshot 1", category: "Design" },
  { src: screenshot2, alt: "Website Screenshot 2", category: "Design" },
];

// Memoized gallery item component
const GalleryItem = memo(({
  item,
  index,
  onOpen
}: {
  item: typeof galleryItems[0];
  index: number;
  onOpen: (index: number) => void;
}) => (
  <div
    className="group relative overflow-hidden rounded-lg cursor-pointer"
    style={{ contain: 'layout paint' }}
    onClick={() => onOpen(index)}
  >
    <OptimizedImage
      src={item.src}
      alt={item.alt}
      className="aspect-square group-hover:scale-105 transition-transform duration-300"
      width={400}
      height={400}
      priority={index < 6}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-landing-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    <div className="absolute top-4 left-4 bg-landing-accent text-landing-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
      {item.category}
    </div>
  </div>
));

GalleryItem.displayName = "GalleryItem";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedItems = useMemo(() =>
    showAll ? galleryItems : galleryItems.slice(0, 9),
    [showAll]
  );

  const openModal = useCallback((index: number) => setSelectedImage(index), []);
  const closeModal = useCallback(() => setSelectedImage(null), []);
  const nextImage = useCallback(() => {
    setSelectedImage(prev => prev !== null ? (prev + 1) % galleryItems.length : null);
  }, []);
  const prevImage = useCallback(() => {
    setSelectedImage(prev => prev !== null ? (prev === 0 ? galleryItems.length - 1 : prev - 1) : null);
  }, []);

  return (
    <section id="gallery" className="py-20 bg-landing-background" style={{ contain: 'layout' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-landing-foreground">
            Event <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-xl text-landing-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of stunning events and see how we transform ordinary spaces into extraordinary experiences.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, index) => (
            <GalleryItem
              key={index}
              item={item}
              index={index}
              onOpen={openModal}
            />
          ))}
        </div>

        {!showAll && galleryItems.length > 9 && (
          <div className="text-center mt-10">
            <Button
              size="lg"
              onClick={() => setShowAll(true)}
              className="bg-transparent border-2 border-landing-primary text-landing-primary hover:bg-landing-primary hover:text-white font-semibold transition-all duration-300"
            >
              Show All ({galleryItems.length} photos)
            </Button>
          </div>
        )}

        <Dialog open={selectedImage !== null} onOpenChange={closeModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-landing-card border-landing-border">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-landing-foreground">
                {selectedImage !== null && galleryItems[selectedImage].category} Event
              </DialogTitle>
            </DialogHeader>
            {selectedImage !== null && (
              <div className="relative">
                <img
                  src={galleryItems[selectedImage].src}
                  alt={galleryItems[selectedImage].alt}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  decoding="async"
                  width={800}
                  height={600}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-landing-background/80 hover:bg-landing-background text-landing-foreground"
                  onClick={prevImage}
                >
                  <ChevronLeft size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-landing-background/80 hover:bg-landing-background text-landing-foreground"
                  onClick={nextImage}
                >
                  <ChevronRight size={24} />
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
