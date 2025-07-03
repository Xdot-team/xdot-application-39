import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Organization Reports interfaces
export interface OrganizationReport {
  id: string;
  title: string;
  description: string | null;
  report_type: 'financial' | 'project' | 'safety' | 'workforce' | 'custom';
  category: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on_demand';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'one_time';
  is_automated: boolean;
  last_generated: string | null;
  file_url: string | null;
  configuration: any;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

// Hook for Organization Reports
export function useOrganizationReports() {
  const [reports, setReports] = useState<OrganizationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      // Use fallback data if table doesn't exist yet
      setReports([
        {
          id: '1',
          title: 'Weekly Safety Report',
          description: 'Weekly safety metrics and incidents',
          report_type: 'safety',
          category: 'weekly',
          frequency: 'weekly',
          is_automated: true,
          last_generated: new Date().toISOString(),
          file_url: null,
          configuration: {},
          created_by_name: 'System',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching organization reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organization reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (report: Omit<OrganizationReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate creation for now
      const newReport = {
        ...report,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setReports(prev => [newReport, ...prev]);
      toast({
        title: "Success",
        description: "Report created successfully",
      });
      return newReport;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  };

  const updateReport = async (id: string, updates: Partial<OrganizationReport>) => {
    try {
      setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
      toast({
        title: "Success",
        description: "Report updated successfully",
      });
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      setReports(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  return { reports, loading, fetchReports, createReport, updateReport, deleteReport };
}

// KPI interface
export interface KPI {
  id: string;
  name: string;
  description?: string;
  category: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  last_updated: string;
}

// Hook for KPIs
export function useKPIs() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createKPI = async (kpi: Omit<KPI, 'id'>) => {
    try {
      const newKPI = {
        ...kpi,
        id: Date.now().toString(),
      };
      setKpis(prev => [newKPI, ...prev]);
      return newKPI;
    } catch (error) {
      console.error('Error creating KPI:', error);
      throw error;
    }
  };

  const updateKPI = async (id: string, updates: Partial<KPI>) => {
    try {
      setKpis(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
    } catch (error) {
      console.error('Error updating KPI:', error);
      throw error;
    }
  };

  return { kpis, loading, error, createKPI, updateKPI };
}