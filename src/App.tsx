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
import AdminDashboard from "./pages/AdminDashboard";
import AddNewLand from "./pages/AddNewLand";
import ViewAnalytics from "./pages/ViewAnalytics";
import UpdateProfile from "./pages/UpdateProfile";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import SchemesPage from "./pages/SchemesPage";
import ContactSupport from "./pages/ContactSupport";
import AddNewLandTest from "./pages/AddNewLandTest";
import VerificationManagement from "./pages/admin/VerificationManagement";
import UserManagement from "./pages/admin/UserManagement";
import AgreementManagement from "./pages/admin/AgreementManagement";
import NotificationSystem from "./pages/admin/NotificationSystem";
import IssueManagement from "./pages/admin/IssueManagement";
import PolicyManagement from "./pages/admin/PolicyManagement";
import AddOpportunity from "./pages/admin/AddOpportunity";
import MakeAgreement from "./pages/MakeAgreement";
import ErrorBoundary from "./components/ErrorBoundary";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/land" element={<Land />} />
          <Route path="/market" element={<Market />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/landowner-dashboard" element={<LandownerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/landowner/add-new-land" element={<AddNewLand />} />
          <Route path="/add-land" element={<AddNewLand />} />
          <Route path="/landowner/view-analytics" element={<ViewAnalytics />} />
          <Route path="/landowner/update-profile" element={<UpdateProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/test-add-land" element={<AddNewLandTest />} />
          <Route path="/make-agreement" element={<MakeAgreement />} />
          
          {/* Admin Management Routes */}
          <Route path="/admin/verification-management" element={<VerificationManagement />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/agreement-management" element={<AgreementManagement />} />
          <Route path="/admin/notification-system" element={<NotificationSystem />} />
          <Route path="/admin/issue-management" element={<IssueManagement />} />
          <Route path="/admin/policy-management" element={<PolicyManagement />} />
          <Route path="/admin/add-opportunity" element={<AddOpportunity />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Floating Chatbot - Available on all pages */}
        <FloatingChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
