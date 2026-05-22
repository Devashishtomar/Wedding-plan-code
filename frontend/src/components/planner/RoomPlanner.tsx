import { useState, useMemo, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Plus, Users, Trash2, Bed, Search, GripVertical, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEvent } from "@/contexts/EventContext";
import { usePermissions } from "@/hooks/usePermissions";

interface Guest {
  id: string;
  name: string;
  isCompanion?: boolean;
}

interface Room {
  id: string;
  number: string;
  familyName: string;
  capacity: number;
  guests: Guest[];
}

interface RoomPlannerProps {
  arrangementId: string;
}

const RoomPlanner: React.FC<RoomPlannerProps> = ({ arrangementId }) => {
  const queryClient = useQueryClient();
  const { selectedEventId, viewMode } = useEvent();
  const { canManageEvents } = usePermissions();
  const viewParam = viewMode === "collaborative" ? "SHARED" : "PRIVATE";

  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [newGuestName, setNewGuestName] = useState("");

  // 1. Fetch Hydrated Layout Configuration including database-persisted arrangement guests
  const { data: arrangement } = useQuery<any>({
    queryKey: ['arrangement-detail-rooms', arrangementId],
    queryFn: async () => {
      const res = await api.get(`/api/arrangements/${arrangementId}`);
      return res.data?.arrangement;
    }
  });

  // 2. Stream confirmed guests corresponding to active context parameters
  const { data: confirmedGuests = [] } = useQuery<any[]>({
    queryKey: ['confirmed-guests-sidebar', selectedEventId, viewMode],
    queryFn: async () => {
      const res = await api.get(`/api/arrangements/guests/confirmed?view=${viewParam}&eventId=${selectedEventId}`);
      return res.data?.guests || [];
    }
  });

  // Server Mutations
  const addRoomMutation = useMutation({
    mutationFn: async (roomPayload: { roomNumber: string; familyName?: string; capacity: number }) => {
      return await api.post(`/api/arrangements/${arrangementId}/rooms`, roomPayload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrangement-detail-rooms', arrangementId] })
  });

  const saveRoomMutation = useMutation({
    mutationFn: async ({ roomId, number, familyName, capacity, guests }: { roomId: string; number: string; familyName: string; capacity: number; guests: Guest[] }) => {
      await api.put(`/api/arrangements/rooms/${roomId}`, { roomNumber: number, familyName, capacity });
      await api.put(`/api/arrangements/rooms/${roomId}/guests/batch`, { guests });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrangement-detail-rooms', arrangementId] })
  });

  const addCompanionMutation = useMutation({
    mutationFn: async (companionName: string) => {
      return await api.post(`/api/arrangements/${arrangementId}/companions`, { name: companionName });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrangement-detail-rooms', arrangementId] })
  });

  const deleteCompanionMutation = useMutation({
    mutationFn: async (companionId: string) => {
      return await api.delete(`/api/arrangements/companions/${companionId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrangement-detail-rooms', arrangementId] })
  });

  // Data Normalization Map: Converts server payloads into predictable frontend models
  const normalizedRooms = useMemo(() => {
    const fetchedRooms = arrangement?.rooms || [];
    return fetchedRooms.map((r: any) => ({
      id: r.id,
      number: r.roomNumber,
      familyName: r.familyName || "Group Space",
      capacity: r.capacity,
      guests: (r.assignments || []).map((a: any) => {
        const target = a.guest || a.arrangementGuest;
        return {
          id: target?.id,
          name: target?.name || "Unknown Occupant",
          isCompanion: !!a.arrangementGuestId
        };
      })
    }));
  }, [arrangement?.rooms]);

  const allAvailableGuests = useMemo(() => {
    const persistedCompanions = (arrangement?.localGuests || []).map((g: any) => ({
      id: g.id,
      name: g.name,
      isCompanion: true
    }));
    return [...confirmedGuests, ...persistedCompanions];
  }, [confirmedGuests, arrangement?.localGuests]);

  // Master local state cache buffer array to completely eliminate layout input pings lagging
  const [workspaceRooms, setWorkspaceRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (normalizedRooms && normalizedRooms.length > 0) {
      setWorkspaceRooms(normalizedRooms);
    } else {
      setWorkspaceRooms([]);
    }
  }, [normalizedRooms]);

  // Calculations run instantly inside memory tree matrices
  const assignedGuestIds = useMemo(() => {
    const ids = new Set<string>();
    workspaceRooms.forEach((room) => {
      room.guests.forEach((g) => {
        if (g?.id) ids.add(g.id);
      });
    });
    return ids;
  }, [workspaceRooms]);

  const filteredUnassignedGuests = useMemo(() => {
    return allAvailableGuests.filter((g) => {
      if (assignedGuestIds.has(g.id)) return false;
      return g.name.toLowerCase().includes(sidebarSearch.toLowerCase());
    });
  }, [allAvailableGuests, assignedGuestIds, sidebarSearch]);

  const addRoom = () => {
    addRoomMutation.mutate({
      roomNumber: (100 + workspaceRooms.length + 1).toString(),
      familyName: "New Group Space",
      capacity: 2
    });
  };

  const deleteRoom = (id: string) => {
    if (window.confirm("Are you sure you want to delete this hotel room entry?")) {
      api.delete(`/api/arrangements/rooms/${id}`).then(() => {
        queryClient.invalidateQueries({ queryKey: ['arrangement-detail-rooms', arrangementId] });
      });
    }
  };

  const filteredRooms = workspaceRooms.filter(room =>
    room.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.number.includes(searchQuery) ||
    room.guests.some(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-full gap-8">
      {/* Searchable, scrollable Sidebar Panel */}
      <Card className="w-80 h-[720px] flex flex-col border-none shadow-xl bg-white/50 backdrop-blur-sm shrink-0">
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
                    <Button variant="ghost" size="icon" onClick={() => deleteCompanionMutation.mutate(guest.id)} className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" disabled={deleteCompanionMutation.isPending}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Grid Work Canvas */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search family or guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full bg-white/50 border-none shadow-sm focus-visible:ring-primary/20"
            />
          </div>
          {canManageEvents && (
            <Button onClick={addRoom} className="rounded-full shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Add Room
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomComponent
              key={room.id}
              room={room}
              availableGuests={allAvailableGuests}
              canEdit={canManageEvents}
              onDelete={() => deleteRoom(room.id)}
              onSave={(roomId: string, payload: any) => saveRoomMutation.mutateAsync({ roomId, ...payload })}
              onWorkspaceChange={(updatedRoom: Room) => {
                setWorkspaceRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Refactored Room Component: Unified Inline Save & Drag Drop Hooks ─── */
const RoomComponent = ({ room, availableGuests, canEdit, onDelete, onSave, onWorkspaceChange }: any) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDropGuest = (e: any) => {
    e.preventDefault();
    if (!isEditing || !canEdit) return;
    if (room.guests.length >= room.capacity) {
      alert("Room has hit its maximum allocation capacity threshold constraint.");
      return;
    }
    const guestId = e.dataTransfer.getData("guestId");
    const isCompanion = e.dataTransfer.getData("isCompanion") === "true";
    const guest = availableGuests.find((g: any) => g.id === guestId);

    if (guest) {
      const updatedGuests = [...room.guests, { id: guest.id, name: guest.name, isCompanion }];
      onWorkspaceChange({ ...room, guests: updatedGuests });
    }
  };

  const handleRemoveGuest = (guestId: string) => {
    if (!isEditing || !canEdit) return;
    const updatedGuests = room.guests.filter((g: any) => g.id !== guestId);
    onWorkspaceChange({ ...room, guests: updatedGuests });
  };

  const commitSavedRoom = () => {
    onSave(room.id, {
      number: room.number,
      familyName: room.familyName,
      capacity: Number(room.capacity),
      guests: room.guests
    });
    setIsEditing(false);
  };

  return (
    <Card
      onDragOver={(e) => isEditing && e.preventDefault()}
      onDrop={handleDropGuest}
      className={`glass-card border-none overflow-hidden transition-all duration-300 relative group/card ${isEditing ? 'ring-2 ring-primary/40 shadow-2xl' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 pr-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Bed className="h-5 w-5" />
          </div>
          <div>
            {isEditing ? (
              <div className="flex flex-col gap-1 mt-1">
                <Input
                  value={room.number}
                  onChange={(e) => onWorkspaceChange({ ...room, number: e.target.value })}
                  className="h-7 w-24 text-sm bg-white border px-1"
                />
                <Input
                  value={room.familyName}
                  onChange={(e) => onWorkspaceChange({ ...room, familyName: e.target.value })}
                  className="h-6 text-xs bg-white border px-1 mt-1"
                />
              </div>
            ) : (
              <>
                <CardTitle className="text-lg font-bold">Room {room.number}</CardTitle>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter truncate max-w-[120px]">{room.familyName}</p>
              </>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {canEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => isEditing ? commitSavedRoom() : setIsEditing(true)}
              className="h-7 text-[10px] font-bold px-2 bg-zinc-100 hover:bg-zinc-200"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          )}
          {canEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-7 w-7 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Occupants</span>
            <span>{room.guests.length} / {room.capacity}</span>
          </div>

          <div className={`space-y-1.5 min-h-[60px] rounded-xl p-1 ${isEditing ? 'border-2 border-dashed border-primary/20 bg-primary/5' : ''}`}>
            {room.guests.map((guest: any) => (
              <div key={guest.id} className="flex items-center justify-between p-2 rounded-lg bg-white/60 border border-white/80 shadow-sm">
                <span className="text-xs font-medium truncate max-w-[140px]">{guest.name}</span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGuest(guest.id)}
                    className="h-5 w-5 rounded-full hover:bg-destructive/10 text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {isEditing && room.guests.length === 0 && (
              <p className="text-[10px] text-center text-muted-foreground py-4">Drag guests here...</p>
            )}
          </div>

          {isEditing && (
            <div className="pt-3 grid grid-cols-2 gap-2 border-t border-white/20">
              <div className="space-y-0.5">
                <Label className="text-[9px] font-bold text-muted-foreground uppercase">Capacity</Label>
                <Input
                  type="number"
                  value={room.capacity}
                  onChange={(e) => onWorkspaceChange({ ...room, capacity: parseInt(e.target.value) || 0 })}
                  className="h-7 text-xs bg-white border"
                  max={6}
                  min={1}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomPlanner;