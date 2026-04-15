import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";


const Dashboard = () => {
  const [data, setData] = useState<any | null>(null);
  const [hasWedding, setHasWedding] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/dashboard");

        if (!res.data.hasWedding) {
          setHasWedding(false);
          setData(null);
          return;
        }

        setHasWedding(true);
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  if (loading) {
    return <div className="text-muted-foreground">Loading dashboard...</div>;
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


  const stats = [
    {
      title: "Days Until Wedding",
      value: data.wedding.daysRemaining.toString(),
      description: new Date(data.wedding.date).toLocaleDateString(),
      icon: Calendar,
    },
    {
      title: "Budget Remaining",
      value: `$${data.budget.remaining.toLocaleString()}`,
      description: `$${data.budget.total.toLocaleString()} total budget`,
      icon: DollarSign,
    },
    {
      title: "Guest RSVPs",
      value: `${data.guests.responded} / ${data.guests.total}`,
      description: `${Math.round(
        (data.guests.responded / Math.max(data.guests.total, 1)) * 100
      )}% responded`,
      icon: Users,
    },
    {
      title: "Tasks Completed",
      value: `${data.tasks.completed} / ${data.tasks.total}`,
      description: `${Math.round(
        (data.tasks.completed / Math.max(data.tasks.total, 1)) * 100
      )}% complete`,
      icon: CheckCircle,
    },
  ];


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back{data.user?.name ? `, ${data.user.name}` : ""}!
        </h2>
        <p className="text-muted-foreground">Here's an overview of your wedding planning progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
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

        <Card>
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

export default Dashboard;
