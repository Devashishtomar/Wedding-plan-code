import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Circle, Square, Trash2, GripVertical, X, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvent } from "@/contexts/EventContext";
import { usePermissions } from "@/hooks/usePermissions";

interface Guest {
  id: string;
  name: string;
  mealPreference?: 'BEEF' | 'CHICKEN' | 'FISH' | 'VEGETARIAN' | 'VEGAN';
}

interface Table {
  id: string;
  name: string;
  type: 'CIRCULAR' | 'RECTANGULAR';
  capacity: number;
  assignments: Record<number, Guest>;
  category?: string;
}

type EventType = 'LUNCH' | 'DINNER' | 'SNACKS';

interface SeatingPlannerProps {
  arrangementId: string;
}

const SeatingPlanner: React.FC<SeatingPlannerProps> = ({ arrangementId }) => {
  const queryClient = useQueryClient();
  const { selectedEventId, viewMode } = useEvent();
  const { canManageEvents } = usePermissions();
  const viewParam = viewMode === "collaborative" ? "SHARED" : "PRIVATE";

  // State configurations
  const [globalTableShape, setGlobalTableShape] = useState<'CIRCULAR' | 'RECTANGULAR'>('CIRCULAR');
  const [newGuestName, setNewGuestName] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");

  // 1. Fetch Hydrated Layout Configuration including database-persisted arrangement guests
  const { data: arrangement } = useQuery<any>({
    queryKey: ['arrangement-detail', arrangementId],
    queryFn: async () => {
      const res = await api.get(`/api/arrangements/${arrangementId}`);
      return res.data?.arrangement;
    }
  });

  // 2. Stream confirmed guests corresponding to active context parameters
  const { data: confirmedGuests = [] } = useQuery<Guest[]>({
    queryKey: ['confirmed-guests-sidebar', selectedEventId, viewMode],
    queryFn: async () => {
      const res = await api.get(`/api/arrangements/guests/confirmed?view=${viewParam}&eventId=${selectedEventId}`);
      return res.data?.guests || [];
    }
  });

  // 3. Instant Persistence Mutation: Saves companions directly to arrangement data layers immediately
  const addCompanionMutation = useMutation({
    mutationFn: async (companionName: string) => {
      return await api.post(`/api/arrangements/${arrangementId}/companions`, { name: companionName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arrangement-detail', arrangementId] });
    }
  });

  const deleteCompanionMutation = useMutation({
    mutationFn: async (companionId: string) => {
      return await api.delete(`/api/arrangements/companions/${companionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arrangement-detail', arrangementId] });
    }
  });

  const addTableMutation = useMutation({
    mutationFn: async (tablePayload: { name: string; shape: string; capacity: number; category?: string }) => {
      return await api.post(`/api/arrangements/${arrangementId}/tables`, tablePayload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrangement-detail', arrangementId] })
  });

  // Fixed Mutation: Sends a single robust allocation transaction matrix block down to your server handlers
  const saveTableMutation = useMutation({
    mutationFn: async ({ tableId, name, category, capacity, assignments }: { tableId: string; name: string; category: string; capacity: number; assignments: Record<number, any> }) => {
      await api.put(`/api/arrangements/tables/${tableId}`, { name, category, capacity });

      // Map dictionary to clean, array sequences of explicit seat occupancy properties
      const seatAssignments = Object.keys(assignments).map(seatIdx => ({
        seatIndex: Number(seatIdx),
        guestId: assignments[Number(seatIdx)].isCompanion ? null : assignments[Number(seatIdx)].id,
        arrangementGuestId: assignments[Number(seatIdx)].isCompanion ? assignments[Number(seatIdx)].id : null
      }));

      await api.put(`/api/arrangements/tables/${tableId}/seats/batch`, { seats: seatAssignments });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrangement-detail', arrangementId] })
  });

  const normalizedTables = useMemo(() => {
    const fetchedTables = arrangement?.tables || [];
    return fetchedTables.map((t: any) => {
      const assignmentsRecord: Record<number, any> = {};
      if (t.assignments) {
        t.assignments.forEach((asm: any) => {
          const seatTarget = asm.guest || asm.arrangementGuest;
          if (seatTarget) {
            assignmentsRecord[asm.seatIndex] = {
              id: seatTarget.id,
              name: seatTarget.name,
              mealPreference: seatTarget.mealPreference,
              isCompanion: !!asm.arrangementGuestId // correctly tracks foreign parameters flags
            };
          }
        });
      }
      return {
        id: t.id,
        name: t.name,
        type: t.shape === 'RECTANGULAR' ? 'RECTANGULAR' : 'CIRCULAR',
        capacity: t.capacity,
        category: t.category || "",
        assignments: assignmentsRecord
      } as Table;
    });
  }, [arrangement?.tables]);

  // Aggregate standard confirmed list records with persisted layout-isolated companion rows safely
  const allAvailableGuests = useMemo(() => {
    const persistedCompanions = (arrangement?.localGuests || []).map((g: any) => ({
      id: g.id,
      name: g.name,
      isCompanion: true
    }));
    return [...confirmedGuests, ...persistedCompanions];
  }, [confirmedGuests, arrangement?.localGuests]);

  const totalAssignedCount = useMemo(() => {
    return normalizedTables.reduce((acc, t) => acc + Object.keys(t.assignments).length, 0);
  }, [normalizedTables]);

  const totalCapacityCount = useMemo(() => {
    return normalizedTables.reduce((acc, t) => acc + t.capacity, 0);
  }, [normalizedTables]);

  // Single truth definition workspace memory state hook
  const [workspaceTables, setWorkspaceTables] = useState<Table[]>([]);

  useEffect(() => {
    if (normalizedTables && normalizedTables.length > 0) {
      setWorkspaceTables(normalizedTables);
    } else {
      setWorkspaceTables([]);
    }
  }, [normalizedTables]);

  // Calculate unassigned remaining pool using live workspace properties to hide guests instantly
  const assignedGuestIds = useMemo(() => {
    const ids = new Set<string>();
    workspaceTables.forEach((table) => {
      Object.values(table.assignments).forEach((guest: any) => {
        if (guest?.id) ids.add(guest.id);
      });
    });
    return ids;
  }, [workspaceTables]);

  const filteredUnassignedGuests = useMemo(() => {
    return allAvailableGuests.filter((g) => {
      if (assignedGuestIds.has(g.id)) return false;
      return g.name.toLowerCase().includes(sidebarSearch.toLowerCase());
    });
  }, [allAvailableGuests, assignedGuestIds, sidebarSearch]);

  const getAutoCategory = (index: number) => {
    if (index === 0) return "Close Family";
    if (index === 1) return "Friends";
    if (index === 2) return "Extended Family";
    return "Guests";
  };

  const addTable = () => {
    addTableMutation.mutate({
      name: `Table ${workspaceTables.length + 1}`,
      shape: globalTableShape,
      capacity: 8,
      category: getAutoCategory(workspaceTables.length)
    });
  };

  const deleteTable = (id: string) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      api.delete(`/api/arrangements/tables/${id}`).then(() => {
        queryClient.invalidateQueries({ queryKey: ['arrangement-detail', arrangementId] });
      });
    }
  };

  const handleAddLocalCompanion = () => {
    if (!newGuestName.trim()) return;

    // Fire the server mutation to save the companion to the database instantly
    addCompanionMutation.mutate(newGuestName.trim());
    setNewGuestName("");
  };

  const handleRemoveLocalCompanion = (id: string) => {
    // Fire the server mutation to delete the companion from the database instantly
    deleteCompanionMutation.mutate(id);
  };

  return (
    <div className="flex flex-col h-full gap-8" >
      <div className="flex h-full gap-8">
        <Card className="w-80 flex flex-col border-none shadow-xl bg-white/50 backdrop-blur-sm shrink-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Guest List
            </CardTitle>
            <div className="text-sm text-muted-foreground">{filteredUnassignedGuests.length} unassigned</div>

            <div className="mt-2">
              <Input
                placeholder="Search confirmed names..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="h-9 rounded-md bg-white/60 text-xs"
              />
            </div>

            <div className="flex gap-2 mt-3 border-t pt-3">
              <Input
                placeholder="Add companion/extra..."
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && newGuestName.trim() && (addCompanionMutation.mutate(newGuestName), setNewGuestName(""))}
                className="h-9 text-xs"
                disabled={!canManageEvents || addCompanionMutation.isPending}
              />
              <Button onClick={() => { if (newGuestName.trim()) { addCompanionMutation.mutate(newGuestName); setNewGuestName(""); } }} size="icon" className="h-9 w-9 shrink-0" disabled={!canManageEvents || addCompanionMutation.isPending}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-[500px] px-6">
              <div className="space-y-2 pb-6">
                {filteredUnassignedGuests.map((guest: any) => (
                  <div
                    key={guest.id}
                    draggable={canManageEvents}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("guestId", guest.id);
                      if (guest.isCompanion) e.dataTransfer.setData("isCompanion", "true");
                    }}
                    className="guest-item group flex items-center p-2 rounded-lg hover:bg-white/60 transition-colors border border-transparent hover:border-white/40 cursor-grab active:cursor-grabbing shadow-sm bg-white/40"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground/30 mr-2" />
                    <span className="flex-1 font-medium text-sm">{guest.name}</span>
                    {guest.isCompanion && (
                      <Button variant="ghost" size="icon" onClick={() => deleteCompanionMutation.mutate(guest.id)} className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div id="seating-planner-canvas" className="flex-1 space-y-8 pb-20 overflow-y-auto">
          <div className="w-full flex justify-center mb-10">
            <div className="w-[500px] h-12 bg-white/40 border-2 border-primary/20 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-primary/20"></div>
              <div className="flex items-center gap-3 text-primary/80 font-bold uppercase tracking-[0.4em] text-[12px]">
                <Heart className="h-4 w-4 fill-primary/30" />
                Wedding Stage
                <Heart className="h-4 w-4 fill-primary/30" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                <div className="flex bg-white/50 p-1 rounded-lg border shadow-inner">
                  <Button
                    onClick={() => setGlobalTableShape('CIRCULAR')}
                    variant={globalTableShape === 'CIRCULAR' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-md h-8"
                  >
                    <Circle className="mr-2 h-4 w-4" /> Round
                  </Button>
                  <Button
                    onClick={() => setGlobalTableShape('RECTANGULAR')}
                    variant={globalTableShape === 'RECTANGULAR' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-md h-8"
                  >
                    <Square className="mr-2 h-4 w-4" /> Rectangle
                  </Button>
                </div>
                {canManageEvents && (
                  <Button onClick={addTable} variant="outline" className="rounded-lg bg-white border-primary/20">
                    <Plus className="mr-2 h-4 w-4 text-primary" /> Add Table
                  </Button>
                )}
              </div>
            </div>

            <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">Total Guests Assigned</span>
              <span className="text-xl font-black text-primary">
                {totalAssignedCount} <span className="text-sm font-medium text-primary/60">/ {totalCapacityCount}</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {workspaceTables.map((table, index) => (
              <TableComponent
                key={table.id}
                table={table}
                index={index}
                onSave={(tId, payload) => saveTableMutation.mutateAsync({ tableId: tId, ...payload })}
                onDelete={() => deleteTable(table.id)}
                availableGuests={allAvailableGuests}
                canEdit={canManageEvents}
                onWorkspaceChange={(updatedTable: Table) => {
                  setWorkspaceTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};

const TableComponent = ({ table, index, onSave, onDelete, availableGuests, canEdit, onWorkspaceChange }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const seats = Array.from({ length: table.capacity });

  const handleDropLocal = (seatIdx: number, guestId: string, dragEvent?: any) => {
    if (!isEditing || !canEdit) return;
    const guest = availableGuests.find((g: any) => g.id === guestId);
    const dropCompanionFlag = dragEvent?.dataTransfer?.getData("isCompanion") === "true";

    if (guest) {
      const newAssignments = {
        ...table.assignments,
        [seatIdx]: { ...guest, isCompanion: dropCompanionFlag || (guest as any).isCompanion }
      };
      onWorkspaceChange({ ...table, assignments: newAssignments });
    }
  };

  const handleAssignLocal = (seatIdx: number, guest: any) => {
    if (!isEditing || !canEdit) return;
    const newAssignments = { ...table.assignments, [seatIdx]: guest };
    onWorkspaceChange({ ...table, assignments: newAssignments });
  };

  const handleRemoveLocal = (seatIdx: number) => {
    if (!isEditing || !canEdit) return;
    const newAssignments = { ...table.assignments };
    delete newAssignments[seatIdx];
    onWorkspaceChange({ ...table, assignments: newAssignments });
  };

  const commitSavedTable = () => {
    onSave(table.id, {
      name: table.name,
      category: table.category,
      capacity: Number(table.capacity),
      assignments: table.assignments
    });
    setIsEditing(false);
  };

  const categoryColor = useMemo(() => {
    switch (table.category) {
      case "Close Family": return "bg-pink-100 text-pink-700 border-pink-200";
      case "Friends": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Extended Family": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }, [table.category]);

  return (
    <Card className="glass-card border-none overflow-hidden hover:shadow-2xl transition-all duration-500 relative pt-2 group/card">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {canEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => isEditing ? commitSavedTable() : setIsEditing(true)}
            className="h-7 text-xs font-semibold px-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md"
          >
            {isEditing ? "Save Table" : "Edit Seating"}
          </Button>
        )}
        {canEdit && (
          <Button
            variant="secondary"
            size="icon"
            onClick={onDelete}
            className="rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white h-7 w-7 border border-destructive/20 opacity-0 group-hover/card:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pr-32">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="flex flex-col gap-1.5 mt-1">
                <Input
                  value={table.name}
                  onChange={(e) => onWorkspaceChange({ ...table, name: e.target.value })}
                  className="h-7 min-w-[150px] text-sm bg-white border px-1"
                />
                <Input
                  value={table.category}
                  placeholder="Table category..."
                  onChange={(e) => onWorkspaceChange({ ...table, category: e.target.value })}
                  className="h-6 text-xs bg-white border px-1"
                />
              </div>
            ) : (
              <>
                <CardTitle className="text-xl font-bold">{table.name}</CardTitle>
                <span className={`h-5 rounded-full px-2 py-0.5 text-[9px] uppercase font-black border ${categoryColor}`}>
                  {table.category || "General Seating"}
                </span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
            {table.type.toLowerCase()} table • Capacity: {table.capacity}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="table-visualizer my-12">
          <div className={`table-surface ${table.type.toLowerCase()} shadow-xl bg-white/80 border-2 border-primary/10`}>
            <span className="text-[10px] font-black opacity-30 tracking-widest">{table.name}</span>
          </div>
          {seats.map((_, i) => {
            const guest = table.assignments[i];
            const angle = (i * 360) / table.capacity;
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            const perSide = Math.ceil(table.capacity / 2);
            const spacing = 70;
            const rectX = table.type === 'RECTANGULAR'
              ? (i < perSide ? (i * spacing) - ((perSide - 1) * spacing / 2) : ((i - perSide) * spacing) - ((perSide - 1) * spacing / 2))
              : x;
            const rectY = table.type === 'RECTANGULAR' ? (i < perSide ? -85 : 85) : y;
            return (
              <DropdownMenu key={i}>
                <DropdownMenuTrigger asChild disabled={!isEditing}>
                  <div
                    onDragOver={(e) => isEditing && e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const guestId = e.dataTransfer.getData("guestId");
                      if (guestId) handleDropLocal(i, guestId, e);
                    }}
                    className={`seat ${guest ? 'occupied bg-primary text-primary-foreground shadow-lg scale-110' : isEditing ? 'hover:bg-primary/10 border-2 border-dashed border-primary/30' : 'border-2 border-zinc-200 opacity-60'} transition-all duration-300`}
                    style={{
                      transform: `translate(${table.type === 'CIRCULAR' ? x : rectX}px, ${table.type === 'CIRCULAR' ? y : rectY}px)`,
                      cursor: isEditing ? 'pointer' : 'default'
                    }}
                  >
                    {guest ? (
                      <span className="seat-label font-bold text-[10px] px-1 text-center leading-tight overflow-hidden break-words max-h-full" title={guest.name}>
                        {guest.name}
                      </span>
                    ) : (
                      isEditing && <Plus className="h-3 w-3 text-primary/40" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {guest ? (
                    <DropdownMenuItem onClick={() => handleRemoveLocal(i)} className="text-destructive focus:text-destructive">
                      <X className="mr-2 h-4 w-4" /> Remove {guest.name}
                    </DropdownMenuItem>
                  ) : (
                    <div className="p-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 mb-1">Assign Guest</p>
                      {availableGuests.length > 0 ? (
                        availableGuests.map(g => (
                          <DropdownMenuItem key={g.id} onClick={() => handleAssignLocal(i, g)} className="text-sm">
                            {g.name}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No unassigned guests</DropdownMenuItem>
                      )}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>

        {isEditing && (
          <div className="mt-12 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Capacity</Label>
              <Input
                type="number"
                value={table.capacity}
                onChange={(e) => {
                  let val = parseInt(e.target.value) || 0;
                  if (val > 10) val = 10;
                  if (val < 1) val = 1;
                  onWorkspaceChange({ ...table, capacity: val });
                }}
                max={10}
                min={1}
                className="h-8 bg-white border border-zinc-200 text-xs rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Category</Label>
              <Input
                value={table.category}
                placeholder="e.g. Friends"
                onChange={(e) => onWorkspaceChange({ ...table, category: e.target.value })}
                className="h-8 bg-white border border-zinc-200 text-xs rounded-lg px-3"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatingPlanner;