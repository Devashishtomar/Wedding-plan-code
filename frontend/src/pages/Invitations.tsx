import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FieldStyles, FieldName } from "@/types/invitation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import TemplateGallery from "@/components/invitations/TemplateGallery";
import TemplateEditor from "@/components/invitations/TemplateEditor";


type InvitationResponse = {
  invitation: {
    id: string;
    templateId: string;
    token: string;
    content: Record<string, string | null>;
    styles: FieldStyles;
    globalFontFamily?: string;
  };
  template: {
    id: string;
    name: string;
    category: string;
    backgroundUrl: string;
    canvas: {
      width: number;
      height: number;
    };
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
  const [copied, setCopied] = useState(false);
  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [view, setView] = useState<"gallery" | "editor" | "share">("gallery");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const res = await api.get("/api/invitations/me");

        if (res.data?.invitation) {
          setInvitation(res.data);
          setView("share");
        } else {
          setView("gallery");
        }
      } catch (e) {
        console.error("Failed to load invitation", e);
        setView("gallery");
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, []);


  const handleSelectTemplate = async (templateId: string) => {
    try {
      // 🟢 CASE 1: Invitation already exists → UPDATE template
      if (invitation?.invitation?.id) {
        const res = await api.patch(
          `/api/invitations/${invitation.invitation.id}`,
          {
            templateId,
            // reset styles so new template defaults apply
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
      });

      setInvitation(res.data);
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
      setView("editor");
    }
  };

  const handleChangeTemplate = () => {
    setView("gallery");
  };

  const invitationLink = invitation
    ? `${window.location.origin}/rsvp/${invitation.invitation.token}`
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

    const link = `${window.location.origin}/rsvp/${invitation.invitation.token}`;

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


  // Gallery View
  if (view === "gallery") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Choose Your Invitation Template</h1>
            <p className="text-muted-foreground">
              Select from 50 beautiful templates to create your perfect wedding invitation
            </p>
          </div>
          {invitation && (
            <Button variant="outline" onClick={() => setView("share")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Saved Invitation
            </Button>
          )}
        </div>
        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={selectedTemplateId}
        />
      </div>
    );
  }

  // Editor View
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

  if (loading) {
    return <div>Loading...</div>;
  }

  // Share View (after saving)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Invitation</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Invitation
          </Button>
          <Button variant="outline" onClick={handleChangeTemplate}>
            Change Template
          </Button>
          <Link to={`/rsvp/${invitation.invitation.token}`} target="_blank">
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
            {invitation?.template && invitation && (
              <img
                src={`${import.meta.env.VITE_API_URL}/api/invitations/${invitation.invitation.id}/render`}
                alt="Invitation Preview"
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
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
                  <p className="text-muted-foreground">Template</p>
                  <p className="font-medium">{invitation.invitation.templateId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">
                    {invitation.template.category}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {invitation.invitation.content.date || "Not set yet"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {invitation.invitation.content.time || "Not set yet"}
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
