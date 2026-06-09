import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Heart, LayoutDashboard, Settings, Users, Mail, DollarSign, MessageCircle, CheckSquare, User, LogOut, Edit, Store, Sparkles, LayoutGrid } from "lucide-react";
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
import { useEvent } from "@/contexts/EventContext";
import WeddingSetup from "@/pages/WeddingSetup";
import EventSelector from "./EventSelector";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Checklist", path: "/checklist", icon: CheckSquare },
  { label: "Guests", path: "/guests", icon: Users },
  { label: "Invitations", path: "/invitations", icon: Mail },
  { label: "Budget", path: "/budget", icon: DollarSign },
  { label: "Inspiration", path: "/inspiration", icon: Sparkles },
  { label: "Planner", path: "/planner", icon: LayoutGrid },
  { label: "Marketplace", path: "/marketplace", icon: Store },
  { label: "AI Assistant", path: "/assistant", icon: MessageCircle },
];

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const queryClient = useQueryClient();
  const { viewMode, selectedEventId } = useEvent();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <Heart className="h-6 w-6 shrink-0 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-sidebar-foreground"> Wedding Planner</span>
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
                      <Link
                        to={item.path}
                      >
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
  const queryClient = useQueryClient();
  const [editWeddingOpen, setEditWeddingOpen] = useState(false);

  const { data: weddingRes } = useQuery({
    queryKey: ['wedding-me'],
    queryFn: async () => {
      const res = await api.get("/api/weddings/me");
      return res.data;
    }
  });

  useEffect(() => {
    const savedCurrency = localStorage.getItem("app_currency");
    const locationString = weddingRes?.wedding?.location?.toLowerCase();

    if (!savedCurrency && locationString) {
      if (
        locationString.includes("india") ||
        locationString.includes("delhi") ||
        locationString.includes("mumbai") ||
        locationString.includes("bangalore") ||
        locationString.includes("hyderabad") ||
        locationString.includes("chennai") ||
        locationString.includes("inr") ||
        locationString.includes("₹")
      ) {
        localStorage.setItem("app_currency", "INR");
      } else {
        localStorage.setItem("app_currency", "USD");
      }
      queryClient.invalidateQueries();
    }
  }, [weddingRes?.wedding?.location, queryClient]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // even if this fails, proceed with logout
    } finally {
      localStorage.clear();
      queryClient.clear();

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      window.location.href = "/login";
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
                <EventSelector />
              </div>

              <div className="flex items-center gap-4">
                <ThemeSwitcher align="end" />
                {/* ─── COUNTRY & REGION SELECT DROPDOWN ─── */}
                <div className="flex items-center gap-2 bg-muted/60 border border-border/50 rounded-xl px-3 py-1.5 h-9">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase hidden sm:inline">Region:</span>
                  <select
                    value={localStorage.getItem("app_currency") || "USD"}
                    onChange={(e) => {
                      localStorage.setItem("app_currency", e.target.value);
                      queryClient.invalidateQueries(); // Hot-flushes data cache
                      window.location.reload(); // Hard refresh to apply formatting instantly across all lists
                    }}
                    className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-foreground border-none p-0 select-none pr-1"
                  >
                    <option value="USD" className="bg-background text-foreground font-medium text-xs">🇺🇸 USA ($)</option>
                    <option value="INR" className="bg-background text-foreground font-medium text-xs">🇮🇳 India (₹)</option>
                  </select>
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
            initialData={{
              ...weddingRes?.wedding,
              role: weddingRes?.data?.memberContext?.role || weddingRes?.memberContext?.role
            }}
            onClose={() => setEditWeddingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AppLayout;
