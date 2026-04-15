import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TemplateCard from "./TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type BackendTemplate = {
  id: string;
  name: string;
  category: string;
  preview: string;
};


interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}


const TemplateGallery = ({ onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<BackendTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["all", ...new Set(templates.map(t => t.category))];


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/api/invitations/templates");
        setTemplates(res.data.templates);
      } catch (e) {
        console.error("Failed to load templates", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);


  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => onSelectTemplate(template.id)}
            isSelected={selectedTemplateId === template.id}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No templates found matching your criteria.</p>
          <Button variant="link" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
