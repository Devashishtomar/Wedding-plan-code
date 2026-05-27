import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Users, UserCheck, Clock, UserX, Mail, FileEdit, Send, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEvent } from "@/contexts/EventContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

interface Guest {
  id: string;
  name: string;
  email: string | null;
  rsvp: "PENDING" | "ACCEPTED" | "DECLINED";
  visibility: string;
  invites: {
    id: string;
    status: string;
    sentAt: string | null;
  }[];
  eventId: string | null;
  event?: {
    name: string;
  };
}

interface PublicRSVP {
  id: string;
  name: string;
  attending: boolean;
  submittedAt: string;
  eventName?: string;
}

const Guests = () => {
  const { toast } = useToast();
  const { canEditGuests: canManageGuests, role } = usePermissions();
  const queryClient = useQueryClient();
  const [sendingInvite, setSendingInvite] = useState<Record<string, boolean>>({});
  const [newGuest, setNewGuest] = useState({ name: "", email: "" });
  const [showForm, setShowForm] = useState(false);
  const [isInvitationFilled, setIsInvitationFilled] = useState(false);
  const [rsvpResponses, setRsvpResponses] = useState<PublicRSVP[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({ id: "", name: "", email: "" });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [confirmDeleteGuest, setConfirmDeleteGuest] = useState<Guest | null>(null);
  const [newGuestEventId, setNewGuestEventId] = useState<string>("none");
  const { selectedEventId, viewMode, selectedEvent, events } = useEvent();

  const { data: guestsData, isLoading: isGuestsLoading } = useQuery({
    queryKey: ['guests', viewMode, selectedEventId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', viewMode === 'individual' ? 'PRIVATE' : 'SHARED');

      if (selectedEventId && selectedEventId !== 'all') {
        params.append('eventId', selectedEventId);
      }

      const res = await api.get(`/api/guests?${params.toString()}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const guests: Guest[] = guestsData?.guests || [];

  const { data: inviteData } = useQuery({
    queryKey: ['invitation-status', viewMode, selectedEventId],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/invitations/me?view=${viewMode === 'individual' ? 'PRIVATE' : 'SHARED'}`);
        const invitations = res.data.invitations || [];

        const targetEventId = selectedEventId === 'all' ? null : selectedEventId;
        const currentInvite = invitations.find((inv: any) => inv.invitation.eventId === targetEventId);

        setIsInvitationFilled(!!currentInvite);
        return invitations;
      } catch {
        setIsInvitationFilled(false);
        return null;
      }
    },
  });

  const { data: rsvpData } = useQuery({
    queryKey: ['public-rsvp', viewMode, selectedEventId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', viewMode === 'individual' ? 'PRIVATE' : 'SHARED');

      if (selectedEventId && selectedEventId !== 'all') {
        params.append('eventId', selectedEventId);
      }

      const res = await api.get(`/api/rsvp/public?${params.toString()}`);
      setRsvpResponses(res.data.responses);
      return res.data;
    },
  });


  const handleSendEmail = async (guest: Guest) => {
    setSendingInvite((prev) => ({ ...prev, [guest.id]: true }));
    try {
      const targetEventId = selectedEventId === 'all' ? null : selectedEventId;
      const currentInvite = inviteData?.find((inv: any) => inv.invitation.eventId === targetEventId);

      if (!currentInvite?.invitation?.id) {
        toast({ title: "Error", description: "No active invitation found to send.", variant: "destructive" });
        setSendingInvite((prev) => ({ ...prev, [guest.id]: false }));
        return;
      }

      await api.post(`/api/guests/${guest.id}/send-invite`, {
        invitationId: currentInvite.invitation.id
      });

      toast({
        title: "Invitation Sent",
        description: `Successfully sent to ${guest.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setSendingInvite((prev) => ({ ...prev, [guest.id]: false }));
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    const visibility = viewMode === 'individual'
      ? (role === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE')
      : 'SHARED';

    const resolvedEventId = selectedEventId === 'all'
      ? (newGuestEventId === "none" ? null : newGuestEventId)
      : selectedEventId;

    const res = await api.post("/api/guests", {
      name: newGuest.name,
      email: newGuest.email,
      visibility: visibility,
      eventId: resolvedEventId,
    });

    await queryClient.invalidateQueries({ queryKey: ['guests'] });
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });

    // FIXED: Removed the buggy setGuests optimistic update
    setNewGuest({ name: "", email: "" });
    setShowForm(false);

    toast({
      title: "Guest Added",
      description: `${res.data.guest.name} has been added.`,
    });
  };

  const getStatusBadge = (status: "confirmed" | "pending" | "declined") => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };


  const openEditGuest = (guest: Guest) => {
    if ((guest.invites?.length ?? 0) > 0) return;

    setEditingGuest(guest);
    setEditForm({
      id: guest.id,
      name: guest.name,
      email: guest.email || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingGuest || isSavingEdit) return;

    setIsSavingEdit(true);
    try {
      await api.patch(`/api/guests/${editingGuest.id}`, editForm);

      await queryClient.invalidateQueries({ queryKey: ['guests'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      toast({
        title: "Guest updated",
        description: "Guest details have been updated.",
      });

      setEditingGuest(null);
    } catch {
      toast({
        title: "Update failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingEdit(false);
    }
  };


  const handleDeleteGuest = async () => {
    if (!confirmDeleteGuest || isDeleting) return;

    if ((confirmDeleteGuest.invites?.length ?? 0) > 0) {
      toast({
        title: "Action not allowed",
        description: "You cannot delete a guest after an invitation has been sent.",
        variant: "destructive",
      });
      setConfirmDeleteGuest(null);
      return;
    }

    if (confirmDeleteGuest.rsvp === "ACCEPTED") {
      toast({
        title: "Action not allowed",
        description: "You cannot delete a guest who has accepted the invitation.",
        variant: "destructive",
      });
      setConfirmDeleteGuest(null);
      return;
    }

    const guestId = confirmDeleteGuest.id;

    setConfirmDeleteGuest(null);
    setIsDeleting(guestId);

    try {
      await api.delete(`/api/guests/${guestId}`);
      await queryClient.invalidateQueries({ queryKey: ['guests'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: "Guest removed", description: "Guest has been deleted." });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const privateGuests = guests.filter(g => g.email !== null);
  const publicGuests = guests.filter(g => g.email === null);

  const stats = {
    total: selectedEventId === 'all'
      ? new Set(privateGuests.map(g => g.email || g.name)).size
      : privateGuests.length,
    confirmed: privateGuests.filter(g => g.rsvp === "ACCEPTED").length,
    pending: privateGuests.filter(g => g.rsvp === "PENDING").length,
    declined: privateGuests.filter(g => g.rsvp === "DECLINED").length,
  };

  const linkStats = {
    total: rsvpResponses.length,
    attending: rsvpResponses.filter(r => r.attending).length,
    notAttending: rsvpResponses.filter(r => !r.attending).length,
  };

  if (isGuestsLoading && !guestsData) {
    return <GuestSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Guest List</h1>
          <p className="text-muted-foreground">
            {viewMode === 'individual' && selectedEvent
              ? `Guest attending the ${selectedEvent.name}`
              : "Manage all guests across your entire wedding."}
          </p>
        </div>
        {canManageGuests && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showForm ? "Cancel" : "Add Guest"}
          </Button>
        )}
      </div>

      {showForm && canManageGuests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGuest}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Guest name"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guest@email.com"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    required
                  />
                </div>
                {/* FIXED: The Specific Event Law - Only ask for the Event if we are in "All Events" */}
                {viewMode === 'collaborative' && selectedEventId === 'all' && (
                  <div className="flex-1 space-y-2">
                    <Label>Event</Label>
                    <Select value={newGuestEventId} onValueChange={setNewGuestEventId}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Event" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="none">All Events</SelectItem>
                        {events.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-end">
                  <Button type="submit">Add Guest</Button>
                </div>
              </div>
            </form>
            <p className="text-sm text-muted-foreground mt-3">
              After adding guests, go to <Link to="/invitations" className="text-primary hover:underline">Invitations</Link> to copy the RSVP link and share it with them.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="guests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guest List ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="link-responses" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Link Responses ({linkStats.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-sm text-muted-foreground">Total Guests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.confirmed}</div>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.declined}</div>
                    <p className="text-sm text-muted-foreground">Declined</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Invite Status</TableHead>
                    <TableHead>RSVP Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    // FIXED: The Merging Law
                    const displayGuests = selectedEventId === 'all' ? (() => {
                      const map = new Map();
                      privateGuests.forEach(g => {
                        const key = g.email || g.name; // Merge by email
                        if (!map.has(key)) {
                          map.set(key, {
                            ...g,
                            eventNames: [g.event?.name || 'All Events'],
                            allRsvps: [g.rsvp],
                            anyInviteSent: (g.invites?.length ?? 0) > 0
                          });
                        } else {
                          const existing = map.get(key);
                          existing.eventNames.push(g.event?.name || 'All Events');
                          existing.allRsvps.push(g.rsvp);
                          existing.anyInviteSent = existing.anyInviteSent || (g.invites?.length ?? 0) > 0;
                        }
                      });
                      return Array.from(map.values());
                    })() : privateGuests.map(g => ({
                      ...g,
                      eventNames: [g.event?.name || 'All Events'],
                      allRsvps: [g.rsvp],
                      anyInviteSent: (g.invites?.length ?? 0) > 0
                    }));

                    return displayGuests.map((guest: any) => {
                      const hasInviteBeenSent = guest.anyInviteSent;
                      const isRsvpAccepted = guest.allRsvps.includes("ACCEPTED");

                      // Calculate Aggregate RSVP Logic
                      const rsvps = guest.allRsvps;
                      const accepted = rsvps.filter((r: string) => r === "ACCEPTED").length;
                      const declined = rsvps.filter((r: string) => r === "DECLINED").length;
                      const pending = rsvps.filter((r: string) => r === "PENDING").length;

                      return (
                        <TableRow key={guest.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{guest.name}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {guest.eventNames.map((evtName: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className={cn(
                                    "text-[9px] uppercase font-bold py-0.5 px-2 whitespace-nowrap w-fit border-primary/20 leading-tight",
                                    evtName === 'All Events' ? "bg-muted text-muted-foreground" : "bg-primary/5 text-primary"
                                  )}>
                                    {evtName}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{guest.email}</TableCell>
                          <TableCell>
                            {hasInviteBeenSent ? (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                <Mail className="h-3 w-3 mr-1" />
                                Sent
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                Not Sent
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {/* FIXED: Aggregate RSVP Display Logic */}
                            {rsvps.length === 1 ? (
                              getStatusBadge(rsvps[0] === "ACCEPTED" ? "confirmed" : rsvps[0] === "DECLINED" ? "declined" : "pending")
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {accepted === rsvps.length ? (
                                  <Badge className="bg-green-100 text-green-800">Confirmed ({accepted})</Badge>
                                ) : declined === rsvps.length ? (
                                  <Badge variant="destructive">Declined ({declined})</Badge>
                                ) : (
                                  <>
                                    {accepted > 0 && <Badge className="bg-green-100 text-green-800">Confirmed ({accepted})</Badge>}
                                    {declined > 0 && <Badge variant="destructive">Declined ({declined})</Badge>}
                                    {pending > 0 && <Badge variant="secondary">Pending ({pending})</Badge>}
                                  </>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {canManageGuests && (
                              <>
                                {/* FIXED: Allow Master Global guests to be invited from All Events view, while shielding sub-event guests */}
                                {!hasInviteBeenSent && (
                                  selectedEventId === 'all' ? (
                                    guest.eventId === null ? (
                                      isInvitationFilled ? (
                                        <Button size="sm" disabled={sendingInvite[guest.id]} onClick={() => handleSendEmail(guest)}>
                                          <Send className="h-3 w-3 mr-1" />
                                          Send Wedding Email
                                        </Button>
                                      ) : (
                                        <Link to="/invitations">
                                          <Button size="sm" variant="outline">
                                            <FileEdit className="h-3 w-3 mr-1" />
                                            Fill Wedding Invitation
                                          </Button>
                                        </Link>
                                      )
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled
                                        title="To send this specific event invitation, please switch to that event's tab."
                                      >
                                        <Send className="h-3 w-3 mr-1 opacity-50" />
                                        Invite via Event Tab
                                      </Button>
                                    )
                                  ) : (
                                    /* Standard template rendering when scoped to an individual event tab */
                                    isInvitationFilled ? (
                                      <Button size="sm" disabled={sendingInvite[guest.id]} onClick={() => handleSendEmail(guest)}>
                                        <Send className="h-3 w-3 mr-1" />
                                        Send Email
                                      </Button>
                                    ) : (
                                      <Link to="/invitations">
                                        <Button size="sm" variant="outline">
                                          <FileEdit className="h-3 w-3 mr-1" />
                                          Fill Invitation
                                        </Button>
                                      </Link>
                                    )
                                  )
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={hasInviteBeenSent}
                                  title={hasInviteBeenSent ? "Editing is disabled after an invite is sent" : "Edit guest"}
                                  onClick={() => openEditGuest(guest)}
                                >
                                  <FileEdit className="h-3 w-3" />
                                </Button>
                                {(selectedEventId !== 'all' || (selectedEventId === 'all' && !guest.eventId)) && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={isDeleting === guest.id || hasInviteBeenSent || isRsvpAccepted}
                                    title={
                                      hasInviteBeenSent ? "Cannot delete a guest after an invite is sent"
                                        : isRsvpAccepted ? "Cannot delete a guest who has accepted the invitation"
                                          : "Delete guest"
                                    }
                                    onClick={() => setConfirmDeleteGuest(guest)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link-responses" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{linkStats.total}</div>
                    <p className="text-sm text-muted-foreground">Total Responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{linkStats.attending}</div>
                    <p className="text-sm text-muted-foreground">Attending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{linkStats.notAttending}</div>
                    <p className="text-sm text-muted-foreground">Not Attending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>RSVP Link Responses</CardTitle>
            </CardHeader>
            <CardContent>
              {rsvpResponses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No responses yet</p>
                  <p className="text-sm mt-1">Share your invitation link to start receiving RSVPs</p>
                  <Link to="/invitations">
                    <Button variant="outline" className="mt-4">
                      Go to Invitations
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvpResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{response.name}</span>
                            {selectedEventId === 'all' && response.eventName && (
                              <div className="mt-1">
                                <Badge variant="outline" className="text-[9px] uppercase font-bold py-0.5 px-2 whitespace-nowrap w-fit bg-primary/5 text-primary border-primary/20 leading-tight">
                                  {response.eventName}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {response.attending ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Attending
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <UserX className="h-3 w-3 mr-1" />
                              Not Attending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">About Link Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These are responses from guests who used your public RSVP link. Anyone with the link can submit their response.
                Go to <Link to="/invitations" className="text-primary hover:underline font-medium">Invitations</Link> to get your shareable link.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog
        open={!!confirmDeleteGuest}
        onOpenChange={() => setConfirmDeleteGuest(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Guest</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {confirmDeleteGuest?.name}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteGuest(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting !== null}
              onClick={handleDeleteGuest}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full"
              disabled={isSavingEdit}
              onClick={handleSaveEdit}
            >
              {isSavingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
const GuestSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
    </div>
    <Skeleton className="h-[500px] w-full rounded-xl" />
  </div>
);

export default Guests;
