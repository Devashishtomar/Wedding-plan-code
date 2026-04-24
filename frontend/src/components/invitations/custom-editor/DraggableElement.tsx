import { useState, useRef, useCallback, useEffect } from "react";
import { CanvasElement, TextElement, ImageElement, ShapeElement } from "@/types/customInvitation";
import { cn } from "@/lib/utils";

interface DraggableElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  canvasBounds: DOMRect | null;
}

const ShapeRenderer = ({ element }: { element: ShapeElement }) => {
  const shapes: Record<string, React.ReactNode> = {
    heart: (
      <svg viewBox="0 0 24 24" fill={element.color} style={{ opacity: element.opacity }} className="w-full h-full">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    ring: (
      <svg viewBox="0 0 24 24" fill="none" stroke={element.color} strokeWidth="2" style={{ opacity: element.opacity }} className="w-full h-full">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="5" />
      </svg>
    ),
    flower: (
      <svg viewBox="0 0 24 24" fill={element.color} style={{ opacity: element.opacity }} className="w-full h-full">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill={element.color} style={{ opacity: element.opacity }} className="w-full h-full">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" fill={element.color} style={{ opacity: element.opacity }} className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    diamond: (
      <svg viewBox="0 0 24 24" fill={element.color} style={{ opacity: element.opacity }} className="w-full h-full">
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
      </svg>
    ),
  };

  return <>{shapes[element.shapeType] || shapes.circle}</>;
};

const DraggableElement = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  canvasBounds,
}: DraggableElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    if ((e.target as HTMLElement).dataset.handle) {
      // Start resizing
      const handle = (e.target as HTMLElement).dataset.handle!;
      setIsResizing(true);
      setResizeHandle(handle);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: element.size.width,
        height: element.size.height,
        elementX: element.position.x,
        elementY: element.position.y,
      };
    } else {
      // Start dragging
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        elementX: element.position.x,
        elementY: element.position.y,
      };
    }
  }, [element, onSelect]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        let newX = dragStart.current.elementX + dx;
        let newY = dragStart.current.elementY + dy;
        
        // Constrain to canvas bounds
        if (canvasBounds) {
          newX = Math.max(0, Math.min(newX, canvasBounds.width - element.size.width));
          newY = Math.max(0, Math.min(newY, canvasBounds.height - element.size.height));
        }
        
        onUpdate({ position: { x: newX, y: newY } });
      }
      
      if (isResizing && resizeHandle) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        
        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;
        let newX = resizeStart.current.elementX;
        let newY = resizeStart.current.elementY;
        
        if (resizeHandle.includes('e')) {
          newWidth = Math.max(30, resizeStart.current.width + dx);
        }
        if (resizeHandle.includes('w')) {
          const widthDelta = Math.min(dx, resizeStart.current.width - 30);
          newWidth = resizeStart.current.width - widthDelta;
          newX = resizeStart.current.elementX + widthDelta;
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(20, resizeStart.current.height + dy);
        }
        if (resizeHandle.includes('n')) {
          const heightDelta = Math.min(dy, resizeStart.current.height - 20);
          newHeight = resizeStart.current.height - heightDelta;
          newY = resizeStart.current.elementY + heightDelta;
        }
        
        onUpdate({
          size: { width: newWidth, height: newHeight },
          position: { x: newX, y: newY },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, resizeHandle, element.size, canvasBounds, onUpdate]);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    zIndex: element.zIndex,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const renderContent = () => {
    switch (element.type) {
      case "text": {
        const textEl = element as TextElement;
        return (
          <div
            style={{
              fontFamily: textEl.style.fontFamily,
              fontSize: textEl.style.fontSize,
              color: textEl.style.color,
              fontWeight: textEl.style.isBold ? "bold" : "normal",
              fontStyle: textEl.style.isItalic ? "italic" : "normal",
              textAlign: textEl.style.textAlign,
              lineHeight: textEl.style.lineHeight,
              letterSpacing: textEl.style.letterSpacing,
              textShadow: textEl.style.textShadow,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: textEl.style.textAlign === "center" ? "center" : 
                            textEl.style.textAlign === "right" ? "flex-end" : "flex-start",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
            }}
          >
            {textEl.content}
          </div>
        );
      }
      case "image": {
        const imgEl = element as ImageElement;
        return (
          <img
            src={imgEl.src}
            alt=""
            className="w-full h-full object-cover pointer-events-none"
            style={{ opacity: imgEl.opacity }}
            draggable={false}
          />
        );
      }
      case "shape": {
        const shapeEl = element as ShapeElement;
        return <ShapeRenderer element={shapeEl} />;
      }
      default:
        return null;
    }
  };

  const resizeHandles = isSelected && (
    <>
      {/* Corner handles */}
      <div data-handle="nw" className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary border border-white rounded-sm cursor-nw-resize" />
      <div data-handle="ne" className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary border border-white rounded-sm cursor-ne-resize" />
      <div data-handle="sw" className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary border border-white rounded-sm cursor-sw-resize" />
      <div data-handle="se" className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary border border-white rounded-sm cursor-se-resize" />
      {/* Edge handles */}
      <div data-handle="n" className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary border border-white rounded-sm cursor-n-resize" />
      <div data-handle="s" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary border border-white rounded-sm cursor-s-resize" />
      <div data-handle="w" className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-6 bg-primary border border-white rounded-sm cursor-w-resize" />
      <div data-handle="e" className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-6 bg-primary border border-white rounded-sm cursor-e-resize" />
    </>
  );

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-shadow select-none",
        isSelected && "ring-2 ring-primary ring-offset-1",
        isDragging && "shadow-lg"
      )}
      style={baseStyle}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}
      {resizeHandles}
    </div>
  );
};

export default DraggableElement;
