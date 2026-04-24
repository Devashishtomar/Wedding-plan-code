import { useState, useRef, useCallback, useEffect } from "react";
import { api } from "@/lib/api"; // 🟢 ADDED API IMPORT
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const [invitation, setInvitation] = useState<CustomInvitationData>(
    initialData || createDefaultCustomInvitation()
  );

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

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: invitation.backgroundColor,
      });

      const link = document.createElement("a");
      link.download = `custom-invitation-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Downloaded!",
        description: "Your invitation has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your invitation.",
        variant: "destructive",
      });
    }
  }, [invitation.backgroundColor, toast]);

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
        onDownload={handleDownload}
        onBack={onBack}
        onDelete={() => selectedElementId && deleteElement(selectedElementId)}
        hasSelectedElement={!!selectedElementId}
        isSaving={isSaving}
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
    </div>
  );
};

export default CustomEditorPage;