import { useState } from "react";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Pencil, Check } from "lucide-react";

interface BudgetCategory {
  id: string;
  category: string;
  estimated: number;
  actual: number;
}

/* const initialCategories: BudgetCategory[] = [
  { id: "1", name: "Venue", estimated: 8000, actual: 7500 },
  { id: "2", name: "Catering", estimated: 6000, actual: 4500 },
  { id: "3", name: "Photography", estimated: 3000, actual: 0 },
  { id: "4", name: "Videography", estimated: 2000, actual: 0 },
  { id: "5", name: "Flowers", estimated: 1500, actual: 500 },
  { id: "6", name: "Music/DJ", estimated: 1500, actual: 0 },
  { id: "7", name: "Attire", estimated: 2000, actual: 1800 },
  { id: "8", name: "Invitations", estimated: 500, actual: 200 },
  { id: "9", name: "Transportation", estimated: 500, actual: 0 },
];
 */
const Budget = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEstimated, setNewEstimated] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editActual, setEditActual] = useState("");
  const [weddingId, setWeddingId] = useState<string | null>(null);

  const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimated, 0);
  const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
  const remaining = totalEstimated - totalActual;
  const spentPercentage = totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const loadBudget = async () => {
      // 1. Get wedding
      const weddingRes = await api.get("/api/weddings/me");

      if (!weddingRes.data.wedding) return;

      const id = weddingRes.data.wedding.id;
      setWeddingId(id);

      // 2. Get budget items
      const budgetRes = await api.get(`/api/budgets/${id}`);
      setCategories(budgetRes.data.items);
    };

    loadBudget();
  }, []);

  const handleAddCategory = async () => {
    if (!newName.trim() || !newEstimated || !weddingId) return;

    const res = await api.post("/api/budgets", {
      weddingId,
      category: newName.trim(),
      estimated: Number(newEstimated),
    });

    setCategories([...categories, res.data.item]);
    setNewName("");
    setNewEstimated("");
    setShowAddForm(false);
  };

  const handleEditActual = async (id: string) => {
    if (editActual === "") return;

    const res = await api.patch(`/api/budgets/${id}`, {
      actual: Number(editActual),
    });

    setCategories(categories.map(cat =>
      cat.id === id ? res.data.item : cat
    ));

    setEditingId(null);
    setEditActual("");
  };

  const startEditing = (category: BudgetCategory) => {
    setEditingId(category.id);
    setEditActual(category.actual.toString());
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm("Delete this budget category?");
    if (!confirmed) return;

    await api.delete(`/api/budgets/${id}`);
    setCategories(categories.filter(cat => cat.id !== id));
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wedding Budget</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showAddForm ? "Cancel" : "Add Category"}
        </Button>
      </div>

      {showAddForm && (
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
                className="w-full sm:w-40"
              />
              <Button onClick={handleAddCategory} disabled={!newName.trim() || Number(newEstimated) <= 0}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(totalEstimated)}</div>
            <p className="text-sm text-muted-foreground">Total Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalActual)}</div>
            <p className="text-sm text-muted-foreground">Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-destructive"}`}>
              {formatCurrency(remaining)}
            </div>
            <p className="text-sm text-muted-foreground">Remaining</p>
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
              {totalEstimated === 0
                ? "No budget added yet"
                : `${formatCurrency(totalActual)} spent`}
            </span>
            <span>
              {totalEstimated === 0
                ? formatCurrency(0)
                : `${Math.round(spentPercentage)}% of budget`}
            </span>
          </div>
          <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">Click the pencil icon to update actual spending</p>
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
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const catRemaining = category.estimated - category.actual;
                const catProgress = (category.actual / category.estimated) * 100;
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(category.estimated)}</TableCell>
                    <TableCell className="text-right">
                      {editingId === category.id ? (
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
                          <Button size="sm" variant="ghost" onClick={() => startEditing(category)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
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
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budget;
