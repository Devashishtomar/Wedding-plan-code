import { useState } from "react";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Pencil, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEvent } from "@/contexts/EventContext";
import { cn, formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";

interface BudgetCategory {
  id: string;
  category: string;
  estimated: number;
  actual: number;
  eventId: string | null;
  visibility: string;
  event?: {
    name: string;
  };
}

interface EventBudget {
  id: string;
  name: string;
  budget: number;
}

const Budget = () => {
  const { canEditBudget: canManageBudget, role } = usePermissions();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEstimated, setNewEstimated] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editActual, setEditActual] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<string>("none");
  const { selectedEventId, viewMode, selectedEvent, events } = useEvent();
  const queryClient = useQueryClient();

  const isPrivate = viewMode === 'individual';

  const { data: dashData } = useQuery({
    queryKey: ['dashboard-target', viewMode],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', isPrivate ? 'PRIVATE' : 'SHARED');
      const res = await api.get(`/api/dashboard?${params.toString()}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const baseTargetBudget = dashData?.data?.budget?.target || 0;
  const weddingId = dashData?.data?.wedding?.id;

  const { data: budgetData, isLoading } = useQuery({
    queryKey: ['budget', viewMode, selectedEventId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', isPrivate ? 'PRIVATE' : 'SHARED');
      if (selectedEventId && selectedEventId !== 'all') {
        params.append('eventId', selectedEventId);
      }
      const url = `/api/budgets?${params.toString()}`;
      const res = await api.get(url);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  // Extract categories directly from the query data
  const categories: BudgetCategory[] = budgetData?.items || [];

  // Recalculate dynamically
  const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimated, 0);
  const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);

  const totalAllocatedBudget = selectedEventId !== 'all' && selectedEvent
    ? (selectedEvent.budget || 0)
    : baseTargetBudget;

  const remainingBuffer = totalAllocatedBudget - totalEstimated;
  const plannedPercentage = totalAllocatedBudget > 0 ? (totalEstimated / totalAllocatedBudget) * 100 : 0;

  const handleAddCategory = async () => {
    if (!newName.trim() || !newEstimated) return;

    const visibility = viewMode === 'individual'
      ? (role === 'BRIDE' ? 'BRIDE_PRIVATE' : 'GROOM_PRIVATE')
      : 'SHARED';

    const assignedEventId = selectedEventId === 'all'
      ? (newCategoryId === "none" ? null : newCategoryId)
      : selectedEventId;

    try {
      await api.post("/api/budgets", {
        category: newName.trim(),
        estimated: Number(newEstimated),
        eventId: assignedEventId,
        visibility: visibility,
      });

      await queryClient.invalidateQueries();

      setNewName("");
      setNewEstimated("");
      setShowAddForm(false);
      toast({ title: "Expense added successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to add budget category", variant: "destructive" });
    }
  };

  const handleEditActual = async (id: string) => {
    if (editActual === "") return;
    const newActual = Number(editActual);

    try {
      await api.patch(`/api/budgets/${id}`, { actual: newActual });
      await queryClient.invalidateQueries();
      setEditingId(null);
      setEditActual("");
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const startEditing = (category: BudgetCategory) => {
    setEditingId(category.id);
    setEditActual(category.actual.toString());
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm("Delete this budget item?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/budgets/${id}`);
      await queryClient.invalidateQueries();
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  if (isLoading && !budgetData) {
    return <BudgetSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Wedding Budget</h1>
          <p className="text-muted-foreground">
            {viewMode === 'individual' && selectedEvent
              ? `Budgeting for ${selectedEvent.name}`
              : "Consolidated budget across your entire wedding."}
          </p>
        </div>
        {/* FIXED: RBAC Check - Only authorized users see the Add button */}
        {canManageBudget && (
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showAddForm ? "Cancel" : "Add Category"}
          </Button>
        )}
      </div>

      {showAddForm && canManageBudget && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Budget Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Category name (e.g., Decorations)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Estimated budget"
                value={newEstimated}
                onChange={(e) => setNewEstimated(e.target.value)}
                className="w-full sm:w-32"
              />
              {selectedEventId === 'all' && (
                <Select value={newCategoryId} onValueChange={setNewCategoryId}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="Assign to Event" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">General Wedding</SelectItem>
                    {events.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleAddCategory} disabled={!newName.trim() || Number(newEstimated) <= 0}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(totalAllocatedBudget)}</div>
            <p className="text-sm text-muted-foreground">Allocated Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">{formatCurrency(totalEstimated)}</div>
            <p className="text-sm text-muted-foreground">Planned (Estimated)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalActual)}</div>
            <p className="text-sm text-muted-foreground">Spent (Actual)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${remainingBuffer >= 0 ? "text-green-600" : "text-destructive"}`}>
              {formatCurrency(remainingBuffer)}
            </div>
            <p className="text-sm text-muted-foreground">Remaining to Plan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {totalAllocatedBudget === 0
                ? "No budget allocated yet"
                : `${formatCurrency(totalEstimated)} planned of ${formatCurrency(totalAllocatedBudget)}`}
            </span>
            <span>
              {totalAllocatedBudget === 0
                ? "0%"
                : `${Math.round(plannedPercentage)}% planned`}
            </span>
          </div>
          <Progress value={Math.min(plannedPercentage, 100)} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed list of all expenses and categories</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Estimated</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="w-32">Progress</TableHead>
                {canManageBudget && <TableHead className="w-10"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const catRemaining = category.estimated - category.actual;
                const catProgress = (category.actual / category.estimated) * 100;
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{category.category}</span>
                        {selectedEventId === 'all' && (
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter mt-0.5",
                            category.eventId ? "text-primary opacity-70" : "text-muted-foreground"
                          )}>
                            {category.event?.name || "General Wedding"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(category.estimated)}</TableCell>
                    <TableCell className="text-right">
                      {editingId === category.id && canManageBudget ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            value={editActual}
                            onChange={(e) => setEditActual(e.target.value)}
                            className="w-24 h-8"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleEditActual(category.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {formatCurrency(category.actual)}
                          {/* FIXED: RBAC Check - Hide Edit button if no permission */}
                          {canManageBudget && (
                            <Button size="sm" variant="ghost" onClick={() => startEditing(category)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={catRemaining < 0 ? "text-destructive" : ""}>
                        {formatCurrency(catRemaining)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Progress value={Math.min(catProgress, 100)} className="h-2" />
                    </TableCell>
                    {/* FIXED: RBAC Check - Hide Delete button if no permission */}
                    {canManageBudget && (
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FIXED: Replaced undefined 'eventBudgets' with 'events' from Context, and restricted to 'All Events' view */}
      {selectedEventId === 'all' && events.length > 0 && (
        <Card className="border-primary/10">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">Event Budget Allocations</CardTitle>
            <p className="text-sm text-muted-foreground">Budgets assigned to specific wedding events</p>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-right">Allotted Budget</TableHead>
                  <TableHead className="text-right">Planned in Items</TableHead>
                  <TableHead className="text-right">Unplanned Buffer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const planned = categories
                    .filter(c => c.eventId === event.id)
                    .reduce((sum, c) => sum + c.estimated, 0);
                  const buffer = (event.budget || 0) - planned;

                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-bold">{event.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(event.budget || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(planned)}</TableCell>
                      <TableCell className="text-right">
                        <span className={buffer < 0 ? "text-destructive" : "text-green-600 font-medium"}>
                          {formatCurrency(buffer)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const BudgetSkeleton = () => (
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
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-96 w-full rounded-xl" />
  </div>
);

export default Budget;
