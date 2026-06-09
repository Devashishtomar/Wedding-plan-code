import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Utensils, Home, Settings2, Trash2, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "@/styles/planner.css";
import { useEvent } from "@/contexts/EventContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Components
import SeatingPlanner from "@/components/planner/SeatingPlanner";
import RoomPlanner from "@/components/planner/RoomPlanner";

export type ArrangementType = 'SEATING' | 'ROOMS';

export interface Arrangement {
  id: string;
  name: string;
  type: ArrangementType;
  description: string;
  updatedAt: string;
  event?: { name: string } | null;
}

const Planner = () => {
  const queryClient = useQueryClient();
  const { selectedEventId, viewMode } = useEvent();
  const viewParam = viewMode === "collaborative" ? "SHARED" : "PRIVATE";

  const { data: arrangementsData, isLoading } = useQuery({
    queryKey: ['arrangements', selectedEventId, viewMode],
    queryFn: async () => {
      const res = await api.get(`/api/arrangements?view=${viewParam}&eventId=${selectedEventId}`);
      return res.data?.arrangements || [];
    },
    // Resource Guard: Hard-kill aggressive refetches on focus changes during layout dragging cycles
    refetchOnWindowFocus: false
  });

  // Dedicated mutation anchor to safely pass new layout payload blueprints down to the server engine
  const createArrangementMutation = useMutation({
    mutationFn: async (payload: { name: string; type: ArrangementType; description: string; eventId: string | null }) => {
      return await api.post(`/api/arrangements?view=${viewParam}`, payload);
    },
    onSuccess: () => {
      // Invalidate the reactive composite query key tree directly
      queryClient.invalidateQueries({ queryKey: ['arrangements', selectedEventId, viewMode] });
    }
  });

  // Dedicated mutation to hit backend deletion routes and clear stale cache rows snappy
  const deleteArrangementMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/api/arrangements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arrangements', selectedEventId, viewMode] });
    }
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newArrangement, setNewArrangement] = useState({ name: "", type: "SEATING" as ArrangementType, description: "" });
  const [activeArrangement, setActiveArrangement] = useState<Arrangement | null>(null);

  const handleCreate = () => {
    if (!newArrangement.name) return;

    // Connect form outputs to live network mutations with clean 3-Pillar validation columns
    createArrangementMutation.mutate({
      name: newArrangement.name,
      type: newArrangement.type,
      description: newArrangement.description,
      eventId: selectedEventId === "all" ? null : selectedEventId
    });

    setIsCreateOpen(false);
    setNewArrangement({ name: "", type: "SEATING", description: "" });
  };

  const getIcon = (type: ArrangementType) => {
    switch (type) {
      case "SEATING": return <Users className="h-5 w-5" />;
      case "ROOMS": return <Home className="h-5 w-5" />;
    }
  };

  if (activeArrangement) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
              {activeArrangement.type === 'SEATING' ? <Users className="h-5 w-5" /> : <Home className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{activeArrangement.name}</h2>
              <p className="text-xs md:text-sm text-muted-foreground">{activeArrangement.description}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setActiveArrangement(null)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            Close Planner
          </Button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50/50 p-4">
          <div className="min-w-[800px] h-full">
            {activeArrangement.type === 'SEATING' && <SeatingPlanner arrangementId={activeArrangement.id} />}
            {activeArrangement.type === 'ROOMS' && <RoomPlanner arrangementId={activeArrangement.id} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-container space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Wedding Planner
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Manage your seating arrangements, meals, and room assignments in one place.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto">
              <Plus className="mr-2 h-5 w-5" /> New Arrangement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass-card border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create Arrangement</DialogTitle>
              <CardDescription>Add a new planning module to your wedding.</CardDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g. Reception Seating" value={newArrangement.name} onChange={(e) => setNewArrangement({ ...newArrangement, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newArrangement.type} onValueChange={(v: ArrangementType) => setNewArrangement({ ...newArrangement, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEATING">Seating Planner</SelectItem>
                    <SelectItem value="ROOMS">Room Assigner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input id="desc" placeholder="Brief details..." value={newArrangement.description} onChange={(e) => setNewArrangement({ ...newArrangement, description: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full h-12 text-lg font-semibold">Create Arrangement</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full text-center py-20">Loading arrangements...</div>
        ) : arrangementsData?.map((arrangement) => (
          <ArrangementCard
            key={arrangement.id}
            arrangement={arrangement}
            showEventTag={selectedEventId === 'all'} // Injects true only when viewing the consolidated rollup dashboard view
            onDelete={() => deleteArrangementMutation.mutate(arrangement.id)}
            onOpen={() => setActiveArrangement(arrangement)}
          />
        ))}
      </div>
    </div>
  );
};

const ArrangementCard = ({ arrangement, showEventTag, onDelete, onOpen }: { arrangement: Arrangement; showEventTag: boolean; onDelete: () => void; onOpen: () => void }) => {

  // Convert raw ISO database strings into clean localized date blocks (e.g. May 21, 2026)
  const displayDate = useMemo(() => {
    if (!arrangement.updatedAt) return "Just now";
    try {
      const parsedDate = new Date(arrangement.updatedAt);
      if (isNaN(parsedDate.getTime())) return arrangement.updatedAt; // fallback safe check
      return parsedDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return "Recently";
    }
  }, [arrangement.updatedAt]);

  return (
    <Card className="glass-card overflow-hidden group">
      <div className={`h-2 w-full ${arrangement.type === 'SEATING' ? 'bg-blue-400' : 'bg-purple-400'}`} />
      <CardHeader className="relative">
        <div className="p-3 w-fit rounded-2xl bg-primary/5 text-primary mb-4">
          {arrangement.type === 'SEATING' ? <Users className="h-6 w-6" /> : <Home className="h-6 w-6" />}
        </div>
        <CardTitle className="text-2xl font-bold">{arrangement.name}</CardTitle>
        <CardDescription className="text-md">{arrangement.description}</CardDescription>
        <Badge className="arrangement-badge bg-white/50 text-foreground border-none">
          {arrangement.type}
        </Badge>
        {showEventTag && arrangement.event?.name && (
          <Badge variant="outline" className="w-fit mb-3 bg-zinc-50 border-zinc-200 text-zinc-600 font-semibold px-2.5 py-0.5 text-xs rounded-md shadow-sm">
            Event: {arrangement.event.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-muted-foreground italic">Updated {displayDate}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation(); // Stop click events from bleeding through onto the background modal boundaries
                if (window.confirm(`Are you absolutely sure you want to delete "${arrangement.name}"?`)) {
                  onDelete();
                }
              }}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button onClick={onOpen} className="rounded-full">
              <Maximize2 className="mr-2 h-4 w-4" /> Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Planner;
