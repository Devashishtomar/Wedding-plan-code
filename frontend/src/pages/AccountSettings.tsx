import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Bell, Users, Trash2, Camera, Edit } from "lucide-react";
import EventManagement from "@/components/settings/EventManagement";

interface WeddingMember {
  id: string;
  role: string;
  side: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const AccountSettings = () => {
  const { toast } = useToast();

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  /*   // Password state
    const [passwords, setPasswords] = useState({
      current: "",
      new: "",
      confirm: "",
    });
  
    // Notification preferences
    const [notifications, setNotifications] = useState({
      emailReminders: true,
      taskDeadlines: true,
      guestRsvp: true,
      budgetAlerts: false,
      weeklyDigest: true,
    }); */

  const [myContext, setMyContext] = useState<any>(null);
  const [members, setMembers] = useState<WeddingMember[]>([]);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("FAMILY");
  const [invitePermissions, setInvitePermissions] = useState({
    canEditCombinedView: false,
    canEditGuests: false,
    canManageBudget: false,
    canManageEvents: false,
  });
  const [editingMember, setEditingMember] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get('/api/weddings/me');
        const myUser = meRes.data.memberContext?.user || {};

        const nameParts = (myUser.name || "").split(" ");
        setProfile({
          name: myUser.name || "",
          email: myUser.email || "",
        });
        setMyContext(meRes.data.memberContext);

        const memRes = await api.get('/api/weddings/members');
        setMembers(memRes.data.members);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleProfileSave = () => {
    toast({
      title: "Profile info",
      description: "Your profile information is handled securely by the backend.",
    });
  };

  /* const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }
    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    setPasswords({ current: "", new: "", confirm: "" });
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });
  };

  const handleNotificationsSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };
 */

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim() || !invitePassword.trim() || !inviteRole) {
      toast({ title: "Missing fields", description: "All fields are absolutely required.", variant: "destructive" });
      return;
    }

