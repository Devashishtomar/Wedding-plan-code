import { Card } from "@/components/ui/card";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    category: string;
    preview: string;
  };
  onSelect: () => void;
  isSelected?: boolean;
}


const TemplateCard = ({ template, onSelect, isSelected }: TemplateCardProps) => {
  return (
    <Card
      onClick={onSelect}
      className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}${template.preview}`}
          alt={template.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Hover Overlay with Description */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-semibold text-sm mb-1">{template.name}</h3>
        {/* <p className="text-gray-300 text-xs leading-relaxed">{template.description}</p> */}
        <span className="mt-2 inline-block text-xs text-primary font-medium">
          Click to select →
        </span>
      </div>

      {/* Template Name Badge */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
        {template.name}
      </div>

      {/* Category Badge */}
      <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs capitalize">
        {template.category}
      </div>
    </Card>
  );
};

export default TemplateCard;
