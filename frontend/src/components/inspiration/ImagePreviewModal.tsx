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


/* ─── Style palette (mirrored from Inspiration.tsx) ─────────────────────── */
const STYLE_COLORS: Record<string, string> = {
  Romantic: "bg-rose-100 text-rose-600 border-rose-200",
  Bohemian: "bg-amber-100 text-amber-600 border-amber-200",
  Rustic: "bg-orange-100 text-orange-600 border-orange-200",
  Modern: "bg-sky-100 text-sky-600 border-sky-200",
  Glam: "bg-purple-100 text-purple-600 border-purple-200",
  Dramatic: "bg-zinc-100 text-zinc-600 border-zinc-200",
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


  const styleBadge = STYLE_COLORS[image.style] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden rounded-2xl border-none bg-white shadow-2xl">
        <DialogTitle className="sr-only">{image.title}</DialogTitle>

        <div className="flex flex-col md:flex-row h-auto md:h-[85vh]">
          {/* ── Image panel ───────────────────────────────────────────── */}
          <div className="relative flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden min-h-[260px]">
            <img
              src={image.url}
              alt={image.title}
              className="max-h-full max-w-full object-contain"
            />



            {/* close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Info panel ────────────────────────────────────────────── */}
          <div className="w-full md:w-80 bg-white flex flex-col border-l border-zinc-100">
            {/* header */}
            <div className="p-6 border-b border-zinc-100">
              {/* Style badge */}
              <span
                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-3 ${styleBadge}`}
              >
                {image.style}
              </span>

              <h2 className="text-xl font-bold text-zinc-800 leading-snug">
                {image.title}
              </h2>

            </div>

            {/* description + tags */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  About this décor
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {image.description}
                </p>
              </div>

              {/* Inspiration tip */}
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-rose-600 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Décor Tip
                </p>
                <p className="text-xs text-rose-500 leading-relaxed">
                  Share this idea with your decorator or florist to recreate the
                  look for your special day.
                </p>
              </div>
            </div>

            {/* action buttons */}
            <div className="p-6 border-t border-zinc-100 flex flex-col gap-3">
              <Button
                onClick={toggleSave}
                disabled={!canManageEvents || submitting}
                className={`w-full h-11 rounded-full gap-2 font-semibold transition-all duration-200 ${!canManageEvents
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
                  : saved
                    ? "bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100"
                    : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200"
                  }`}
                variant="ghost"
              >
                <Heart
                  className={`w-4 h-4 ${saved && canManageEvents ? "fill-current text-rose-500" : ""}`}
                />
                {!canManageEvents ? "Viewing Only (No Modify)" : saved ? "Pinned to Board ✓" : "Pin to My Board"}
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full h-11 rounded-full gap-2 font-medium border-zinc-200 text-zinc-600 hover:border-rose-300 hover:text-rose-500"
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
