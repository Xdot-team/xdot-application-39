
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';

import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Documents from "./pages/Documents";
import Estimating from "./pages/Estimating";
import Field from "./pages/Field";
import Finance from "./pages/Finance";
import Assets from "./pages/Assets";
import Workforce from "./pages/Workforce";
import Safety from "./pages/Safety";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/estimating" element={<Estimating />} />
              <Route path="/field" element={<Field />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/workforce" element={<Workforce />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
