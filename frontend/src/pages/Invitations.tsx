import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { FieldStyles, FieldName } from "@/types/invitation";
import { CustomInvitationData } from "@/types/customInvitation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Pencil, Sparkles, PaintBucket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useEvent } from "@/contexts/EventContext";
import { usePermissions } from "@/hooks/usePermissions";

import TemplateGallery from "@/components/invitations/TemplateGallery";
import TemplateEditor from "@/components/invitations/TemplateEditor";
import { CustomEditorPage } from "@/components/invitations/custom-editor";

const CUSTOM_INVITATION_STORAGE_KEY = "custom_invitation_data";

type InvitationResponse = {
  invitation: {
    id: string;
    templateId: string;
    token: string;
    isCustom?: boolean;
    canvasData?: any[];
    customBackground?: string;
    content: Record<string, string | null>;
    styles: FieldStyles;
    globalFontFamily?: string;
    updatedAt?: string;
  };
  template: {
    id: string;
    name: string;
    category: string;
    backgroundUrl: string;
    canvas: { width: number; height: number };
    textFields: {
      key: FieldName;
      default: {
        x: number;
        y: number;
        fontFamily: string;
        fontSize: number;
        color: string;
        bold?: boolean;
        align: "left" | "center" | "right";
        maxWidth?: number;
      };
      constraints: {
        fontSize: { min: number; max: number };
        yOffset: { min: number; max: number };
        allowBold: boolean;
      };
    }[];
  };
  resolvedFields: Record<string, any>;
};

