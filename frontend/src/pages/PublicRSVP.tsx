import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Check } from "lucide-react";

const PublicRSVP = () => {
  const [name, setName] = useState("");
  const [rsvp, setRsvp] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [nameLocked, setNameLocked] = useState(false);
  const [mode, setMode] = useState<"public" | "private" | null>(null);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const invitationImageUrl = invitationId
    ? `${import.meta.env.VITE_API_URL}/api/public/invitations/${invitationId}/render`
    : null;


  useEffect(() => {
    if (!token) {
      setLoading(false);
      alert("Invalid RSVP link");
      return;
    }

    const validateRSVP = async () => {
      try {
        const res = await api.get(`/api/rsvp/validate/${token}`);

        setMode(res.data.mode);
        setInvitationId(res.data.invitation?.invitationId);

        if (res.data.mode === "private") {
          setName(res.data.guest.name);
          setNameLocked(true);
          setAlreadyResponded(!!res.data.alreadyResponded);
        }

        setLoading(false);
      } catch {
        setLoading(false);
        alert("Invalid or expired RSVP link");
      }
    };

    validateRSVP();
  }, [token]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !mode) {
      alert("Invalid RSVP state");
      return;
    }

    if (mode === "public") {
      await api.post(`/api/rsvp/${token}`, {
        name,
        response: rsvp,
      });
    } else {
      await api.post(`/api/rsvp/tracked/${token}`, {
        response: rsvp,
      });
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground">
              Your RSVP has been submitted successfully.
              {rsvp === "yes" && " We can't wait to celebrate with you!"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (mode === "private" && alreadyResponded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">RSVP Received</h2>
            <p className="text-muted-foreground">
              Your response has already been recorded.
              Thank you for letting us know!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">

          {/* LEFT: Invitation Preview */}
          {invitationImageUrl && (
            <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
              <img
                src={invitationImageUrl}
                alt="Wedding Invitation"
                className="w-full max-w-[420px] rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* RIGHT: RSVP Card */}
          <div className="flex justify-center w-full lg:w-1/2">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">You're Invited!</CardTitle>
                <CardDescription>
                  Please let us know if you'll be joining us on our special day.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Your Name</Label>
                    <Input
                      id="guestName"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={nameLocked}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Will you be attending?</Label>
                    <RadioGroup value={rsvp} onValueChange={setRsvp} className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="cursor-pointer flex-1">
                          Yes, I'll be there!
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="cursor-pointer flex-1">
                          Sorry, I can't make it
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full" disabled={!name || !rsvp}>
                    Submit RSVP
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );

};

export default PublicRSVP;
