import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Visibility from "./pages/Visibility";
import Ranking from "./pages/Ranking";
import Topics from "./pages/Topics";
import Competitors from "./pages/Competitors";
import Sentiment from "./pages/Sentiment";
import UploadPrompts from "./pages/UploadPrompts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<DashboardLayout><Overview /></DashboardLayout>} />
          <Route path="/visibility" element={<DashboardLayout><Visibility /></DashboardLayout>} />
          <Route path="/ranking" element={<DashboardLayout><Ranking /></DashboardLayout>} />
          <Route path="/topics" element={<DashboardLayout><Topics /></DashboardLayout>} />
          <Route path="/competitors" element={<DashboardLayout><Competitors /></DashboardLayout>} />
          <Route path="/sentiment" element={<DashboardLayout><Sentiment /></DashboardLayout>} />
          <Route path="/upload" element={<UploadPrompts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
