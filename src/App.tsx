import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingChatbot from "@/components/FloatingChatbot";
import Index from "./pages/Index";
import Land from "./pages/Land";
import Market from "./pages/Market";
import Tools from "./pages/Tools";
import Auth from "./pages/Auth";
import AuthForm from "./pages/AuthForm";
import RoleSelection from "./pages/RoleSelection";
import FarmerDashboard from "./pages/FarmerDashboard";
import LandownerDashboard from "./pages/LandownerDashboard";
import AddNewLand from "./pages/AddNewLand";
import ViewAnalytics from "./pages/ViewAnalytics";
import UpdateProfile from "./pages/UpdateProfile";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import SchemesPage from "./pages/SchemesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/land" element={<Land />} />
          <Route path="/market" element={<Market />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/landowner-dashboard" element={<LandownerDashboard />} />
          <Route path="/landowner/add-new-land" element={<AddNewLand />} />
          <Route path="/landowner/view-analytics" element={<ViewAnalytics />} />
          <Route path="/landowner/update-profile" element={<UpdateProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/schemes" element={<SchemesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Floating Chatbot - Available on all pages */}
        <FloatingChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