    try {
      await api.post('/api/auth/collaborator', {
        name: inviteName,
        email: inviteEmail,
        password: invitePassword,
        role: inviteRole,
        side: myContext?.side || null,
        permissions: invitePermissions,
      });

      toast({ title: "Collaborator added", description: "They can now log in using the provided credentials." });

      // Refresh the list
      const res = await api.get('/api/weddings/members');
      setMembers(res.data.members);

      // Reset form
      setInviteName(""); setInviteEmail(""); setInvitePassword("");
    } catch (err: any) {
      toast({
        title: "Failed to add collaborator",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveInvite = async (memberId: string) => {
    try {
      await api.delete(`/api/weddings/members/${memberId}`);
      setMembers(members.filter((m) => m.id !== memberId));
      toast({ title: "Collaborator removed", description: "Their workspace access has been revoked." });
    } catch (err: any) {
      toast({
        title: "Failed to remove",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMember = async (memberId: string) => {
    try {
      await api.patch(`/api/weddings/members/${memberId}`, {
        role: editingMember.role,
        permissions: {
          canEditCombinedView: editingMember.canEditCombinedView,
          canEditGuests: editingMember.canEditGuests,
          canManageBudget: editingMember.canManageBudget,
          canManageEvents: editingMember.canManageEvents,
        }
      });

      setMembers(members.map(m => m.id === memberId ? { ...m, ...editingMember } : m));
      setEditingMember(null);
      toast({ title: "Member updated successfully." });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "fiancé":
        return "default";
      case "parent":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Cannot be changed)</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <Button onClick={handleProfileSave}>Save Changes</Button>
        </CardContent>
      </Card>
 */}
      {/* Event Management Section */}
      <EventManagement />

      {/* Password Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handlePasswordChange}>Update Password</Button>
        </CardContent>
      </Card>
 */}
      {/* Invite Collaborators Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite Collaborators
          </CardTitle>
          <CardDescription>
            Invite your fiancé, parents, or other family members to help plan the wedding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Collaborator Name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@address.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <Input type="text" placeholder="Set a temporary password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2">
                <select className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="FAMILY">Family Member</option>
                  <option value="OTHER">Planner</option>
                  <option value="BRIDE">Bride</option>
                  <option value="GROOM">Groom</option>
                </select>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Their view side will be automatically linked to your side.
              </p>
            </div>

            {inviteRole !== "BRIDE" && inviteRole !== "GROOM" && (
              <div className="md:col-span-2 mt-4 space-y-4 border-t pt-4 border-primary/10">
                <Label className="text-sm font-bold">Custom Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                    <Label className="text-xs">Manage Guests</Label>
                    <Switch checked={invitePermissions.canEditGuests} onCheckedChange={(c) => setInvitePermissions({ ...invitePermissions, canEditGuests: c })} />
                  </div>
                  <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                    <Label className="text-xs">Manage Budget</Label>
                    <Switch checked={invitePermissions.canManageBudget} onCheckedChange={(c) => setInvitePermissions({ ...invitePermissions, canManageBudget: c })} />
                  </div>
                  <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                    <Label className="text-xs">Manage Events/Schedule</Label>
                    <Switch checked={invitePermissions.canManageEvents} onCheckedChange={(c) => setInvitePermissions({ ...invitePermissions, canManageEvents: c })} />
                  </div>
                  <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                    <Label className="text-xs">Edit Global Checklist</Label>
                    <Switch checked={invitePermissions.canEditCombinedView} onCheckedChange={(c) => setInvitePermissions({ ...invitePermissions, canEditCombinedView: c })} />
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 mt-4">
              <Button onClick={handleInvite} className="w-full">
                <Users className="h-4 w-4 mr-2" /> Add Team Member
              </Button>
            </div>
          </div>

          {members.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Workspace Team</h4>
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col p-3 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                            {member.user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">{member.user.name}</p>
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0">{member.role}</Badge>
                            {member.side && <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">{member.side} SIDE</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditingMember(editingMember?.id === member.id ? null : member)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemoveInvite(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Inline Editor */}
                    {editingMember?.id === member.id && (
                      <div className="mt-4 pt-4 border-t border-primary/10 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                            <Label className="text-xs">Manage Guests</Label>
                            <Switch checked={editingMember.canEditGuests} onCheckedChange={(c) => setEditingMember({ ...editingMember, canEditGuests: c })} />
                          </div>
                          <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                            <Label className="text-xs">Manage Budget</Label>
                            <Switch checked={editingMember.canManageBudget} onCheckedChange={(c) => setEditingMember({ ...editingMember, canManageBudget: c })} />
                          </div>
                          <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                            <Label className="text-xs">Manage Events</Label>
                            <Switch checked={editingMember.canManageEvents} onCheckedChange={(c) => setEditingMember({ ...editingMember, canManageEvents: c })} />
                          </div>
                          <div className="flex items-center justify-between bg-background p-2 rounded-lg border">
                            <Label className="text-xs">Edit Global Checklist</Label>
                            <Switch checked={editingMember.canEditCombinedView} onCheckedChange={(c) => setEditingMember({ ...editingMember, canEditCombinedView: c })} />
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleUpdateMember(member.id)} className="w-full">Save Changes</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive email reminders for upcoming tasks
              </p>
            </div>
            <Switch
              checked={notifications.emailReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailReminders: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Task Deadline Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when task deadlines are approaching
              </p>
            </div>
            <Switch
              checked={notifications.taskDeadlines}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, taskDeadlines: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Guest RSVP Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when guests respond to invitations
              </p>
            </div>
            <Switch
              checked={notifications.guestRsvp}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, guestRsvp: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get alerts when you're approaching budget limits
              </p>
            </div>
            <Switch
              checked={notifications.budgetAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, budgetAlerts: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your wedding planning progress
              </p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyDigest: checked })
              }
            />
          </div>
          <Button onClick={handleNotificationsSave} className="mt-4">
            Save Preferences
          </Button>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AccountSettings;
