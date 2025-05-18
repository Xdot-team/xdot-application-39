
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';

// Page imports
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import Documents from '@/pages/Documents';
import Field from '@/pages/Field';
import Finance from '@/pages/Finance';
import Assets from '@/pages/Assets';
import Workforce from '@/pages/Workforce';
import Safety from '@/pages/Safety';
import Schedule from '@/pages/Schedule';
import Survey from '@/pages/Survey';
import Organization from '@/pages/Organization';
import Reports from '@/pages/Reports';
import Admin from '@/pages/Admin';
import Estimating from '@/pages/Estimating';
import OutlookPluginPage from '@/pages/OutlookPlugin';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/estimating" element={<Estimating />} />
          <Route path="/field" element={<Field />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/outlook-plugin" element={<OutlookPluginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
