import { useState } from "react";
import { FieldStyle } from "@/types/invitation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Bold, Minus, Plus, Settings2 } from "lucide-react";

interface FieldStyleControlsProps {
  label: string;
  style: FieldStyle;
  onChange: (style: FieldStyle) => void;
  onUseEverywhere?: (fontFamily: string) => void;
  globalFontFamily?: string;

  // NEW (from backend / template)
  allowedFonts: { value: string; label: string }[];
  allowedColors: { value: string; label: string }[];
  constraints: {
    fontSize: { min: number; max: number };
    yOffset: { min: number; max: number };
    allowBold: boolean;
  };
}


const FieldStyleControls = ({
  label,
  style,
  onChange,
  onUseEverywhere,
  globalFontFamily,
  allowedFonts,
  allowedColors,
  constraints,
}: FieldStyleControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateStyle = (updates: Partial<FieldStyle>) => {
    onChange({ ...style, ...updates });
  };

  const adjustFontSize = (delta: number) => {
    const next = style.fontSize + delta;
    const clamped = Math.max(
      constraints.fontSize.min,
      Math.min(constraints.fontSize.max, next)
    );

    updateStyle({ fontSize: clamped });
  };

  const adjustVerticalOffset = (delta: number) => {
    const next = style.verticalOffset + delta;
    const clamped = Math.max(
      constraints.yOffset.min,
      Math.min(constraints.yOffset.max, next)
    );

    updateStyle({ verticalOffset: clamped });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-muted-foreground hover:text-foreground mt-1 h-7 px-2"
        >
          <span className="flex items-center gap-1.5 text-xs">
            <Settings2 className="h-3 w-3" />
            Style {label}
          </span>
          {isOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 pb-2 space-y-3 border-t mt-2">
        {/* Font Size */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Font Size</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => adjustFontSize(-1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center text-sm font-medium">
              {style.fontSize}px
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => adjustFontSize(1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Font Family</Label>
          <Select
            value={globalFontFamily || style.fontFamily}
            onValueChange={(value) => updateStyle({ fontFamily: value })}
            disabled={!!globalFontFamily}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedFonts.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onUseEverywhere && !globalFontFamily && style.fontFamily !== "inherit" && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-primary"
              onClick={() => onUseEverywhere(style.fontFamily)}
            >
              Use everywhere
            </Button>
          )}
          {globalFontFamily && (
            <p className="text-xs text-muted-foreground italic">
              Using global font
            </p>
          )}
        </div>

        {/* Text Color */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Text Color</Label>
          <div className="flex flex-wrap gap-1.5">
            {allowedColors.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full border-2 transition-all ${style.textColor === color.value
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-muted-foreground"
                  }`}
                style={{ backgroundColor: color.value }}
                onClick={() => updateStyle({ textColor: color.value })}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Bold Toggle */}
        {constraints.allowBold && (
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Bold Text</Label>
            <Button
              variant={style.isBold ? "default" : "outline"}
              size="icon"
              className="h-7 w-7"
              onClick={() => updateStyle({ isBold: !style.isBold })}
            >
              <Bold className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Vertical Spacing */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Vertical Position</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => adjustVerticalOffset(-5)}
              title="Move up"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center text-sm font-medium">
              {style.verticalOffset > 0 ? "+" : ""}
              {style.verticalOffset}px
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => adjustVerticalOffset(5)}
              title="Move down"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FieldStyleControls;
