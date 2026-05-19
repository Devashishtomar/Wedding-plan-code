import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, ChevronRight, ChevronDown, Trash2, CalendarIcon, Flag } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEvent } from "@/contexts/EventContext";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";

type Priority = "high" | "medium" | "low";

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  visibility: string;
  subtasks: SubTask[];
  dueDate?: Date;
  priority: Priority;
}

const priorityColors: Record<Priority, string> = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-amber-500 text-white",
  low: "bg-muted text-muted-foreground",
};

const priorityLabels: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const Checklist = () => {
  const { toast } = useToast();
  const { canEditCombinedView: canManageTasks, role } = usePermissions();
  const queryClient = useQueryClient();
  const DEFAULT_CATEGORIES = [
    "Planning", "Venue", "Vendors", "Entertainment", "Attire",
    "Invitations", "Travel", "Logistics", "Events", "Legal"
  ];
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");
  // FIXED: Deleted newTaskVisibility. Handled automatically now.
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [addingSubtaskTo, setAddingSubtaskTo] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newTaskId, setNewTaskId] = useState<string>("none");
  const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);
  const { selectedEventId, viewMode, selectedEvent, events } = useEvent();

  // FIXED: Get Wedding ID securely
  const { data: weddingRes } = useQuery<any>({ queryKey: ['wedding-me'] });
  const weddingId = weddingRes?.data?.wedding?.id;

  // FIXED: Pure Query - No localized setState traps!
  const { data: checklistData, isLoading } = useQuery({
    queryKey: ['checklist', viewMode, selectedEventId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', viewMode === 'individual' ? 'PRIVATE' : 'SHARED');
      if (selectedEventId && selectedEventId !== 'all') {
        params.append('eventId', selectedEventId);
      }
      const res = await api.get(`/api/checklist?${params.toString()}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  // FIXED: Extract tasks properly
  const tasks: Task[] = checklistData?.tasks || [];

  // --- ACTIONS ---
  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const isCompleting = !task?.completed;

      // 1. Toggle the main task
      await api.patch(`/api/checklist/${taskId}/toggle`);

      // 2. Cascade Rule: If closing the main task, close all unclosed subtasks with it
      if (task && isCompleting) {
        for (const st of task.subtasks) {
          if (!st.completed) {
            await api.patch(`/api/checklist/subtasks/${st.id}/toggle`);
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['checklist'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch {
      toast({ title: "Failed to update task", variant: "destructive" });
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const subtask = task?.subtasks.find(st => st.id === subtaskId);
      const isCompletingSubtask = !subtask?.completed;

      // 1. Toggle the subtask
      await api.patch(`/api/checklist/subtasks/${subtaskId}/toggle`);

      // 2. Cascade Rule: If closing a subtask, and it's the ONLY subtask, close the main task too
      if (task && isCompletingSubtask && task.subtasks.length === 1 && !task.completed) {
        await api.patch(`/api/checklist/${taskId}/toggle`);
        await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }

      await queryClient.invalidateQueries({ queryKey: ['checklist'] });
    } catch {
      toast({ title: "Failed to update subtask", variant: "destructive" });
    }
  };

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) newExpanded.delete(taskId);
    else newExpanded.add(taskId);
    setExpandedTasks(newExpanded);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !newTaskCategory) return;

    const visibility = viewMode === 'individual'
      ? (role === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE')
      : 'SHARED';

    const resolvedEventId = selectedEventId === 'all'
      ? (newTaskId === "none" ? null : newTaskId)
      : selectedEventId;

    try {
      await api.post("/api/checklist", {
        title: newTaskTitle.trim(),
        category: newTaskCategory,
        dueDate: newTaskDueDate,
        priority: newTaskPriority,
        visibility: visibility,
        eventId: resolvedEventId,
      });

      await queryClient.invalidateQueries({ queryKey: ['checklist'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      setNewTaskTitle("");
      setNewTaskCategory("");
      setNewTaskDueDate(undefined);
      setNewTaskPriority("medium");
      setShowAddForm(false);
      toast({ title: "Task added successfully" });
    } catch {
      toast({ title: "Failed to add task", variant: "destructive" });
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !allAvailableCategories.includes(newCategoryName.trim())) {
      setCustomCategories([...customCategories, newCategoryName.trim()]);
      setNewCategoryName("");
      setShowAddCategory(false);
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;
    try {
      await api.post(`/api/checklist/${taskId}/subtasks`, { title: newSubtaskTitle.trim() });
      await queryClient.invalidateQueries({ queryKey: ['checklist'] });
      setNewSubtaskTitle("");
      setAddingSubtaskTo(null);
      setExpandedTasks(new Set([...expandedTasks, taskId]));
    } catch {
      toast({ title: "Failed to add subtask", variant: "destructive" });
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await api.delete(`/api/checklist/subtasks/${subtaskId}`);
      await queryClient.invalidateQueries({ queryKey: ['checklist'] });
    } catch {
      toast({ title: "Failed to delete subtask", variant: "destructive" });
    }
  };

  const handleDeleteTask = async () => {
    if (!confirmDeleteTask) return;
    try {
      await api.delete(`/api/checklist/${confirmDeleteTask.id}`);
      await queryClient.invalidateQueries({ queryKey: ['checklist'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setConfirmDeleteTask(null);
      toast({ title: "Task deleted" });
    } catch {
      toast({ title: "Failed to delete task", variant: "destructive" });
    }
  };

  const updateTaskDueDate = async (taskId: string, date: Date | undefined) => {
    await api.patch(`/api/checklist/${taskId}`, { dueDate: date });
    await queryClient.invalidateQueries({ queryKey: ['checklist'] });
  };

  const updateTaskPriority = async (taskId: string, priority: Priority) => {
    await api.patch(`/api/checklist/${taskId}`, { priority });
    await queryClient.invalidateQueries({ queryKey: ['checklist'] });
  };

  const getAllSubtasksCount = () => tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
  const getCompletedSubtasksCount = () => tasks.reduce((acc, task) => acc + task.subtasks.filter(st => st.completed).length, 0);

  const getDueDateStatus = (dueDate?: Date) => {
    if (!dueDate) return null;
    if (isPast(dueDate) && !isToday(dueDate)) return "overdue";
    if (isToday(dueDate)) return "today";
    return "upcoming";
  };

  const completedCount = tasks.filter((t) => t.completed).length + getCompletedSubtasksCount();
  const totalCount = tasks.length + getAllSubtasksCount();
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const usedCategories: string[] = Array.from(new Set(tasks.map((t) => t.category)));

  const allAvailableCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...usedCategories, ...customCategories]));

  if (isLoading && !checklistData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-muted rounded" />
          <div className="h-10 w-32 bg-muted rounded" />
        </div>
        <div className="h-24 bg-muted rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Wedding Checklist</h1>
            <p className="text-muted-foreground">
              {viewMode === 'individual' && selectedEvent
                ? `Tasks specific to ${selectedEvent.name}`
                : "All planning tasks for your wedding journey."}
            </p>
          </div>
          <div className="flex gap-2">
            {canManageTasks && (
              <>
                <Button variant="outline" onClick={() => { setShowAddCategory(!showAddCategory); setShowAddForm(false); }}>
                  {showAddCategory ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {showAddCategory ? "Cancel" : "Add Category"}
                </Button>
                <Button onClick={() => { setShowAddForm(!showAddForm); setShowAddCategory(false); }}>
                  {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {showAddForm ? "Cancel" : "Add Task"}
                </Button>
              </>
            )}
          </div>
        </div>

        {showAddCategory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddCategory} disabled={!newCategoryName.trim() || allAvailableCategories.includes(newCategoryName.trim())}>
                  Add Category
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Existing:</span>
                {allAvailableCategories.map((cat) => (
                  <span key={cat} className="text-xs bg-muted px-2 py-1 rounded-full">{cat}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {allAvailableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full sm:w-48 justify-start text-left font-normal",
                          !newTaskDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTaskDueDate ? format(newTaskDueDate, "PPP") : "Due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTaskDueDate}
                        onSelect={setNewTaskDueDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as Priority)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Flag className="h-3 w-3 text-destructive" />
                          High Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Flag className="h-3 w-3 text-amber-500" />
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Flag className="h-3 w-3 text-muted-foreground" />
                          Low Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {/* FIXED: Only ask for the Event if the user is in "All Events" view! */}
                  {viewMode === 'collaborative' && selectedEventId === 'all' && (
                    <Select value={newTaskId} onValueChange={setNewTaskId}>
                      <SelectTrigger className="w-full sm:w-48 h-10">
                        <SelectValue placeholder="Event" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="none">General Wedding</SelectItem>
                        {events.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button onClick={handleAddTask} disabled={!newTaskTitle.trim() || !newTaskCategory}>
                    Add Task
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedCount} of {totalCount} items completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {usedCategories.map((category) => (
            <Card key={category}>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {tasks
                    .filter((task) => task.category === category)
                    .sort((a, b) => {
                      const eventA = (a as any).event?.name || "General Wedding";
                      const eventB = (b as any).event?.name || "General Wedding";
                      return eventA.localeCompare(eventB);
                    })
                    .map((task) => {
                      const dueDateStatus = getDueDateStatus(task.dueDate);
                      return (
                        <li key={task.id} className="space-y-1">
                          <div className="flex items-start gap-2">
                            {task.subtasks.length > 0 ? (
                              <button
                                onClick={() => toggleExpanded(task.id)}
                                className="p-0.5 hover:bg-muted rounded mt-0.5"
                              >
                                {expandedTasks.has(task.id) ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            ) : (
                              <div className="w-5" />
                            )}
                            <Checkbox
                              id={task.id}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <label
                                  htmlFor={task.id}
                                  className={cn(
                                    "text-sm cursor-pointer",
                                    task.completed && "line-through text-muted-foreground"
                                  )}
                                >
                                  {task.title}
                                </label>
                                {selectedEventId === 'all' && (
                                  <Badge variant="outline" className={cn(
                                    "text-[9px] uppercase font-bold py-0 h-4 border-primary/20",
                                    (task as any).eventId ? "bg-primary/5 text-primary" : "bg-muted text-muted-foreground"
                                  )}>
                                    {(task as any).event?.name || "General Wedding"}
                                  </Badge>
                                )}
                                {task.subtasks.length > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                                  </span>
                                )}
                                <Badge
                                  variant="secondary"
                                  className={cn("text-xs h-5", priorityColors[(task.priority || "medium").toLowerCase() as Priority])}
                                >
                                  {priorityLabels[(task.priority || "medium").toLowerCase() as Priority]}
                                </Badge>
                              </div>
                              {task.dueDate && (
                                <div className={cn(
                                  "text-xs mt-1 flex items-center gap-1",
                                  dueDateStatus === "overdue" && !task.completed && "text-destructive",
                                  dueDateStatus === "today" && !task.completed && "text-amber-600",
                                  (dueDateStatus === "upcoming" || task.completed) && "text-muted-foreground"
                                )}>
                                  <CalendarIcon className="h-3 w-3" />
                                  {dueDateStatus === "overdue" && !task.completed && "Overdue: "}
                                  {dueDateStatus === "today" && !task.completed && "Due today: "}
                                  {format(task.dueDate, "MMM d, yyyy")}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {canManageTasks && (
                                <>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                      <Calendar
                                        mode="single"
                                        selected={task.dueDate}
                                        onSelect={(date) => updateTaskDueDate(task.id, date)}
                                        initialFocus
                                        className="p-3 pointer-events-auto"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <Flag className={cn(
                                          "h-3.5 w-3.5",
                                          (task.priority || "").toLowerCase() === "high" && "text-destructive",
                                          (task.priority || "").toLowerCase() === "medium" && "text-amber-500",
                                          (task.priority || "").toLowerCase() === "low" && "text-muted-foreground"
                                        )} />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-36 p-1" align="end">
                                      <div className="space-y-1">
                                        {(["high", "medium", "low"] as Priority[]).map((p) => (
                                          <button
                                            key={p}
                                            onClick={() => updateTaskPriority(task.id, p.toUpperCase() as Priority)}
                                            className={cn(
                                              "w-full text-left px-2 py-1.5 text-sm rounded flex items-center gap-2 hover:bg-muted",
                                              (task.priority || "").toLowerCase() === p && "bg-muted"
                                            )}
                                          >
                                            <Flag className={cn(
                                              "h-3 w-3",
                                              p === "high" && "text-destructive",
                                              p === "medium" && "text-amber-500",
                                              p === "low" && "text-muted-foreground"
                                            )} />
                                            {priorityLabels[p]}
                                          </button>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setAddingSubtaskTo(addingSubtaskTo === task.id ? null : task.id);
                                      setNewSubtaskTitle("");
                                    }}
                                    className="h-7 px-2 text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Subtask
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setConfirmDeleteTask(task)}
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    title="Delete task"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {addingSubtaskTo === task.id && (
                            <div className="ml-10 flex gap-2 py-2">
                              <Input
                                placeholder="Subtask title"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                className="h-8 text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(task.id)}
                              />
                              <Button size="sm" className="h-8" onClick={() => handleAddSubtask(task.id)}>
                                Add
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => { setAddingSubtaskTo(null); setNewSubtaskTitle(""); }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {task.subtasks.length > 0 && (
                            <Collapsible open={expandedTasks.has(task.id)}>
                              <CollapsibleContent>
                                <ul className="ml-10 mt-1 space-y-1 border-l-2 border-muted pl-4">
                                  {task.subtasks.map((subtask) => (
                                    <li key={subtask.id} className="flex items-center gap-2">
                                      <Checkbox
                                        checked={subtask.completed}
                                        onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                                      />
                                      <span className={cn(
                                        "text-sm flex-1",
                                        subtask.completed && "line-through text-muted-foreground"
                                      )}>
                                        {subtask.title}
                                      </span>
                                      {/* FIXED: RBAC Check - Only authorized users can delete subtasks */}
                                      {canManageTasks && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                          onClick={() => deleteSubtask(task.id, subtask.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!confirmDeleteTask} onOpenChange={() => setConfirmDeleteTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDeleteTask?.title}</span>?
              This will also delete all subtasks and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteTask}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Checklist;
