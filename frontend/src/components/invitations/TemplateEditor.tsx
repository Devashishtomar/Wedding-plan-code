import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { InvitationTemplate, InvitationData, FieldStyles, FieldName, createDefaultStyles } from "@/types/invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Save, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FieldStyleControls from "./FieldStyleControls";

type InvitationFormData = {
  title: string;
  names: string;
  message: string;
  date: string;
  time: string;
  venue: string;
  rsvpDate: string;
  styles: FieldStyles;
};


interface TemplateEditorProps {
  template: {
    id: string;
    name: string;
    category: string;
    canvas: {
      width: number;
      height: number;
    };
    backgroundUrl: string;
    textFields: Array<{
      key: FieldName;
      default: {
        x: number;
        y: number;
        fontFamily: string;
        fontSize: number;
        color: string;
        bold?: boolean;
        align: "left" | "center" | "right";
        maxWidth?: number;
      };
      constraints: {
        fontSize: { min: number; max: number };
        yOffset: { min: number; max: number };
        allowBold: boolean;
      };
    }>;
  };
  onBack: () => void;
  onSave: (data: {
    templateId: string;
    content: {
      title: string;
      names: string;
      message: string;
      date: string;
      time: string;
      venue: string;
      rsvpDate: string;
    };
    styles: FieldStyles;
    globalFontFamily?: string;
  }) => Promise<void>;

  initialData?: {
    id: string;
    templateId: string;
    content: {
      title: string | null;
      names: string | null;
      message: string | null;
      date: string | null;
      time: string | null;
      venue: string | null;
      rsvpDate: string | null;
    };
    styles: FieldStyles;
    globalFontFamily?: string;
  };
}

