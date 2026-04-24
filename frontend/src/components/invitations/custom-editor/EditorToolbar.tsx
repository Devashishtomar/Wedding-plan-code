import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Type, 
  Image, 
  ArrowLeft, 
  Download, 
  Save, 
  Trash2
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
  onDownload: () => void;
  onBack: () => void;
  onDelete: () => void;
  hasSelectedElement: boolean;
  isSaving: boolean;
}

const EditorToolbar = ({
  onAddText,
  onAddImage,
  onSave,
  onDownload,
  onBack,
  onDelete,
  hasSelectedElement,
  isSaving,
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

      {/* Right side - Save & Download */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onDownload} className="h-7 px-2 text-xs">
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving} className="h-7 px-2 text-xs">
          <Save className="h-3 w-3 mr-1" />
          {isSaving ? "..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
