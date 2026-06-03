import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Type,
  Image,
  ArrowLeft,
  Download,
  Save,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onSave: () => void;
  onBack: () => void;
  onDelete: () => void;
  hasSelectedElement: boolean;
  isSaving: boolean;
  onAiGenerate: () => void;
}

const EditorToolbar = ({
  onAddText,
  onAddImage,
  onSave,
  onBack,
  onDelete,
  hasSelectedElement,
  isSaving,
  onAiGenerate,
}: EditorToolbarProps) => {
  return (
    <div className="h-10 border-b bg-background flex items-center justify-between px-3">
      {/* Left side - Back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 px-2 text-xs">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-xs font-medium text-muted-foreground">Custom Editor</span>

        <Separator orientation="vertical" className="h-5" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAiGenerate}
              className="h-7 px-2 text-xs font-bold text-primary hover:text-primary bg-primary/5 hover:bg-primary/10 rounded-md border border-primary/10 transition-all"
            >
              <Sparkles className="h-3 w-3 mr-1 fill-current" />
              Generate with AI
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate an interactive layout canvas with AI</TooltipContent>
        </Tooltip>
      </div>

      {/* Center - Quick add elements */}
      <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAddText} className="h-7 px-2 text-xs">
              <Type className="h-3 w-3 mr-1" />
              Text
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add text element</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAddImage} className="h-7 px-2 text-xs">
              <Image className="h-3 w-3 mr-1" />
              Image
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add image</TooltipContent>
        </Tooltip>

        {hasSelectedElement && (
          <>
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onDelete} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete selected</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* Right side - Save  */}
      <div className="flex items-center gap-1">
        <Button size="sm" onClick={onSave} disabled={isSaving} className="h-7 px-2 text-xs">
          <Save className="h-3 w-3 mr-1" />
          {isSaving ? "..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