const TemplateEditor = ({ template, onBack, onSave, initialData }: TemplateEditorProps) => {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [allowedFonts, setAllowedFonts] = useState<
    { value: string; label: string }[]
  >([]);

  const [allowedColors, setAllowedColors] = useState<
    { value: string; label: string }[]
  >([]);
  const PREVIEW_MAX_WIDTH = 420;
  const previewScale = PREVIEW_MAX_WIDTH / template.canvas.width;

  const [formData, setFormData] = useState<InvitationFormData>(
    initialData
      ? {
        title: initialData.content.title ?? "",
        names: initialData.content.names ?? "",
        message: initialData.content.message ?? "",
        date: initialData.content.date ?? "",
        time: initialData.content.time ?? "",
        venue: initialData.content.venue ?? "",
        rsvpDate: initialData.content.rsvpDate ?? "",
        styles: initialData.styles || createDefaultStyles(),
      }
      : {
        title: "You're Invited to the Wedding of",
        names: "John & Jane",
        message: "We joyfully invite you to celebrate our wedding day with us.",
        date: "",
        time: "",
        venue: "",
        rsvpDate: "",
        styles: createDefaultStyles(),
      }
  );


  useEffect(() => {
    const fetchDesignOptions = async () => {
      try {
        const res = await api.get("/api/invitations/design-options");
        setAllowedFonts(res.data.fonts);
        setAllowedColors(res.data.colors);
      } catch (err) {
        toast({
          title: "Failed to load design options",
          description: "Fonts and colors could not be loaded.",
          variant: "destructive",
        });
      }
    };

    fetchDesignOptions();
  }, []);

  const getFieldConstraints = (fieldName: FieldName) => {
    return template.textFields.find((f) => f.key === fieldName)!.constraints;
  };

  const [globalFontFamily, setGlobalFontFamily] = useState<string | undefined>(
    initialData?.globalFontFamily
  );

  const handleChange = (field: keyof InvitationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (fieldName: FieldName, style: typeof formData.styles extends undefined ? never : typeof formData.styles[FieldName]) => {
    setFormData((prev) => ({
      ...prev,
      styles: {
        ...(prev.styles || createDefaultStyles()),
        [fieldName]: style,
      },
    }));
  };

  const handleUseEverywhere = (fontFamily: string) => {
    setGlobalFontFamily(fontFamily);
    setFormData((prev) => ({
      ...prev,
      globalFontFamily: fontFamily,
    }));
    toast({
      title: "Font Applied Everywhere",
      description: `"${fontFamily.split("'")[1] || fontFamily}" will be used for all text.`,
    });
  };

  const clearGlobalFont = () => {
    setGlobalFontFamily(undefined);
    setFormData((prev) => ({
      ...prev,
      globalFontFamily: undefined,
    }));
  };

  const getFieldStyle = (fieldName: FieldName) => {
    return formData.styles?.[fieldName] || createDefaultStyles()[fieldName];
  };

  const handleSave = () => {
    setIsSaving(true);

    onSave({
      templateId: template.id,
      content: {
        title: formData.title,
        names: formData.names,
        message: formData.message,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        rsvpDate: formData.rsvpDate,
      },
      styles: formData.styles,
      globalFontFamily,
    });

    toast({
      title: "Invitation Saved",
      description: "Your changes have been saved.",
    });

    setTimeout(() => setIsSaving(false), 800);
  };

  const handleDownload = () => {
    if (!initialData?.id) return;

    toast({
      title: "Preparing download",
      description: "Your invitation is being generated.",
    });

    window.open(
      `${import.meta.env.VITE_API_URL}/api/invitations/${initialData.id}/render?download=1`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Font Notice */}
      {globalFontFamily && (
        <div className="flex items-center justify-between bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm">
          <span>
            Global font: <strong>{globalFontFamily.split("'")[1] || globalFontFamily}</strong>
          </span>
          <Button variant="ghost" size="sm" onClick={clearGlobalFont} className="h-6 px-2">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <Card className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Edit Your Invitation</h2>

          {/* Title Field */}
          <div className="space-y-2 border-b pb-4">
            <Label htmlFor="title">Invitation Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="You're Invited to the Wedding of"
            />
            <FieldStyleControls
              label="Title"
              style={getFieldStyle("title")}
              onChange={(style) => handleStyleChange("title", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          {/* Names Field */}
          <div className="space-y-2 border-b pb-4">
            <Label htmlFor="names">Couple&apos;s Names</Label>
            <Input
              id="names"
              value={formData.names}
              onChange={(e) => handleChange("names", e.target.value)}
              placeholder="John & Jane"
            />
            <FieldStyleControls
              label="Names"
              style={getFieldStyle("names")}
              onChange={(style) => handleStyleChange("names", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2 border-b pb-4">
            <Label htmlFor="message">Invitation Message</Label>
            <Input
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Your invitation message"
            />
            <FieldStyleControls
              label="Message"
              style={getFieldStyle("message")}
              onChange={(style) => handleStyleChange("message", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          {/* Date Field */}
          <div className="space-y-2 border-b pb-4">
            <Label htmlFor="date">Wedding Date</Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              placeholder="September 15, 2025"
            />
            <FieldStyleControls
              label="Date"
              style={getFieldStyle("date")}
              onChange={(style) => handleStyleChange("date", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          {/* Time Field */}
          <div className="space-y-2 border-b pb-4">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              placeholder="4:00 PM"
            />
            <FieldStyleControls
              label="Time"
              style={getFieldStyle("time")}
              onChange={(style) => handleStyleChange("time", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          {/* Venue Field */}
          <div className="space-y-2 border-b pb-4">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => handleChange("venue", e.target.value)}
              placeholder="The Grand Estate, 123 Wedding Lane"
            />
            <FieldStyleControls
              label="Venue"
              style={getFieldStyle("venue")}
              onChange={(style) => handleStyleChange("venue", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          {/* RSVP Date Field */}
          <div className="space-y-2 pb-2">
            <Label htmlFor="rsvpDate">RSVP By</Label>
            <Input
              id="rsvpDate"
              value={formData.rsvpDate}
              onChange={(e) => handleChange("rsvpDate", e.target.value)}
              placeholder="August 15, 2025"
            />
            <FieldStyleControls
              label="RSVP Date"
              style={getFieldStyle("rsvpDate")}
              onChange={(style) => handleStyleChange("rsvpDate", style)}
              onUseEverywhere={handleUseEverywhere}
              globalFontFamily={globalFontFamily}
              allowedFonts={allowedFonts}
              allowedColors={allowedColors}
              constraints={getFieldConstraints("title")}
            />
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            Template: <span className="font-medium">{template.name}</span> ({template.category})
          </p>
        </Card>

        {/* Live Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Live Preview</h2>

          {/* Preview Bounding Box */}
          <div
            className="w-full flex justify-center"
            style={{
              maxWidth: PREVIEW_MAX_WIDTH,
              margin: "0 auto",
            }}
          >
            {/* Scaled Canvas Wrapper */}
            <div
              style={{
                width: template.canvas.width,
                height: template.canvas.height,
                transform: `scale(${previewScale})`,
                transformOrigin: "top center",
              }}
            >
              {/* Actual Canvas (REAL SIZE) */}
              <div
                ref={previewRef}
                style={{
                  position: "relative",
                  width: template.canvas.width,
                  height: template.canvas.height,
                  backgroundImage: `url(${import.meta.env.VITE_API_URL}${template.backgroundUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                {template.textFields.map((field) => {
                  const style = getFieldStyle(field.key);

                  const fontFamily =
                    globalFontFamily ||
                    (style.fontFamily !== "inherit"
                      ? style.fontFamily
                      : field.default.fontFamily);

                  return (
                    <div
                      key={field.key}
                      style={{
                        position: "absolute",
                        left: field.default.x,
                        top: field.default.y + (style.verticalOffset || 0),
                        fontFamily,
                        fontSize: `${style.fontSize}px`,
                        color: style.textColor || field.default.color,
                        fontWeight: style.isBold ? 700 : 400,
                        textAlign: field.default.align,
                        maxWidth: field.default.maxWidth,
                        transform:
                          field.default.align === "center"
                            ? "translateX(-50%)"
                            : field.default.align === "right"
                              ? "translateX(-100%)"
                              : "none",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {formData[field.key] ?? ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
