import { useState, useRef, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { useEvent } from "@/contexts/EventContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  CustomInvitationData,
  CanvasElement,
  TextElement,
  ImageElement,
  ShapeElement,
  BorderElement,
  createDefaultCustomInvitation,
  defaultTextStyle,
} from "@/types/customInvitation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import EditorToolbar from "./EditorToolbar";
import EditorCanvas from "./EditorCanvas";
import EditorSidebar from "./EditorSidebar";

interface CustomEditorPageProps {
  onBack: () => void;
  initialData?: CustomInvitationData;
  onCollapseSidebar?: () => void;
}

const CustomEditorPage = ({ onBack, initialData, onCollapseSidebar }: CustomEditorPageProps) => {
  const { toast } = useToast();
  const { selectedEventId, viewMode } = useEvent();
  const { role } = usePermissions();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("Analyzing your prompt context...");
  const [quota, setQuota] = useState({ used: 0, total: 2, remaining: 2 });

  const [invitation, setInvitation] = useState<CustomInvitationData>(
    initialData || createDefaultCustomInvitation()
  );

  // Fetch quota parameters whenever modal visibility shifts open
  const fetchQuotaDetails = useCallback(async () => {
    try {
      const response = await api.get('/api/ai/invitations/quota');
      if (response.data) {
        setQuota({
          used: response.data.used,
          total: response.data.total,
          remaining: response.data.remaining
        });
      }
    } catch (err) {
      console.error("Failed fetching account operational limits configuration variables:", err);
    }
  }, []);

  useEffect(() => {
    if (isAiModalOpen) {
      fetchQuotaDetails();
    }
  }, [isAiModalOpen, fetchQuotaDetails]);

  useEffect(() => {
    let internalInterval: ReturnType<typeof setInterval>;
    if (isGenerating) {
      const statusPhrases = [
        "Analyzing prompt metrics...",
        "Structuring proportional coordinate positions...",
        "Invoking custom gpt-image-1 canvas assets...",
        "Converting binary assets stream matrices...",
        "Finalizing canvas structure hydration maps..."
      ];
      let selectionIdx = 0;
      internalInterval = setInterval(() => {
        selectionIdx = (selectionIdx + 1) % statusPhrases.length;
        setLoadingStepText(statusPhrases[selectionIdx]);
      }, 2500);
    }
    return () => clearInterval(internalInterval);
  }, [isGenerating]);

  // Auto-collapse main sidebar when editor opens
  useEffect(() => {
    onCollapseSidebar?.();
  }, [onCollapseSidebar]);

  const selectedElement = invitation.elements.find((el) => el.id === selectedElementId) || null;

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setInvitation((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as CanvasElement : el
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateInvitation = useCallback((updates: Partial<CustomInvitationData>) => {
    setInvitation((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addTextElement = useCallback(() => {
    const newElement: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      content: "New Text",
      position: { x: 100, y: 200 },
      size: { width: 200, height: 40 },
      style: { ...defaultTextStyle },
      zIndex: invitation.elements.length + 1,
    };

    setInvitation((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedElementId(newElement.id);
  }, [invitation.elements.length]);

  const addImageElement = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const newElement: ImageElement = {
            id: crypto.randomUUID(),
            type: "image",
            src: ev.target?.result as string,
            position: { x: 100, y: 150 },
            size: { width: 150, height: 150 },
            opacity: 1,
            zIndex: invitation.elements.length + 1,
          };

          setInvitation((prev) => ({
            ...prev,
            elements: [...prev.elements, newElement],
            updatedAt: new Date().toISOString(),
          }));
          setSelectedElementId(newElement.id);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [invitation.elements.length]);

  const addShapeElement = useCallback((shapeType: string) => {
    const newElement: ShapeElement = {
      id: crypto.randomUUID(),
      type: "shape",
      shapeType: shapeType as ShapeElement["shapeType"],
      position: { x: 150, y: 200 },
      size: { width: 60, height: 60 },
      color: "#c77d8e",
      opacity: 1,
      zIndex: invitation.elements.length + 1,
    };

    setInvitation((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedElementId(newElement.id);
  }, [invitation.elements.length]);

  const updateBorder = useCallback((border: BorderElement | undefined) => {
    setInvitation((prev) => ({
      ...prev,
      border,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setInvitation((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const moveLayer = useCallback((id: string, direction: "up" | "down") => {
    setInvitation((prev) => {
      const elements = [...prev.elements];
      const sortedByZIndex = elements.sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sortedByZIndex.findIndex((el) => el.id === id);

      if (currentIndex === -1) return prev;

      const swapIndex = direction === "up" ? currentIndex + 1 : currentIndex - 1;
      if (swapIndex < 0 || swapIndex >= sortedByZIndex.length) return prev;

      // Swap z-indices
      const currentZ = sortedByZIndex[currentIndex].zIndex;
      const swapZ = sortedByZIndex[swapIndex].zIndex;

      return {
        ...prev,
        elements: prev.elements.map((el) => {
          if (el.id === id) return { ...el, zIndex: swapZ };
          if (el.id === sortedByZIndex[swapIndex].id) return { ...el, zIndex: currentZ };
          return el;
        }),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      const payload = {
        elements: invitation.elements,
        canvasSize: invitation.canvasSize,
        backgroundColor: invitation.backgroundColor,
        border: invitation.border
      };
      formData.append('canvasData', JSON.stringify(payload));

      // Append strict event and isolation data
      if (selectedEventId && selectedEventId !== 'all') {
        formData.append('eventId', selectedEventId);
      }

      const visibility = viewMode === 'individual'
        ? (role === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE')
        : 'SHARED';
      formData.append('visibility', visibility);

      if (initialData?.id) {
        formData.append('invitationId', initialData.id);
      }

      if (invitation.backgroundImage && invitation.backgroundImage.startsWith('data:image')) {
        const res = await fetch(invitation.backgroundImage);
        const blob = await res.blob();
        formData.append('background', blob, 'custom_bg.png');
      }

      // 3. Send to our new isolated backend route
      await api.post('/api/invitations/custom', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: "Saved Successfully!",
        description: "Your custom invitation is ready to be shared.",
      });

      // Optionally, return to the gallery/share view after saving
      setTimeout(() => onBack(), 1000);

    } catch (error) {
      console.error("Failed to save custom invitation", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [invitation, toast, onBack]);

  // ─── NETWORK TRANSACTION HANDLER SUBMITTING TO CLOUD COMPOSER ENGINE ───
  const handleAiTemplateGeneration = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Prompt Empty", description: "Please provide explicit design ideas before running execution frames.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      // Establish 3-Pillar Context alignments cleanly for endpoint parameter propagation
      const visibilityString = viewMode === 'individual'
        ? (role === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE')
        : 'SHARED';

      const apiPayload = {
        prompt: aiPrompt.trim(),
        visibility: visibilityString,
        eventId: selectedEventId === 'all' ? null : selectedEventId,
        eventType: "Wedding", // Defaults layout metrics configuration tags elegantly
        content: {}, // Can optionally absorb dynamic pre-filled text entries securely
        canvasSize: {
          width: invitation.canvasSize?.width || 800,
          height: invitation.canvasSize?.height || 1200
        }
      };

      const response = await api.post('/api/ai/invitations/generate', apiPayload);

      if (response.data?.success && response.data?.canvasData) {
        // Hydrate and overwrite local canvas elements memory seamlessly
        setInvitation(response.data.canvasData);
        setSelectedElementId(null); // Clear selected item boundaries to prevent index clipping
        setIsAiModalOpen(false);
        setAiPrompt("");

        toast({
          title: "Invite Generated Successfully!",
          description: "AI Generator complete. Every layer text and backdrop element remains fully editable.",
        });
      } else {
        throw new Error("Invalid structure map returned from target cloud engine pipelines.");
      }
    } catch (error: any) {
      console.error("AI Generation Network Exception:", error);
      toast({
        title: "Composition Generation Failed",
        description: error.response?.data?.message || "An error occurred connecting over remote generation links.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newElement: ImageElement = {
        id: crypto.randomUUID(),
        type: "image",
        src: ev.target?.result as string,
        position: { x: 100, y: 150 },
        size: { width: 150, height: 150 },
        opacity: 1,
        zIndex: invitation.elements.length + 1,
      };

      setInvitation((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
        updatedAt: new Date().toISOString(),
      }));
      setSelectedElementId(newElement.id);
    };
    reader.readAsDataURL(file);
  }, [invitation.elements.length]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorToolbar
        onAddText={addTextElement}
        onAddImage={addImageElement}
        onSave={handleSave}
        onBack={onBack}
        onDelete={() => selectedElementId && deleteElement(selectedElementId)}
        hasSelectedElement={!!selectedElementId}
        isSaving={isSaving}
        onAiGenerate={() => setIsAiModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorCanvas
          invitation={invitation}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={updateElement}
          canvasRef={canvasRef}
        />

        <EditorSidebar
          invitation={invitation}
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
          onUpdateInvitation={updateInvitation}
          onAddShape={addShapeElement}
          onUploadImage={handleUploadImage}
          onSelectElement={setSelectedElementId}
          onMoveLayer={moveLayer}
          onDeleteElement={deleteElement}
          onUpdateBorder={updateBorder}
        />
      </div>
      {/* ─── MODAL PANEL RECEIVING TEXT DESIGN INSTRUCTIONS PROMPTS ─── */}
      <Dialog open={isAiModalOpen} onOpenChange={(open) => !isGenerating && setIsAiModalOpen(open)}>
        <DialogContent className="rounded-3xl max-w-md p-6 bg-card border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary fill-current" />
              Generate Design with AI
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground mt-1 leading-normal">
              Type your design ideas below. The AI pipeline will construct structured editable text blocks, borders, and matching graphic backdrop assets.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 relative">
            {/* ─── QUOTA VOLUME DISPLAY SEGMENT AREA ─── */}
            <div className="bg-muted/40 border border-border/60 p-3 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center text-muted-foreground gap-1.5">
                  Usage Limits Quota
                  <span className="cursor-help text-[10px] bg-muted px-1.5 py-0.5 rounded-md border text-foreground" title="Limit is 2 generations per 5 hours standard rolling window interval bounds.">i</span>
                </span>
                <span className={quota.remaining === 0 ? "text-destructive" : "text-primary"}>
                  {quota.remaining} / {quota.total} Available
                </span>
              </div>

              {/* Proportional graphical progress tracking bar width calculations */}
              <div className="w-full bg-muted border border-border/30 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${quota.remaining === 0 ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${(quota.remaining / quota.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prompt" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Design Concept Prompt</Label>
              <Textarea
                id="prompt"
                disabled={isGenerating || quota.remaining === 0}
                placeholder={quota.remaining === 0 ? "Generation threshold reached. Please check back in a few hours." : "e.g., Royal luxury theme wedding card with deep maroon canvas backdrop and fine ornate gold leaf border accents..."}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[100px] bg-background/50 rounded-xl resize-none text-sm font-medium focus-visible:ring-primary/20 border-border"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4 mt-2">
            <Button
              variant="outline"
              disabled={isGenerating}
              onClick={() => setIsAiModalOpen(false)}
              className="rounded-xl font-bold px-4 h-9"
            >
              Cancel
            </Button>
            <Button
              disabled={isGenerating || quota.remaining === 0}
              onClick={async () => {
                await handleAiTemplateGeneration();
                fetchQuotaDetails(); // Refresh remaining counter parameters following execution loop completions
              }}
              className="rounded-xl font-bold px-4 h-9 bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="animate-fade-in text-xs font-medium tracking-tight text-white/90">
                  {loadingStepText}
                </span>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 shrink-0 fill-current" />
                  Generate Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomEditorPage;