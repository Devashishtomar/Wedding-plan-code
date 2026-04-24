import { useState, useRef, useCallback } from "react";
import { CustomInvitationData } from "@/types/customInvitation";
import DraggableElement from "./DraggableElement";
import { cn } from "@/lib/utils";

interface EditorCanvasProps {
  invitation: CustomInvitationData;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<import("@/types/customInvitation").CanvasElement>) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const EditorCanvas = ({
  invitation,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  canvasRef,
}: EditorCanvasProps) => {
  const [canvasBounds, setCanvasBounds] = useState<DOMRect | null>(null);

  // Update canvas bounds when ref is set
  const updateBounds = useCallback(() => {
    if (canvasRef.current) {
      setCanvasBounds(canvasRef.current.getBoundingClientRect());
    }
  }, [canvasRef]);

  // Update bounds on mount and resize
  useState(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  });

  const getBorderStyle = () => {
    if (!invitation.border || invitation.border.borderStyle === "none") return {};

    const base = {
      borderColor: invitation.border.color,
      borderWidth: invitation.border.thickness,
      borderStyle: "solid" as const,
    };

    switch (invitation.border.cornerStyle) {
      case "rounded":
        return { ...base, borderRadius: "16px" };
      case "ornate":
        return { ...base, borderRadius: "8px", boxShadow: `inset 0 0 20px ${invitation.border.color}20` };
      default:
        return base;
    }
  };

  // Create relative canvas bounds for element constraints
  const relativeCanvasBounds = canvasBounds ? {
    ...canvasBounds,
    width: invitation.canvasSize.width,
    height: invitation.canvasSize.height,
  } as DOMRect : null;

  return (
    <div className="flex-1 flex items-start justify-center p-8 bg-muted/30 overflow-auto">
      <div
        ref={canvasRef}
        className="relative shadow-2xl shrink-0 overflow-hidden my-auto"
        style={{
          width: invitation.canvasSize.width,
          height: invitation.canvasSize.height,
          minWidth: invitation.canvasSize.width,
          minHeight: invitation.canvasSize.height,
          backgroundColor: invitation.backgroundImage ? "transparent" : invitation.backgroundColor,
          backgroundImage: invitation.backgroundImage ? `url(${invitation.backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...getBorderStyle(),
        }}
        onClick={() => onSelectElement(null)}
        onMouseEnter={updateBounds}
      >
        {/* Background overlay for opacity control */}
        {invitation.backgroundImage && invitation.backgroundOpacity < 1 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: "#ffffff",
              opacity: 1 - invitation.backgroundOpacity,
            }}
          />
        )}

        {/* Render all elements with drag/resize */}
        {invitation.elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={() => onSelectElement(element.id)}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
            canvasBounds={relativeCanvasBounds}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorCanvas;
