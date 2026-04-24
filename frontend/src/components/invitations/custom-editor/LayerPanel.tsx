import { CanvasElement } from "@/types/customInvitation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Type, Image, Shapes, ChevronUp, ChevronDown, Trash2, Eye, EyeOff } from "lucide-react";

interface LayerPanelProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
  onDeleteElement: (id: string) => void;
}

const LayerPanel = ({
  elements,
  selectedElementId,
  onSelectElement,
  onMoveLayer,
  onDeleteElement,
}: LayerPanelProps) => {
  // Sort by zIndex descending (top layer first)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-3 w-3" />;
      case "image":
        return <Image className="h-3 w-3" />;
      case "shape":
        return <Shapes className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getLabel = (element: CanvasElement) => {
    switch (element.type) {
      case "text":
        return element.content.slice(0, 20) + (element.content.length > 20 ? "..." : "");
      case "image":
        return "Image";
      case "shape":
        return element.shapeType.charAt(0).toUpperCase() + element.shapeType.slice(1);
      default:
        return "Element";
    }
  };

  if (elements.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-xs">
        No elements yet. Add text, images, or shapes.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {sortedElements.map((element, index) => {
        const isSelected = selectedElementId === element.id;
        const isFirst = index === 0;
        const isLast = index === sortedElements.length - 1;

        return (
          <div
            key={element.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors text-xs",
              isSelected && "bg-accent ring-1 ring-primary"
            )}
            onClick={() => onSelectElement(element.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-muted-foreground shrink-0">{getIcon(element.type)}</span>
              <span className="truncate text-xs">{getLabel(element)}</span>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={isFirst}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayer(element.id, "up");
                }}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={isLast}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayer(element.id, "down");
                }}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteElement(element.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LayerPanel;
