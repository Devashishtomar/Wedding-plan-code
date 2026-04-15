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


interface Guest {
  id: string;
  name: string;
  email: string | null;
  rsvp: "PENDING" | "ACCEPTED" | "DECLINED";
  invites: {
    id: string;
    status: string;
    sentAt: string | null;
  }[];
}

interface PublicRSVP {
  id: string;
  name: string;
  attending: boolean;
  submittedAt: string;
}


const Guests = () => {
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [sendingInvite, setSendingInvite] = useState<Record<string, boolean>>({});
  const [newGuest, setNewGuest] = useState({ name: "", email: "" });
  const [showForm, setShowForm] = useState(false);
  const [isInvitationFilled, setIsInvitationFilled] = useState(false);
  const [rsvpResponses, setRsvpResponses] = useState<PublicRSVP[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [confirmDeleteGuest, setConfirmDeleteGuest] = useState<Guest | null>(null);


  useEffect(() => {
    const loadGuests = async () => {
      const res = await api.get("/api/guests");
      setGuests(res.data.guests);
    };

    loadGuests();
  }, []);


  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const res = await api.get("/api/invitations/me");
        setIsInvitationFilled(!!res.data.invitation);
      } catch {
        setIsInvitationFilled(false);
      }
    };

    checkInvitation();
  }, []);

  useEffect(() => {
    const loadPublicResponses = async () => {
      const res = await api.get("/api/rsvp/public");
      setRsvpResponses(res.data.responses);
    };

    loadPublicResponses();
  }, []);


  const handleSendEmail = async (guest: Guest) => {
    if (sendingInvite[guest.id]) return;

    setSendingInvite((prev) => ({ ...prev, [guest.id]: true }));

    try {
      await api.post(`/api/guests/${guest.id}/send-invite`);

      const res = await api.get("/api/guests");
      setGuests(res.data.guests);

      toast({
        title: "Email Sent",
        description: `Invitation email sent to ${guest.name}.`,
      });
    } catch {
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSendingInvite((prev) => ({ ...prev, [guest.id]: false }));
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await api.post("/api/guests", newGuest);

    setGuests(prev => [...prev, res.data.guest]);
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
    setEditForm({ name: guest.name, email: guest.email || "" });
  };

  const handleSaveEdit = async () => {
    if (!editingGuest || isSavingEdit) return;

    setIsSavingEdit(true);
    try {
      const res = await api.patch(`/api/guests/${editingGuest.id}`, editForm);

      setGuests((prev) =>
        prev.map((g) =>
          g.id === editingGuest.id ? res.data.guest : g
        )
      );

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
        description:
          "You cannot delete a guest after an invitation has been sent.",
        variant: "destructive",
      });
      setConfirmDeleteGuest(null);
      return;
    }

    if (confirmDeleteGuest.rsvp === "ACCEPTED") {
      toast({
        title: "Action not allowed",
        description:
          "You cannot delete a guest who has accepted the invitation.",
        variant: "destructive",
      });
      setConfirmDeleteGuest(null);
      return;
    }

    const guestId = confirmDeleteGuest.id;

    setIsDeleting(guestId);
    try {
      await api.delete(`/api/guests/${guestId}`);

      setGuests((prev) => prev.filter((g) => g.id !== guestId));

      toast({
        title: "Guest removed",
        description: "Guest has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description:
          error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
      setConfirmDeleteGuest(null);
    }
  };

  const privateGuests = guests.filter(g => g.email !== null);
  const publicGuests = guests.filter(g => g.email === null);

  const stats = {
    total: privateGuests.length,
    confirmed: privateGuests.filter(g => g.rsvp === "ACCEPTED").length,
    pending: privateGuests.filter(g => g.rsvp === "PENDING").length,
    declined: privateGuests.filter(g => g.rsvp === "DECLINED").length,
  };

  const linkStats = {
    total: rsvpResponses.length,
    attending: rsvpResponses.filter(r => r.attending).length,
    notAttending: rsvpResponses.filter(r => !r.attending).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Guest List</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? "Cancel" : "Add Guest"}
        </Button>
      </div>

      {showForm && (
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
                  {privateGuests.map((guest) => {
                    const hasInviteBeenSent = (guest.invites?.length ?? 0) > 0;
                    const isRsvpAccepted = guest.rsvp === "ACCEPTED";
                    return (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell className="text-muted-foreground">{guest.email}</TableCell>
                        <TableCell>
                          {(guest.invites?.length ?? 0) > 0 ? (
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
                        <TableCell>{getStatusBadge(
                          guest.rsvp === "ACCEPTED"
                            ? "confirmed"
                            : guest.rsvp === "DECLINED"
                              ? "declined"
                              : "pending"
                        )
                        }</TableCell>
                        <TableCell className="text-right space-x-2">
                          {(guest.invites?.length ?? 0) === 0 && (
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
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={hasInviteBeenSent}
                            title={
                              hasInviteBeenSent
                                ? "Editing is disabled after an invite is sent"
                                : "Edit guest"
                            }
                            onClick={() => openEditGuest(guest)}
                          >
                            <FileEdit className="h-3 w-3" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={
                              isDeleting === guest.id ||
                              hasInviteBeenSent ||
                              isRsvpAccepted
                            }
                            title={
                              hasInviteBeenSent
                                ? "Cannot delete a guest after an invite is sent"
                                : isRsvpAccepted
                                  ? "Cannot delete a guest who has accepted the invitation"
                                  : "Delete guest"
                            }
                            onClick={() => setConfirmDeleteGuest(guest)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                        <TableCell className="font-medium">{response.name}</TableCell>
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
export default Guests;
