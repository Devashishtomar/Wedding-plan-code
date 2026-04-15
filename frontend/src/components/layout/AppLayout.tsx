import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Heart, LayoutDashboard, Settings, Users, Mail, DollarSign, MessageCircle, CheckSquare, User, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import WeddingSetup from "@/pages/WeddingSetup";


const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Checklist", path: "/checklist", icon: CheckSquare },
  { label: "Guests", path: "/guests", icon: Users },
  { label: "Invitations", path: "/invitations", icon: Mail },
  { label: "Budget", path: "/budget", icon: DollarSign },
  { label: "AI Assistant", path: "/assistant", icon: MessageCircle },
];

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <Heart className="h-6 w-6 shrink-0 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-sidebar-foreground">AI Wedding Planner</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editWeddingOpen, setEditWeddingOpen] = useState(false);
  const [weddingData, setWeddingData] = useState<any>(null);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const res = await api.get("/api/weddings/me");
        setWeddingData(res.data.wedding);
      } catch { }
    };

    fetchWedding();
  }, []);


  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // even if this fails, proceed with logout
    } finally {
      localStorage.removeItem("wedding_invitation_message");
      localStorage.removeItem("wedding_details");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      navigate("/login");
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem("sidebar_open");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebar_open", String(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">
                  {location.pathname === "/account"
                    ? "Account Settings"
                    : navItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
                </h1>
              </div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Manage your account settings
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEditWeddingOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Wedding Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Edit Wedding Details Dialog */}
      <Dialog open={editWeddingOpen} onOpenChange={setEditWeddingOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <WeddingSetup
            isEditing
            initialData={weddingData}
            onClose={() => setEditWeddingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AppLayout;
