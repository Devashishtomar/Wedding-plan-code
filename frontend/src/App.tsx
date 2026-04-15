import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeddingGuard } from "@/utils/weddingGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WeddingSetup from "./pages/WeddingSetup";
import Checklist from "./pages/Checklist";
import Guests from "./pages/Guests";
import PublicRSVP from "./pages/PublicRSVP";
import Invitations from "./pages/Invitations";
import Budget from "./pages/Budget";
import AIAssistant from "./pages/AIAssistant";
import AccountSettings from "./pages/AccountSettings";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wedding-setup" element={<WeddingSetup />} />
          <Route path="/rsvp/:token" element={<PublicRSVP />} />

          {/* App pages with sidebar layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<WeddingGuard><Dashboard /></WeddingGuard>} />
            <Route path="/checklist" element={<WeddingGuard><Checklist /></WeddingGuard>} />
            <Route path="/guests" element={<WeddingGuard><Guests /></WeddingGuard>} />
            <Route path="/invitations" element={<WeddingGuard><Invitations /></WeddingGuard>} />
            <Route path="/budget" element={<WeddingGuard><Budget /></WeddingGuard>} />
            <Route path="/assistant" element={<WeddingGuard><AIAssistant /></WeddingGuard>} />
            <Route path="/account" element={<AccountSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
