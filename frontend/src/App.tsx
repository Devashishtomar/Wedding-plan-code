import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeddingGuard } from "@/utils/weddingGuard";
import { Skeleton } from "@/components/ui/skeleton";


const BohoLanding = lazy(() => import("./pages/BohoLanding"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WeddingSetup = lazy(() => import("./pages/WeddingSetup"));
const Checklist = lazy(() => import("./pages/Checklist"));
const Guests = lazy(() => import("./pages/Guests"));
const PublicRSVP = lazy(() => import("./pages/PublicRSVP"));
const Invitations = lazy(() => import("./pages/Invitations"));
const Budget = lazy(() => import("./pages/Budget"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Inspiration = lazy(() => import("./pages/Inspiration"));
const Planner = lazy(() => import("./pages/Planner"));

// Marketplace pages
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));
const VendorListing = lazy(() => import("./pages/marketplace/VendorListing"));
const VendorDetails = lazy(() => import("./pages/marketplace/VendorDetails"));
const Shortlist = lazy(() => import("./pages/marketplace/Shortlist"));
const Compare = lazy(() => import("./pages/marketplace/Compare"));


import { EventProvider } from "@/contexts/EventContext";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

const ProtectedLayoutWrapper = () => (
  <EventProvider>
    <MarketplaceProvider>
      <AppLayout />
    </MarketplaceProvider>
  </EventProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<GlobalLoading />}>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<BohoLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wedding-setup" element={<WeddingSetup />} />
              <Route path="/rsvp/:token" element={<PublicRSVP />} />

              {/* App pages with sidebar layout */}
              <Route element={<ProtectedLayoutWrapper />}>
                <Route path="/dashboard" element={<WeddingGuard><Dashboard /></WeddingGuard>} />
                <Route path="/checklist" element={<WeddingGuard><Checklist /></WeddingGuard>} />
                <Route path="/guests" element={<WeddingGuard><Guests /></WeddingGuard>} />
                <Route path="/invitations" element={<WeddingGuard><Invitations /></WeddingGuard>} />
                <Route path="/budget" element={<WeddingGuard><Budget /></WeddingGuard>} />
                <Route path="/assistant" element={<WeddingGuard><AIAssistant /></WeddingGuard>} />
                <Route path="/account" element={<AccountSettings />} />
                <Route path="/inspiration" element={<WeddingGuard><Inspiration /></WeddingGuard>} />
                <Route path="/planner" element={<WeddingGuard><Planner /></WeddingGuard>} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/category/:categoryId" element={<VendorListing />} />
                <Route path="/marketplace/vendor/:vendorId" element={<VendorDetails />} />
                <Route path="/marketplace/shortlist" element={<Shortlist />} />
                <Route path="/marketplace/compare" element={<Compare />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider >
    </ThemeProvider>
  </QueryClientProvider >
);

const GlobalLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-4 w-48" />
  </div>
);

export default App;
