import { useEffect, useRef, useState } from "react";
import { sendAIMessage } from "@/services/ai.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "setup-form";
}

const suggestedQuestions = [
  "What should I do next?",
  "Is my budget okay?",
  "What am I missing?",
  "How far along am I?",
];


const AIAssistant = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI wedding planning assistant. I can help you plan tasks, manage your budget, track guests, and answer any questions about your wedding. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");


  const handleSend = async (text: string = input) => {
    if (!text.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const aiResponse = await sendAIMessage(text);

      if (aiResponse.type === "MESSAGE") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: aiResponse.content,
          },
        ]);
      }

      if (aiResponse.type === "PROPOSE_ACTION") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: aiResponse.message,
          },
        ]);
      }
    } catch {
      toast({
        title: "AI error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);


  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b shrink-0 flex flex-row items-center justify-between">
          <CardTitle>AI Wedding Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                <p className="text-sm italic opacity-70">Thinking…</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Chat input - always visible */}
        <div className="border-t p-4 shrink-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                disabled={isThinking}
                onClick={() => handleSend(question)}
              >
                {question}
              </Button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isThinking ? "AI is thinking..." : "Type your message..."}
              className="flex-1"
              disabled={isThinking}
            />
            <Button type="submit" size="icon" disabled={isThinking}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div >
  );
};

export default AIAssistant;
