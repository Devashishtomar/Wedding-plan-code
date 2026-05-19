import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useEvent } from "@/contexts/EventContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { selectedEventId, viewMode, selectedEvent } = useEvent();
  const { isCouple } = usePermissions();
  const queryClient = useQueryClient();

  const [showPrivateSetup, setShowPrivateSetup] = useState(false);
  const [privateDate, setPrivateDate] = useState("");
  const [privateBudget, setPrivateBudget] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePrivateSetup = async () => {
    setIsSaving(true);
    try {
      await api.patch("/api/weddings/private-setup", { date: privateDate, budget: privateBudget });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setShowPrivateSetup(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ['dashboard', viewMode, selectedEventId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('view', viewMode === 'collaborative' ? 'SHARED' : 'PRIVATE');

      if (selectedEventId && selectedEventId !== 'all') {
        params.append('eventId', selectedEventId);
      }

      const res = await api.get(`/api/dashboard?${params.toString()}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const data = dashboardData?.data;
  const hasWedding = dashboardData?.hasWedding ?? true;

  if (isLoading && !dashboardData) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <div>Something went wrong loading your dashboard.</div>;
  }

  if (!hasWedding) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome!</h2>
        <p className="text-muted-foreground">
          Let’s start by setting up your wedding.
        </p>
        {/* Later: button → /wedding-setup */}
      </div>
    );
  }

  if (!data) {
    return <div>Something went wrong loading your dashboard.</div>;
  }

  const isDateSet = data.wedding.date !== null;
  const isBudgetSet = data.budget.target > 0;

  // LAYOUT 1: All Events View (4 Cards)
  const allEventsStats = [
    {
      title: "Days Until Event",
      value: isDateSet ? data.wedding.daysRemaining?.toString() || "0" : "-",
      description: isDateSet ? new Date(data.wedding.date).toLocaleDateString() : "Date not added",
      icon: Calendar,
    },
    {
      title: "Total Budget",
      value: isBudgetSet ? formatCurrency(data.budget.target) : "-",
      description: isBudgetSet ? `${formatCurrency(Math.max(0, data.budget.target - data.budget.allocated))} remaining to allocate` : "Budget not added",
      icon: DollarSign,
    },
    {
      title: "Guest RSVPs (Rollup)",
      value: `${data.guests.responded} / ${data.guests.total}`,
      description: data.guests.total > 0 ? `${Math.round((data.guests.responded / data.guests.total) * 100)}% responded` : 'No guests added',
      icon: Users,
    },
    {
      title: "Tasks Completed (Rollup)",
      value: `${data.tasks.completed} / ${data.tasks.total}`,
      description: data.tasks.total > 0 ? `${Math.round((data.tasks.completed / data.tasks.total) * 100)}% complete` : 'No tasks added',
      icon: CheckCircle,
    },
  ];

  // LAYOUT 2: Specific Event View (5 Cards)
  const specificEventStats = [
    {
      title: "Days Until Event",
      value: isDateSet ? data.wedding.daysRemaining?.toString() || "0" : "-",
      description: isDateSet ? new Date(data.wedding.date).toLocaleDateString() : "Date not added",
      icon: Calendar,
    },
    {
      title: "Budget Remaining",
      value: formatCurrency(Math.max(0, data.budget.allocated - data.budget.spent)),
      description: `${formatCurrency(data.budget.spent)} spent so far`,
      icon: DollarSign,
    },
    {
      title: "Event Budget",
      value: formatCurrency(data.budget.allocated),
      description: "Total budget for this event",
      icon: DollarSign,
    },
    {
      title: "Guest RSVPs",
      value: `${data.guests.responded} / ${data.guests.total}`,
      description: data.guests.total > 0 ? `${Math.round((data.guests.responded / data.guests.total) * 100)}% responded` : 'No guests added',
      icon: Users,
    },
    {
      title: "Tasks Completed",
      value: `${data.tasks.completed} / ${data.tasks.total}`,
      description: data.tasks.total > 0 ? `${Math.round((data.tasks.completed / data.tasks.total) * 100)}% complete` : 'No tasks added',
      icon: CheckCircle,
    },
  ];

  // Dynamically select which array of cards to show
  const activeStats = selectedEventId === 'all' ? allEventsStats : specificEventStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back{data.user?.name ? `, ${data.user.name}` : ""}!
          </h2>
          <p className="text-muted-foreground mt-1">
            {viewMode === 'individual' && selectedEvent
              ? `Viewing planning details for ${selectedEvent.name}.`
              : "Here's an overview of your entire wedding planning progress."}
          </p>
        </div>
        {viewMode === 'individual' && selectedEvent && (
          <Badge variant="outline" className="px-4 py-1 text-sm font-bold bg-primary/5 text-primary border-primary/20">
            {selectedEvent.name} Focus Mode
          </Badge>
        )}
      </div>

      {/* Private Workspace Setup Banner */}
      {viewMode === 'individual' && selectedEventId === 'all' && (!isDateSet || !isBudgetSet) && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-primary">Set Up Your Private Space</h4>
            <p className="text-sm text-muted-foreground">Add your private overall budget and final date to track your personal goals.</p>
          </div>
          {isCouple && (
            <Button onClick={() => setShowPrivateSetup(true)}>Setup Details</Button>
          )}
        </div>
      )}

      {/* Private Setup Dialog Form */}
      <Dialog open={showPrivateSetup} onOpenChange={setShowPrivateSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Private Space Setup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Private Final Date</Label>
              <Input type="date" value={privateDate} onChange={(e) => setPrivateDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Private Total Budget</Label>
              <Input type="number" placeholder="e.g. 50000" value={privateBudget} onChange={(e) => setPrivateBudget(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleSavePrivateSetup} disabled={!privateDate || !privateBudget || isSaving}>
              {isSaving ? "Saving..." : "Save Private Details"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dynamic Grid: Renders exactly what activeStats tells it to (4 or 5 cards) */}
      <div className={cn("grid gap-4", selectedEventId === 'all' ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-5")}>
        {activeStats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-gradient-to-br from-card to-muted/10 overflow-hidden group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><stat.icon className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NEW: Event Allocations List (Only visible in 'All Events' view) */}
      {selectedEventId === 'all' && (
        <Card className="border-none shadow-sm mt-2">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <CardTitle className="text-lg">Event Budget Allocations</CardTitle>
            <p className="text-sm text-muted-foreground font-medium">Total Allocated Rollup: <span className="text-primary font-bold">{formatCurrency(data.budget.allocated)}</span></p>
          </CardHeader>
          <CardContent className="pt-4">
            {data.budget.eventAllocations?.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.budget.eventAllocations.map((event: any, i: number) => (
                  <li key={i} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <span className="font-medium text-sm">{event.name}</span>
                    <span className="font-bold text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">{formatCurrency(event.budget)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No events have been created yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.tasks.upcoming.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  No upcoming tasks in the next 7 days
                </li>
              )}

              {data.tasks.upcoming.map((task: any) => (
                <li key={task.id} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{task.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.recentActivity.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  No activity today.
                </li>
              )}

              {data.recentActivity.map((activity: any, idx: number) => (
                <li key={idx} className="text-sm">
                  <span className="text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                  <p>{activity.message}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  </div>
);

export default Dashboard;
