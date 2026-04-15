import { useState, useEffect } from "react";
import { api } from "@/lib/api";
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Planning", "Venue", "Vendors", "Entertainment", "Attire",
    "Invitations", "Travel", "Logistics", "Events", "Legal"
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [addingSubtaskTo, setAddingSubtaskTo] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [weddingId, setWeddingId] = useState<string | null>(null);


  useEffect(() => {
    const loadChecklist = async () => {
      const weddingRes = await api.get("/api/weddings/me");
      if (!weddingRes.data.wedding) return;

      const id = weddingRes.data.wedding.id;
      setWeddingId(id);

      const checklistRes = await api.get(`/api/checklist/${id}`);
      setTasks(
        checklistRes.data.tasks.map((task: any) => ({
          ...task,
          subtasks: task.subtasks ?? [],
        }))
      );
    };

    loadChecklist();
  }, []);


  const toggleTask = async (taskId: string) => {
    const res = await api.patch(`/api/checklist/${taskId}/toggle`);

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...res.data.task, subtasks: task.subtasks ?? [] }
        : task
    ));
  };


  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const res = await api.patch(`/api/checklist/subtasks/${subtaskId}/toggle`);

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st =>
            st.id === subtaskId ? res.data.subtask : st
          ),
          completed:
            task.subtasks.length > 0 &&
            task.subtasks.every(st =>
              st.id === subtaskId
                ? res.data.subtask.completed
                : st.completed
            ),
        };
      }
      return task;
    }));
  };


  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !newTaskCategory || !weddingId) return;

    const res = await api.post("/api/checklist", {
      weddingId,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
    });

    setTasks([
      ...tasks,
      {
        ...res.data.task,
        subtasks: [], // ✅ GUARANTEE SHAPE
      },
    ]);

    setNewTaskTitle("");
    setNewTaskCategory("");
    setNewTaskDueDate(undefined);
    setNewTaskPriority("medium");
    setShowAddForm(false);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName("");
      setShowAddCategory(false);
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;

    const res = await api.post(`/api/checklist/${taskId}/subtasks`, {
      title: newSubtaskTitle.trim(),
    });

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: [...task.subtasks, res.data.subtask] }
        : task
    ));

    setNewSubtaskTitle("");
    setAddingSubtaskTo(null);
    setExpandedTasks(new Set([...expandedTasks, taskId]));
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    await api.delete(`/api/checklist/subtasks/${subtaskId}`);

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) }
        : task
    ));
  };

  const updateTaskDueDate = async (taskId: string, date: Date | undefined) => {
    const res = await api.patch(`/api/checklist/${taskId}`, {
      dueDate: date,
    });

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...res.data.task, subtasks: task.subtasks ?? [] }
        : task
    ));
  };

  const updateTaskPriority = async (taskId: string, priority: Priority) => {
    const res = await api.patch(`/api/checklist/${taskId}`, {
      priority,
    });

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...res.data.task, subtasks: task.subtasks ?? [] }
        : task
    ));
  };

  const getAllSubtasksCount = () => {
    return tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
  };

  const getCompletedSubtasksCount = () => {
    return tasks.reduce((acc, task) =>
      acc + task.subtasks.filter(st => st.completed).length, 0
    );
  };

  const getDueDateStatus = (dueDate?: Date) => {
    if (!dueDate) return null;
    if (isPast(dueDate) && !isToday(dueDate)) return "overdue";
    if (isToday(dueDate)) return "today";
    return "upcoming";
  };

  const completedCount = tasks.filter((t) => t.completed).length + getCompletedSubtasksCount();
  const totalCount = tasks.length + getAllSubtasksCount();
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const usedCategories = [...new Set(tasks.map((t) => t.category))];

  if (!weddingId) {
    return <div>Loading checklist…</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Wedding Checklist</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowAddCategory(!showAddCategory); setShowAddForm(false); }}>
            {showAddCategory ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showAddCategory ? "Cancel" : "Add Category"}
          </Button>
          <Button onClick={() => { setShowAddForm(!showAddForm); setShowAddCategory(false); }}>
            {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showAddForm ? "Cancel" : "Add Task"}
          </Button>
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
              <Button onClick={handleAddCategory} disabled={!newCategoryName.trim() || categories.includes(newCategoryName.trim())}>
                Add Category
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Existing:</span>
              {categories.map((cat) => (
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
                    {categories.map((cat) => (
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
                              {task.subtasks.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                                </span>
                              )}
                              <Badge
                                variant="secondary"
                                className={cn("text-xs h-5", priorityColors[task.priority])}
                              >
                                {priorityLabels[task.priority]}
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
                                    task.priority === "high" && "text-destructive",
                                    task.priority === "medium" && "text-amber-500",
                                    task.priority === "low" && "text-muted-foreground"
                                  )} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-36 p-1" align="end">
                                <div className="space-y-1">
                                  {(["high", "medium", "low"] as Priority[]).map((p) => (
                                    <button
                                      key={p}
                                      onClick={() => updateTaskPriority(task.id, p)}
                                      className={cn(
                                        "w-full text-left px-2 py-1.5 text-sm rounded flex items-center gap-2 hover:bg-muted",
                                        task.priority === p && "bg-muted"
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
                                  <li key={subtask.id} className="flex items-center gap-2 group">
                                    <Checkbox
                                      id={subtask.id}
                                      checked={subtask.completed}
                                      onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                                    />
                                    <label
                                      htmlFor={subtask.id}
                                      className={`text-sm cursor-pointer flex-1 ${subtask.completed ? "line-through text-muted-foreground" : ""
                                        }`}
                                    >
                                      {subtask.title}
                                    </label>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteSubtask(task.id, subtask.id)}
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
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
  );
};

export default Checklist;
