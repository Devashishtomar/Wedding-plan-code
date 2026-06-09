import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Heart, X, Sparkles } from "lucide-react";
import { InspirationImage } from "@/lib/inspirationData";
import { useInspiration } from "@/contexts/InspirationContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-toast";


/* ─── Style palette — luxury boho gold tones ─────────────────────────────── */
const STYLE_COLORS: Record<string, string> = {
  Romantic: "bg-[#FAF0E4] text-[#9A7340] border-[#C5A059]/30",
  Bohemian: "bg-[#F5EEE0] text-[#8A6830] border-[#C5A059]/30",
  Rustic: "bg-[#F0EAE0] text-[#7A6040] border-[#C5A059]/30",
  Modern: "bg-[#EEF0EE] text-[#5C5C5C] border-[#C5A059]/30",
  Glam: "bg-[#F5EDE8] text-[#9A6050] border-[#C5A059]/30",
  Dramatic: "bg-[#E8E4DC] text-[#5C4A3C] border-[#C5A059]/30",
};

interface ImagePreviewModalProps {
  image: InspirationImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImagePreviewModal = ({
  image,
  isOpen,
  onClose,
}: ImagePreviewModalProps) => {
  const { isSaved, saveImage, removeImage, savedImages } = useInspiration();
  const { canManageEvents } = usePermissions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const saved = image ? isSaved(image.id) : false;

  const toggleSave = async () => {
    if (!image || submitting) return;
    setSubmitting(true);
    try {
      if (saved) {
        const activePins = savedImages || [];
        const targetedPinRecord = activePins.find(img => img.url === image.url || img.id === image.id);
        const deletionId = targetedPinRecord ? targetedPinRecord.id : image.id;
        await removeImage(deletionId);
      } else {
        await saveImage(image);
      }
    } catch (err) {
      console.error("Context mutation request failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!image) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();

      let extension = "jpg";
      if (blob.type === "image/png") extension = "png";
      else if (blob.type === "image/webp") extension = "webp";
      else if (blob.type === "image/gif") extension = "gif";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${image.title
        .replace(/\s+/g, "-")
        .toLowerCase()}-${image.id}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the image.",
        variant: "destructive",
      });
    }
  };

  const styleBadge = STYLE_COLORS[image.style] ?? "bg-[#F5EEE6] text-[#5C4A3C] border-[#C5A059]/30";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden rounded-2xl border border-[#C5A059]/20 bg-[#FBF2E9] shadow-2xl">
        <DialogTitle className="sr-only">{image.title}</DialogTitle>

        <div className="flex flex-col md:flex-row h-auto md:h-[85vh]">
          {/* ── Image panel ───────────────────────────────────────────── */}
          <div className="relative flex-1 bg-[#1A140E] flex items-center justify-center overflow-hidden min-h-[260px]">
            <img
              src={image.url}
              alt={image.title}
              className="max-h-full max-w-full object-contain"
            />

            {/* close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0D0B0A]/60 backdrop-blur text-[#FAF6EE] flex items-center justify-center hover:bg-[#0D0B0A]/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Info panel ────────────────────────────────────────────── */}
          <div className="w-full md:w-80 bg-[#FBF2E9] flex flex-col border-l border-[#C5A059]/15">
            {/* header */}
            <div className="p-6 border-b border-[#C5A059]/15">
              {/* Style badge */}
              <span
                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-3 ${styleBadge}`}
              >
                {image.style}
              </span>

              <h2 className="text-xl font-display font-semibold text-[#2E251E] leading-snug">
                {image.title}
              </h2>
            </div>

            {/* description + tip */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]/70 mb-2">
                  About this décor
                </p>
                <p className="text-sm text-[#5C4A3C] leading-relaxed font-light">
                  {image.description}
                </p>
              </div>

              {/* Inspiration tip */}
              <div className="bg-[#C5A059]/8 border border-[#C5A059]/25 rounded-xl p-4" style={{ background: "rgba(197,160,89,0.07)" }}>
                <p className="text-xs font-semibold text-[#C5A059] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Décor Tip
                </p>
                <p className="text-xs text-[#5C4A3C] leading-relaxed font-light">
                  Share this idea with your decorator or florist to recreate the
                  look for your special day.
                </p>
              </div>
            </div>

            {/* action buttons */}
            <div className="p-6 border-t border-[#C5A059]/15 flex flex-col gap-3">
              <Button
                onClick={toggleSave}
                disabled={!canManageEvents || submitting}
                className={`w-full h-11 rounded-full gap-2 font-medium tracking-wide transition-all duration-200 text-sm ${!canManageEvents
                  ? "bg-[#F5EEE6] text-[#5C4A3C]/40 cursor-not-allowed border border-[#C5A059]/15"
                  : saved
                    ? "bg-[#FBF2E9] text-[#C5A059] border border-[#C5A059] hover:bg-[#C5A059]/10"
                    : "bg-[#C5A059] text-white hover:bg-[#B28D47] shadow-md"
                  }`}
                variant="ghost"
              >
                <Heart
                  className={`w-4 h-4 ${saved && canManageEvents ? "fill-current" : ""}`}
                />
                {!canManageEvents ? "Viewing Only" : saved ? "Pinned to Board ✓" : "Pin to My Board"}
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full h-11 rounded-full gap-2 font-medium border-[#C5A059]/30 text-[#5C4A3C] bg-transparent hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                Save Image
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
