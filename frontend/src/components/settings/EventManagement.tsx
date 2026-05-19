import React, { useState } from 'react';
import { useEvent, Event } from '@/contexts/EventContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, MapPin, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const PREDEFINED_EVENTS = [
  { name: 'Engagement', type: 'ENGAGEMENT' },
  { name: 'Haldi', type: 'HALDI' },
  { name: 'Mehendi', type: 'MEHENDI' },
  { name: 'Sangeet', type: 'SANGEET' },
  { name: 'Cocktail', type: 'COCKTAIL' },
  { name: 'Baraat', type: 'BARAAT' },
  { name: 'Wedding Ceremony', type: 'WEDDING' },
  { name: 'Reception', type: 'RECEPTION' },
];

const EventManagement: React.FC = () => {
  const { events, refreshEvents, viewMode, loading } = useEvent();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    type: 'CUSTOM',
    budget: '',
    visibility: 'SHARED'
  });

  const { data: weddingRes } = useQuery<any>({ queryKey: ['wedding-me'] });
  const memberContext = weddingRes?.data?.memberContext || weddingRes?.memberContext;

  // FIXED: Pull the perfect Target Budget dynamically from the Dashboard cache!
  const { data: dashData } = useQuery({
    queryKey: ['dashboard-target', viewMode],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', viewMode === 'individual' ? 'PRIVATE' : 'SHARED');
      const res = await api.get(`/api/dashboard?${params.toString()}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const targetBudget = dashData?.data?.budget?.target || 0;
  const totalAllocated = events.reduce((sum, e) => sum + (e.budget || 0), 0);
  const overAllocated = totalAllocated > targetBudget;

  const handleCreate = async () => {
    if (!formData.name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    const tempId = Math.random().toString(36).substring(7);
    const newEvent = {
      id: tempId,
      ...formData,
      budget: formData.budget ? Number(formData.budget) : 0,
      isCustom: formData.type === 'CUSTOM',
      date: formData.date || null,
    } as Event;

    // Optimistic Update
    setIsAdding(false);
    setFormData({ name: '', date: '', location: '', type: 'CUSTOM', budget: '', visibility: 'SHARED' });

    try {
      await api.post('/api/events', {
        ...newEvent,
        isCustom: newEvent.type === 'CUSTOM'
      });
      toast({ title: "Event created", description: `${newEvent.name} has been added.` });
      refreshEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create event",
        variant: "destructive"
      });
      refreshEvents(); // Revert by fetching fresh data
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.patch(`/api/events/${id}`, {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : 0,
      });
      toast({ title: "Event updated" });
      setEditingId(null);
      refreshEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update event",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteEvent || isDeleting) return;
    setIsDeleting(true);

    // Local removal for speed
    const deletedId = confirmDeleteEvent.id;
    setConfirmDeleteEvent(null);

    try {
      await api.delete(`/api/events/${deletedId}`);
      toast({ title: "Event deleted" });
      refreshEvents();
    } catch (err: any) {
      toast({
        title: "Failed to delete event",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
      refreshEvents();
    } finally {
      setIsDeleting(false);
    }
  };

  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      name: event.name,
      date: event.date ? event.date.split('T')[0] : '',
      location: event.location || '',
      type: event.type,
      budget: event.budget ? String(event.budget) : '',
      visibility: event.visibility || 'SHARED',
    });
  };

  const quickAdd = async (predefined: { name: string, type: string }) => {
    try {
      const visibility = viewMode === 'individual'
        ? (memberContext?.role === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE')
        : 'SHARED';

      await api.post('/api/events', {
        name: predefined.name,
        type: predefined.type,
        isCustom: false,
        visibility: visibility,
      });
      toast({ title: "Event added", description: `${predefined.name} added to your wedding.` });
      refreshEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add event",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Wedding Events
              </CardTitle>
              <CardDescription className="text-base">
                Create and manage the different celebrations of your wedding journey.
              </CardDescription>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="shadow-md hover:shadow-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Budget Summary */}
          <div className="p-4 rounded-xl border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                Budget Allocation Summary
              </h4>
              <p className="text-2xl font-bold">{formatCurrency(targetBudget)}</p>
              <p className="text-sm text-muted-foreground">
                {viewMode === 'individual' ? "Private Allocation Target" : "Total Wedding Budget"}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className={cn("text-2xl font-bold", overAllocated ? "text-destructive" : "text-primary")}>
                {formatCurrency(totalAllocated)}
              </p>
              <p className="text-sm text-muted-foreground">
                Allocated to Events
                {overAllocated && <span className="text-destructive ml-1">(Over Budget)</span>}
              </p>
            </div>
          </div>

          {/* Quick Add Section */}

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Quick Add Traditional Events
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {PREDEFINED_EVENTS.map((item) => {
                const exists = events.some(e => e.type === item.type);
                return (
                  <button
                    key={item.type}
                    onClick={() => !exists && quickAdd(item)}
                    disabled={exists}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group",
                      exists
                        ? "bg-muted/50 border-transparent opacity-60 cursor-not-allowed"
                        : "bg-background border-border hover:border-primary hover:bg-primary/5 active:scale-95"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                      exists ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    )}>
                      {exists ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Manage Your Schedule
            </h4>

            <div className="grid gap-4">
              {isAdding && (
                <div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Event Name</Label>
                      <Input
                        placeholder="e.g. Welcome Dinner, Cocktail Party"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-background border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-bold">Location / Venue</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Where is it happening?"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-10 bg-background border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-sm font-bold">Allocated Budget ($)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="bg-background border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-sm font-bold">Visibility (View Pillar)</Label>
                      <Select
                        value={formData.visibility}
                        onValueChange={(v) => setFormData({ ...formData, visibility: v })}
                      >
                        <SelectTrigger className="bg-background border-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHARED">Shared (Everyone)</SelectItem>
                          {memberContext?.role !== 'GROOM' && (
                            <SelectItem value="BRIDE_PRIVATE">Bride's Side Only</SelectItem>
                          )}
                          {memberContext?.role !== 'BRIDE' && (
                            <SelectItem value="GROOM_PRIVATE">Groom's Side Only</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button onClick={handleCreate} className="px-8 shadow-md">Create Event</Button>
                  </div>
                </div>
              )}

              {events.length === 0 && !isAdding && (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">No events yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">Start building your wedding timeline by adding events above.</p>
                </div>
              )}

              <div className="grid gap-3">
                {loading ? (
                  [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-200",
                        editingId === event.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-background hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      {editingId === event.id ? (
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Event Name</Label>
                              <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Event Name"
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Date</Label>
                              <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Location</Label>
                              <Input
                                placeholder="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Budget ($)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="bg-background"
                              />
                            </div>
                            {/* FIXED: Inserted the Visibility UI for Editing */}
                            <div className="space-y-1">
                              <Label className="text-xs">Visibility</Label>
                              <Select
                                value={formData.visibility}
                                onValueChange={(v) => setFormData({ ...formData, visibility: v })}
                              >
                                <SelectTrigger className="bg-background h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SHARED">Shared</SelectItem>
                                  {memberContext?.role !== 'GROOM' && (
                                    <SelectItem value="BRIDE_PRIVATE">Bride's Side</SelectItem>
                                  )}
                                  {memberContext?.role !== 'BRIDE' && (
                                    <SelectItem value="GROOM_PRIVATE">Groom's Side</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleUpdate(event.id)}>
                              <Check className="h-4 w-4 mr-2" /> Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 flex-1">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm",
                              event.type === 'WEDDING' ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            )}>
                              {event.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-lg">{event.name}</h5>
                                {event.type !== 'CUSTOM' && (
                                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-bold py-0 h-5">
                                    {event.type}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <CalendarIcon className="h-3.5 w-3.5 text-primary/70" />
                                  {event.date ? format(new Date(event.date), "PPP") : 'No date scheduled'}
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary/70" />
                                    {event.location}
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  Budget: {formatCurrency(event.budget || 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => startEdit(event)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground" onClick={() => setConfirmDeleteEvent(event)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!confirmDeleteEvent} onOpenChange={() => setConfirmDeleteEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDeleteEvent?.name}</span>?{" "}
              All linked tasks, guests, and budget items will be unassigned. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventManagement;
