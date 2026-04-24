import { useState } from "react";
import { 
  CustomInvitationData, 
  CanvasElement,
  TextElement,
  ShapeElement,
  ImageElement,
  availableFonts,
  availableShapes,
  availableBorders,
  BorderElement,
} from "@/types/customInvitation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Upload,
  Check,
  Layers,
  Shapes,
  Square,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LayerPanel from "./LayerPanel";

interface EditorSidebarProps {
  invitation: CustomInvitationData;
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateInvitation: (updates: Partial<CustomInvitationData>) => void;
  onAddShape: (shapeType: string) => void;
  onUploadImage: (file: File) => void;
  onSelectElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
  onDeleteElement: (id: string) => void;
  onUpdateBorder: (border: BorderElement | undefined) => void;
}

const canvasSizePresets = [
  { name: "Portrait", width: 400, height: 533 },
  { name: "Square", width: 450, height: 450 },
  { name: "Landscape", width: 533, height: 400 },
];

const EditorSidebar = ({
  invitation,
  selectedElement,
  onUpdateElement,
  onUpdateInvitation,
  onAddShape,
  onUploadImage,
  onSelectElement,
  onMoveLayer,
  onDeleteElement,
  onUpdateBorder,
}: EditorSidebarProps) => {
  const [activeTab, setActiveTab] = useState("layers");

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdateInvitation({ 
          backgroundImage: ev.target?.result as string,
          backgroundOpacity: 1,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectBorder = (borderId: string) => {
    if (borderId === "none") {
      onUpdateBorder(undefined);
    } else {
      onUpdateBorder({
        id: "border",
        type: "border",
        borderStyle: borderId,
        color: invitation.border?.color || "#1a1a1a",
        thickness: invitation.border?.thickness || 2,
        cornerStyle: invitation.border?.cornerStyle || "square",
      });
    }
  };

  // Text styling controls
  const renderTextControls = () => {
    if (!selectedElement || selectedElement.type !== "text") return null;
    const textEl = selectedElement as TextElement;

    return (
      <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
        <Label className="text-xs font-medium">Text Styling</Label>
        
        {/* Content */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Text</Label>
          <Input
            value={textEl.content}
            onChange={(e) => onUpdateElement(textEl.id, { content: e.target.value })}
            className="h-7 text-xs"
          />
        </div>

        {/* Font Family */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Font</Label>
          <Select
            value={textEl.style.fontFamily}
            onValueChange={(value) =>
              onUpdateElement(textEl.id, { style: { ...textEl.style, fontFamily: value } })
            }
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              {availableFonts.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-xs">
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size & Color */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <Input
              type="number"
              value={textEl.style.fontSize}
              onChange={(e) =>
                onUpdateElement(textEl.id, { style: { ...textEl.style, fontSize: Number(e.target.value) } })
              }
              className="h-7 text-xs"
              min={8}
              max={120}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex gap-1">
              <Input
                type="color"
                value={textEl.style.color}
                onChange={(e) =>
                  onUpdateElement(textEl.id, { style: { ...textEl.style, color: e.target.value } })
                }
                className="w-7 h-7 p-0.5 cursor-pointer"
              />
              <Input
                value={textEl.style.color}
                onChange={(e) =>
                  onUpdateElement(textEl.id, { style: { ...textEl.style, color: e.target.value } })
                }
                className="flex-1 h-7 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bold, Italic, Alignment */}
        <div className="flex gap-1">
          <Button
            variant={textEl.style.isBold ? "default" : "outline"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() =>
              onUpdateElement(textEl.id, { style: { ...textEl.style, isBold: !textEl.style.isBold } })
            }
          >
            <Bold className="h-3 w-3" />
          </Button>
          <Button
            variant={textEl.style.isItalic ? "default" : "outline"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() =>
              onUpdateElement(textEl.id, { style: { ...textEl.style, isItalic: !textEl.style.isItalic } })
            }
          >
            <Italic className="h-3 w-3" />
          </Button>
          <div className="w-px bg-border mx-1" />
          {(["left", "center", "right"] as const).map((align) => (
            <Button
              key={align}
              variant={textEl.style.textAlign === align ? "default" : "outline"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() =>
                onUpdateElement(textEl.id, { style: { ...textEl.style, textAlign: align } })
              }
            >
              {align === "left" && <AlignLeft className="h-3 w-3" />}
              {align === "center" && <AlignCenter className="h-3 w-3" />}
              {align === "right" && <AlignRight className="h-3 w-3" />}
            </Button>
          ))}
        </div>

        {/* Letter Spacing */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Letter Spacing: {textEl.style.letterSpacing}px</Label>
          <Slider
            value={[textEl.style.letterSpacing]}
            min={-2}
            max={10}
            step={0.5}
            onValueChange={([value]) =>
              onUpdateElement(textEl.id, { style: { ...textEl.style, letterSpacing: value } })
            }
          />
        </div>

        {/* Line Height */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Line Height: {textEl.style.lineHeight}</Label>
          <Slider
            value={[textEl.style.lineHeight]}
            min={0.8}
            max={3}
            step={0.1}
            onValueChange={([value]) =>
              onUpdateElement(textEl.id, { style: { ...textEl.style, lineHeight: value } })
            }
          />
        </div>
      </div>
    );
  };

  // Shape controls
  const renderShapeControls = () => {
    if (!selectedElement || selectedElement.type !== "shape") return null;
    const shapeEl = selectedElement as ShapeElement;

    return (
      <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
        <Label className="text-xs font-medium">Shape Properties</Label>
        
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Color</Label>
          <div className="flex gap-1">
            <Input
              type="color"
              value={shapeEl.color}
              onChange={(e) => onUpdateElement(shapeEl.id, { color: e.target.value })}
              className="w-7 h-7 p-0.5 cursor-pointer"
            />
            <Input
              value={shapeEl.color}
              onChange={(e) => onUpdateElement(shapeEl.id, { color: e.target.value })}
              className="flex-1 h-7 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Opacity: {Math.round(shapeEl.opacity * 100)}%</Label>
          <Slider
            value={[shapeEl.opacity]}
            min={0.1}
            max={1}
            step={0.05}
            onValueChange={([value]) => onUpdateElement(shapeEl.id, { opacity: value })}
          />
        </div>
      </div>
    );
  };

  // Image controls
  const renderImageControls = () => {
    if (!selectedElement || selectedElement.type !== "image") return null;
    const imgEl = selectedElement as ImageElement;

    return (
      <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
        <Label className="text-xs font-medium">Image Properties</Label>
        
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Opacity: {Math.round(imgEl.opacity * 100)}%</Label>
          <Slider
            value={[imgEl.opacity]}
            min={0.1}
            max={1}
            step={0.05}
            onValueChange={([value]) => onUpdateElement(imgEl.id, { opacity: value })}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 border-l bg-background flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 h-9 p-0.5 mx-1 mt-1" style={{ width: 'calc(100% - 8px)' }}>
          <TabsTrigger value="layers" className="text-xs px-1 h-7">
            <Layers className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="shapes" className="text-xs px-1 h-7">
            <Shapes className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="borders" className="text-xs px-1 h-7">
            <Square className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="canvas" className="text-xs px-1 h-7">
            <Palette className="h-3 w-3" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Layers Tab */}
            <TabsContent value="layers" className="mt-0 space-y-3">
              <Label className="text-xs font-medium">Layers</Label>
              <LayerPanel
                elements={invitation.elements}
                selectedElementId={selectedElement?.id || null}
                onSelectElement={onSelectElement}
                onMoveLayer={onMoveLayer}
                onDeleteElement={onDeleteElement}
              />

              {/* Selected element controls */}
              {selectedElement && (
                <div className="pt-2 border-t space-y-3">
                  <Label className="text-xs font-medium">Selected: {selectedElement.type}</Label>
                  {renderTextControls()}
                  {renderShapeControls()}
                  {renderImageControls()}
                </div>
              )}
            </TabsContent>

            {/* Shapes Tab */}
            <TabsContent value="shapes" className="mt-0 space-y-3">
              <Label className="text-xs font-medium">Add Shape</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {availableShapes.map((shape) => (
                  <Button
                    key={shape.id}
                    variant="outline"
                    className="h-12 flex flex-col gap-0.5 text-xs p-1"
                    onClick={() => onAddShape(shape.id)}
                  >
                    <span className="text-lg">{shape.icon}</span>
                    <span className="text-[10px] text-muted-foreground">{shape.name}</span>
                  </Button>
                ))}
              </div>

              {/* Upload Image */}
              <div className="pt-2 border-t">
                <Label className="text-xs font-medium">Add Image</Label>
                <label className="mt-2 flex items-center justify-center gap-1 p-2 border-2 border-dashed rounded cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUploadImage(file);
                    }}
                  />
                </label>
              </div>
            </TabsContent>

            {/* Borders Tab */}
            <TabsContent value="borders" className="mt-0 space-y-3">
              <Label className="text-xs font-medium">Border Style</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableBorders.map((border) => (
                  <Button
                    key={border.id}
                    variant="outline"
                    className={cn(
                      "h-9 justify-start gap-1 text-xs px-2",
                      (invitation.border?.borderStyle === border.id || (!invitation.border && border.id === "none")) && 
                        "ring-1 ring-primary bg-primary/5"
                    )}
                    onClick={() => handleSelectBorder(border.id)}
                  >
                    {(invitation.border?.borderStyle === border.id || (!invitation.border && border.id === "none")) && (
                      <Check className="h-3 w-3 text-primary shrink-0" />
                    )}
                    <span className="truncate">{border.name}</span>
                  </Button>
                ))}
              </div>

              {/* Border customization */}
              {invitation.border && invitation.border.borderStyle !== "none" && (
                <div className="pt-2 border-t space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Color</Label>
                    <div className="flex gap-1">
                      <Input
                        type="color"
                        value={invitation.border.color}
                        onChange={(e) =>
                          onUpdateBorder({ ...invitation.border!, color: e.target.value })
                        }
                        className="w-7 h-7 p-0.5 cursor-pointer"
                      />
                      <Input
                        value={invitation.border.color}
                        onChange={(e) =>
                          onUpdateBorder({ ...invitation.border!, color: e.target.value })
                        }
                        className="flex-1 h-7 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Thickness: {invitation.border.thickness}px</Label>
                    <Slider
                      value={[invitation.border.thickness]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([value]) =>
                        onUpdateBorder({ ...invitation.border!, thickness: value })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Corners</Label>
                    <div className="flex gap-1">
                      {(["square", "rounded", "ornate"] as const).map((style) => (
                        <Button
                          key={style}
                          variant={invitation.border!.cornerStyle === style ? "default" : "outline"}
                          size="sm"
                          className="flex-1 capitalize text-xs h-7"
                          onClick={() =>
                            onUpdateBorder({ ...invitation.border!, cornerStyle: style })
                          }
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Canvas Tab */}
            <TabsContent value="canvas" className="mt-0 space-y-3">
              <Label className="text-xs font-medium">Canvas Size</Label>
              <div className="grid grid-cols-3 gap-1">
                {canvasSizePresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={
                      invitation.canvasSize.width === preset.width &&
                      invitation.canvasSize.height === preset.height
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => onUpdateInvitation({ canvasSize: { width: preset.width, height: preset.height } })}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>

              {/* Background */}
              <div className="pt-2 border-t space-y-3">
                <Label className="text-xs font-medium">Background</Label>
                
                {/* Color */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Color</Label>
                  <div className="flex gap-1">
                    <Input
                      type="color"
                      value={invitation.backgroundColor}
                      onChange={(e) => onUpdateInvitation({ backgroundColor: e.target.value })}
                      className="w-7 h-7 p-0.5 cursor-pointer"
                    />
                    <Input
                      value={invitation.backgroundColor}
                      onChange={(e) => onUpdateInvitation({ backgroundColor: e.target.value })}
                      className="flex-1 h-7 text-xs"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Image</Label>
                  <label className="flex items-center justify-center gap-1 p-2 border-2 border-dashed rounded cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {invitation.backgroundImage ? "Change" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundUpload}
                    />
                  </label>
                </div>

                {/* Background Image Opacity */}
                {invitation.backgroundImage && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Opacity: {Math.round(invitation.backgroundOpacity * 100)}%
                      </Label>
                      <Slider
                        value={[invitation.backgroundOpacity]}
                        min={0.1}
                        max={1}
                        step={0.05}
                        onValueChange={([value]) => onUpdateInvitation({ backgroundOpacity: value })}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-7"
                      onClick={() => onUpdateInvitation({ backgroundImage: undefined })}
                    >
                      Remove Image
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default EditorSidebar;