const Invitations = () => {
  const { toast } = useToast();
  const { setOpen } = useSidebar();

  const { selectedEventId, setSelectedEventId, events, selectedEvent, viewMode } = useEvent();
  const { canEditCombinedView: canManageInvitations, role, side } = usePermissions();

  const [copied, setCopied] = useState(false);
  const [allInvitations, setAllInvitations] = useState<any[]>([]);
  const [showMasterSummary, setShowMasterSummary] = useState(false);
  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [savedCustomInvitation, setSavedCustomInvitation] = useState<CustomInvitationData | null>(null);

  const [view, setView] = useState<"gallery" | "editor" | "share" | "custom-editor">("gallery");
  const [loading, setLoading] = useState(true);

  const getInvitationVisibility = () => {
    if (viewMode !== 'individual') return 'SHARED';

    if (role === 'BRIDE') return 'BRIDE_PRIVATE';
    if (role === 'GROOM') return 'GROOM_PRIVATE';
    return side === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE';
  };

  const collapseSidebar = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const loadInvitations = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get(`/api/invitations/me?view=${viewMode === 'individual' ? 'PRIVATE' : 'SHARED'}`);
      if (res.data?.invitations) {
        setAllInvitations(res.data.invitations);
      }
    } catch (e) {
      console.error("Failed to load invitations", e);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations(true);
  }, [viewMode]);

  const prevFetchEventRef = useRef(selectedEventId);
  useEffect(() => {
    if (prevFetchEventRef.current !== selectedEventId) {
      prevFetchEventRef.current = selectedEventId;
      loadInvitations(true);
    }
  }, [selectedEventId]);

  const prevEventIdRef = useRef(selectedEventId);

  useEffect(() => {
    const targetEventId = selectedEventId === 'all' ? null : selectedEventId;
    const currentInv = allInvitations.find((inv: any) => inv.invitation.eventId === targetEventId);

    // Check if the user ACTUALLY changed events in the dropdown
    const isEventChange = prevEventIdRef.current !== selectedEventId;
    prevEventIdRef.current = selectedEventId;

    // FIXED: Immediately clear stale data on event switch for a snappy UI
    if (isEventChange) {
      setInvitation(null);
      setSavedCustomInvitation(null);
    }

    if (currentInv) {
      setInvitation(currentInv);

      // Map custom DB data securely
      if (currentInv.invitation.isCustom) {
        let parsedData: any = { elements: [] };
        if (typeof currentInv.invitation.canvasData === 'string') {
          try { parsedData = JSON.parse(currentInv.invitation.canvasData); } catch (e) { parsedData = { elements: [] }; }
        } else if (currentInv.invitation.canvasData) {
          parsedData = currentInv.invitation.canvasData;
        }

        const elements = Array.isArray(parsedData) ? parsedData : (parsedData.elements || []);
        const canvasSize = parsedData.canvasSize || { width: 800, height: 1200 };
        const backgroundColor = parsedData.backgroundColor || "#ffffff";

        setSavedCustomInvitation({
          id: currentInv.invitation.id,
          name: "My Custom Design",
          createdAt: currentInv.invitation.createdAt || new Date().toISOString(),
          updatedAt: currentInv.invitation.updatedAt || new Date().toISOString(),
          elements,
          canvasSize,
          backgroundColor,
          border: parsedData.border,
          backgroundImage: currentInv.invitation.customBackground
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${currentInv.invitation.customBackground}`
            : undefined,
          backgroundOpacity: 1,
        });
      }

      // FIXED: If switching to "All Events", ALWAYS route to the Grid
      if (isEventChange) {
        if (selectedEventId === 'all') {
          setView("gallery");
          setShowMasterSummary(false);
        } else {
          setView("share");
        }
      } else {
        setView(prev => prev === "gallery" && selectedEventId !== 'all' ? "share" : prev);
      }
    } else {
      setInvitation(null);
      setSavedCustomInvitation(null);

      if (isEventChange) {
        setView("gallery");
        setShowMasterSummary(false);
      } else {
        setView(prev => prev === "share" ? "gallery" : prev);
      }
    }

    if (isEventChange) setShowMasterSummary(false); // Reset grid interceptor on event change
  }, [selectedEventId, allInvitations]);

  const handleSelectTemplate = async (templateId: string) => {
    try {
      if (invitation?.invitation?.id) {
        const res = await api.patch(
          `/api/invitations/${invitation.invitation.id}`,
          {
            templateId,
            styles: {},
          }
        );
        setInvitation(res.data);
        setSelectedTemplateId(templateId);
        setView("editor");
        return;
      }

      const res = await api.post("/api/invitations", {
        templateId,
        eventId: selectedEventId === 'all' ? null : selectedEventId,
        visibility: getInvitationVisibility(),
      });

      await loadInvitations();
      setSelectedTemplateId(templateId);
      setView("editor");
    } catch (e) {
      console.error("Failed to select template", e);
    }
  };

  const handleSave = async (payload: {
    templateId: string;
    content: Record<string, string>;
    styles: FieldStyles;
    globalFontFamily?: string;
  }) => {
    if (!invitation) return;

    try {
      const res = await api.patch(
        `/api/invitations/${invitation.invitation.id}`,
        payload
      );

      setInvitation(res.data);
      setView("share");
    } catch (e) {
      console.error("Failed to save invitation", e);
    }
  };

  const handleEdit = () => {
    if (invitation) {
      if (invitation.invitation.isCustom) {
        setView("custom-editor");
      } else {
        setView("editor");
      }
    }
  };

  const handleChangeTemplate = () => {
    setView("gallery");
  };

  const safeEventName = selectedEvent?.name
    ? selectedEvent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'all-events';

  const invitationLink = invitation
    ? `${window.location.origin}/rsvp/${invitation.invitation.token}?event=${safeEventName}`
    : "";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "The invitation link has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!invitation) return;

    const link = invitationLink;
    const names = invitation.invitation.content.names?.trim();
    const date = invitation.invitation.content.date?.trim();

    let message = "You're invited to our wedding!\n\n";

    if (names) {
      message = `You're invited to ${names}'s wedding!\n\n`;
    }
    if (date) {
      message += `Date: ${date}\n\n`;
    }

    message += `RSVP HERE:\n${link}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ---------------------------------------------------------
  // VIEWS
  // ---------------------------------------------------------

  if (loading) {
    return <div>Loading...</div>;
  }

  // FIXED: The "All Events" Grid Law
  // Intercepts the view if the user is on "All Events" and looking at the gallery
  if (selectedEventId === 'all' && !showMasterSummary && view === "gallery") {
    const masterInvite = allInvitations.find((inv: any) => !inv.invitation.eventId);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Invitations</h1>
            <p className="text-muted-foreground">Manage invitations across your entire wedding.</p>
          </div>
          {!masterInvite && canManageInvitations && (
            <Button onClick={() => setShowMasterSummary(true)}>
              <PaintBucket className="h-4 w-4 mr-2" />
              Create Master Invitation
            </Button>
          )}
        </div>

        {allInvitations.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 border-dashed">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ExternalLink className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Invitations Yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Switch to a specific event using the dropdown above, or create a Master Invitation for the entire wedding.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allInvitations
              .filter((inv: any, index: number, self: any[]) =>
                index === self.findIndex((t) => t.invitation.eventId === inv.invitation.eventId)
              )
              .map((inv: any) => {
                const evt = events.find((e: any) => e.id === inv.invitation.eventId); const evtName = evt?.name || "All Events (Master)";

                const safeName = evt?.name
                  ? evt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  : 'all-events';
                const linkUrl = `${window.location.origin}/rsvp/${safeName}/${inv.invitation.token}`;

                return (
                  <Card
                    key={inv.invitation.id}
                    className="group cursor-pointer hover:shadow-md transition-all border-primary/10 hover:border-primary/30 flex flex-col"
                    onClick={() => {
                      // FIXED: Teleporter logic!
                      if (!evt) {
                        setShowMasterSummary(true);
                        setView("share");
                      } else {
                        setSelectedEventId(evt.id);
                      }
                    }}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative rounded-t-xl border-b">
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/invitations/${inv.invitation.id}/render?t=${new Date(inv.invitation.updatedAt || Date.now()).getTime()}`}
                        alt={evtName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <div className="bg-background/90 text-foreground text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                          {inv.invitation.isCustom ? "Custom" : "Template"}
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{evtName}</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <p className="text-xs text-muted-foreground truncate mb-4" title={linkUrl}>
                        {linkUrl}
                      </p>
                      <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Manage Invitation
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  // View 1: Custom Editor
  if (view === "custom-editor") {
    return (
      <CustomEditorPage
        onBack={() => {
          setOpen(true);
          loadInvitations();
          // Actually exit the editor view!
          setView(selectedEventId === 'all' ? "gallery" : "share");
        }}
        initialData={savedCustomInvitation || undefined}
        onCollapseSidebar={collapseSidebar}
      />
    );
  }

  // View 2: Gallery
  if (view === "gallery") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Design Your Invitation</h1>
            <p className="text-muted-foreground">
              Choose a template or create your own custom design from scratch
            </p>
          </div>
          <div className="flex gap-2">
            {invitation && (
              <Button variant="outline" onClick={() => setView("share")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Saved Invitation
              </Button>
            )}
          </div>
        </div>

        {/* Create Your Own Section */}
        <Card
          className="border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/60 transition-colors cursor-pointer group"
          onClick={() => setView("custom-editor")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PaintBucket className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold">Create Your Own</h3>
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    New
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Build a completely custom invitation from scratch. Add text, images, shapes, borders, and style everything your way.
                </p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span>✓ Custom fonts & colors</span>
                  <span>✓ Upload your photos</span>
                  <span>✓ Decorative shapes</span>
                  <span>✓ Full control</span>
                </div>
              </div>
              <Button size="lg" className="shrink-0">
                Start Creating
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground font-medium">or choose a template</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={selectedTemplateId || invitation?.invitation?.templateId}
        />
      </div>
    );
  }

  // View 3: Standard Editor
  if (view === "editor" && invitation) {
    return (
      <TemplateEditor
        template={invitation.template}
        initialData={{
          id: invitation.invitation.id,
          templateId: invitation.invitation.templateId,
          content: {
            title: invitation.invitation.content.title ?? "",
            names: invitation.invitation.content.names ?? "",
            message: invitation.invitation.content.message ?? "",
            date: invitation.invitation.content.date ?? "",
            time: invitation.invitation.content.time ?? "",
            venue: invitation.invitation.content.venue ?? "",
            rsvpDate: invitation.invitation.content.rsvpDate ?? "",
          },
          styles: invitation.invitation.styles,
          globalFontFamily: invitation.invitation.globalFontFamily,
        }}
        onBack={() => setView("gallery")}
        onSave={handleSave}
      />
    );
  }

  // View 4: Share View (after saving standard templates)
  // View 4: Share View (after saving standard templates)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {selectedEvent ? `${selectedEvent.name} Invitation` : "Master Invitation"}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* FIXED: Back to Grid Button */}
          {selectedEventId === 'all' && showMasterSummary && (
            <Button variant="outline" onClick={() => {
              setShowMasterSummary(false);
              setView("gallery");
            }}>
              Back to Grid
            </Button>
          )}
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Invitation
          </Button>
          <Button variant="outline" onClick={handleChangeTemplate}>
            Change Template
          </Button>
          <Link to={invitationLink} target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview RSVP Page
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invitation Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {invitation && (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/invitations/${invitation.invitation.id}/render?t=${new Date(invitation.invitation.updatedAt || Date.now()).getTime()}`}
                alt="Invitation Preview"
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg border border-border bg-white"
              />
            )}
          </CardContent>
        </Card>

        {/* Share Card */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Invitation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 bg-muted rounded-lg text-sm text-muted-foreground truncate">
                {invitationLink}
              </div>
              <Button onClick={handleCopyLink} className="shrink-0">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with your guests so they can view your beautiful invitation and RSVP online.
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleShareWhatsApp}
            >
              Share on WhatsApp
            </Button>

            <p className="text-xs text-muted-foreground">
              Opens WhatsApp so you can choose who to send this invitation to.
            </p>

            <div className="pt-4 space-y-3">
              <h3 className="font-medium">Invitation Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {invitation?.invitation.isCustom ? "Custom Design" : "Template"}
                  </p>
                </div>
                {!invitation?.invitation.isCustom && (
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">
                      {invitation?.template?.category}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {invitation?.invitation.content?.date || "Not set yet"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {invitation?.invitation.content?.time || "Not set yet"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Copy the invitation link above</li>
            <li>Share it with your guests via email, text, or social media</li>
            <li>Guests will see your beautiful invitation and can RSVP</li>
            <li>Their responses will appear in your Guest List</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invitations;