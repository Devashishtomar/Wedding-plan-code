import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Calendar, DollarSign, MapPin, ArrowRight, XCircle, Trash2, Plus } from "lucide-react";
import { format, addMonths } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SuggestionViewProps {
  suggestion: any;
  onAccept: (modifiedSuggestion: any) => void;
  onSkip: () => void;
  loading: boolean;
}

const SuggestionView = ({ suggestion, onAccept, onSkip, loading }: SuggestionViewProps) => {
  const [checklist, setChecklist] = useState<any[]>(suggestion?.checklist || []);
  const [newTask, setNewTask] = useState({ title: "", category: "General", priority: "MEDIUM", monthsOffset: "6" });
  const [showAddForm, setShowAddForm] = useState(false);

  if (!suggestion) return null;

  const { budgetAllocation, suggestions } = suggestion;

  const handleDeleteTask = (index: number) => {
    setChecklist(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const calculatedDate = addMonths(new Date(), parseInt(newTask.monthsOffset) || 0);

    const task = {
      title: newTask.title.trim(),
      category: newTask.category,
      priority: newTask.priority,
      dueDate: calculatedDate.toISOString(),
      visibility: "SHARED",
    };

    setChecklist(prev => [...prev, task].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    setNewTask({ title: "", category: "General", priority: "MEDIUM", monthsOffset: "6" });
    setShowAddForm(false);
  };

  const handleAccept = () => {
    const modifiedSuggestion = {
      ...suggestion,
      checklist: checklist
    };
    onAccept(modifiedSuggestion);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-xl overflow-hidden glass-morphism my-8">
      <CardHeader className="bg-primary/5 text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-display text-primary">Your Personalized Plan is Ready!</CardTitle>
        <CardDescription className="text-lg">
          We've curated a timeline and budget. You can now customize your tasks before saving.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-10">
        {/* Budget Allocation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
            <DollarSign className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Budget Allocation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetAllocation.map((item: any) => (
              <div key={item.category} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-primary/5">
                <span className="font-medium text-sm">{item.category}</span>
                <div className="text-right">
                  <p className="font-bold text-primary">${item.estimated.toLocaleString()}</p>
                  <p className="text-[10px] opacity-60 font-bold uppercase tracking-wider">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2 text-primary border-b border-primary/10 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Your Wedding Checklist</h3>
            </div>
            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </Button>
          </div>

          {showAddForm && (
            <Card className="p-4 bg-muted/20 border-primary/10 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase opacity-50 ml-1">Task Title</p>
                  <Input
                    placeholder="e.g. Book DJ"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase opacity-50 ml-1">Category</p>
                  <Select value={newTask.category} onValueChange={v => setNewTask({ ...newTask, category: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["General", "Venue", "Catering", "Photography", "Outfits", "Legal", "Entertainment", "Invitations"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase opacity-50 ml-1">Priority</p>
                  <Select value={newTask.priority} onValueChange={v => setNewTask({ ...newTask, priority: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase opacity-50 ml-1">Due In (Months)</p>
                  <Input
                    type="number"
                    value={newTask.monthsOffset}
                    onChange={e => setNewTask({ ...newTask, monthsOffset: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAddTask}>Add to List</Button>
              </div>
            </Card>
          )}

          <ScrollArea className="h-[350px] w-full rounded-md border border-primary/10 p-4 bg-card/30">
            <div className="space-y-3 pr-4">
              {checklist.length === 0 ? (
                <div className="text-center py-10 opacity-50 italic">No tasks in your list. Add some to get started!</div>
              ) : (
                checklist.map((task: any, index: number) => (
                  <div key={`${task.title}-${index}`} className="group flex items-center gap-4 p-3 bg-card rounded-lg border border-primary/5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex-shrink-0 w-20 text-[10px] font-bold text-primary opacity-70 uppercase leading-tight">
                      {format(new Date(task.dueDate), "MMM yyyy")}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium leading-none mb-1">{task.title}</p>
                      <p className="text-[10px] opacity-50 uppercase tracking-tight">{task.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${task.priority === 'HIGH' ? 'bg-destructive/10 text-destructive' :
                        task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-secondary text-secondary-foreground'
                        }`}>
                        {task.priority}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteTask(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </section>

        {/* Venue/Vendor Suggestions */}
        <section className="space-y-4 p-5 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
            <MapPin className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Initial Suggestions</h3>
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="font-medium text-sm">Suggested Venue:</span>
              <span className="text-primary font-bold text-sm">{suggestions.venue}</span>
            </div>
            <p className="text-xs italic opacity-70 leading-relaxed bg-white/50 p-2 rounded border border-primary/5">
              {suggestions.vendorNote}
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            className="flex-1 h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? "Saving Plan..." : "Accept & Start Planning"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className="h-14 px-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            onClick={onSkip}
            disabled={loading}
          >
            <XCircle className="mr-2 h-5 w-5" />
            Skip Suggestion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionView;


