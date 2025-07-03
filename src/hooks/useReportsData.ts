import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CustomReport {
  id: string;
  title: string;
  description: string;
  report_type: string;
  configuration: any;
  created_by: string;
  is_public: boolean;
  tags: string[];
  version: number;
  template_id?: string;
  last_generated?: string;
  generated_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template_config: any;
  default_filters: any;
  default_visualizations: any;
  is_system_template: boolean;
  usage_count: number;
  created_by?: string;
  created_at: string;
}

export interface ReportSchedule {
  id: string;
  report_id: string;
  schedule_name: string;
  frequency: string;
  day_of_week?: number;
  day_of_month?: number;
  time_of_day?: string;
  recipients: string[];
  last_sent?: string;
  next_scheduled?: string;
  status: string;
  failure_count: number;
}

export interface ReportMetric {
  id: string;
  metric_name: string;
  category: string;
  data_source: string;
  description: string;
  unit: string;
  aggregation_type: string;
  calculation_formula?: string;
  is_active: boolean;
}

export interface ReportFilter {
  id: string;
  filter_name: string;
  report_id: string;
  field_name: string;
  operator: string;
  filter_value: any;
  is_required: boolean;
}

export interface ReportVisualization {
  id: string;
  report_id: string;
  visualization_type: string;
  title: string;
  metrics: string[];
  configuration: any;
  position_order: number;
}

export function useCustomReports() {
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (report: Omit<CustomReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('custom_reports')
        .insert(report)
        .select()
        .single();

      if (error) throw error;
      await fetchReports();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateReport = async (id: string, updates: Partial<CustomReport>) => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchReports();
    } catch (err) {
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchReports();
    } catch (err) {
      throw err;
    }
  };

  const generateReport = async (id: string) => {
    try {
      // Update last_generated timestamp and increment count
      const { error } = await supabase
        .from('custom_reports')
        .update({ 
          last_generated: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await fetchReports();
      
      // Here you would implement actual report generation logic
      return { success: true, message: 'Report generated successfully' };
    } catch (err) {
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport
  };
}

export function useReportTemplates() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const createTemplate = async (template: Omit<ReportTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      await fetchTemplates();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ReportTemplate>) => {
    try {
      const { error } = await supabase
        .from('report_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  };

  const useTemplate = async (id: string) => {
    try {
      // Get current template
      const { data: template } = await supabase
        .from('report_templates')
        .select('usage_count')
        .eq('id', id)
        .single();

      // Increment usage count
      const { error } = await supabase
        .from('report_templates')
        .update({ usage_count: (template?.usage_count || 0) + 1 })
        .eq('id', id);

      if (error) throw error;
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  };

  return {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    useTemplate
  };
}

export function useReportSchedules() {
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('report_schedules')
        .select(`
          *,
          custom_reports (
            title,
            report_type
          )
        `)
        .order('next_scheduled', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const createSchedule = async (schedule: Omit<ReportSchedule, 'id' | 'created_at' | 'updated_at' | 'next_scheduled'>) => {
    try {
      // Calculate next_scheduled based on frequency and time
      const nextScheduled = calculateNextScheduledTime(
        schedule.frequency,
        schedule.day_of_week,
        schedule.day_of_month,
        schedule.time_of_day
      );

      const { error } = await supabase
        .from('report_schedules')
        .insert({
          ...schedule,
          next_scheduled: nextScheduled
        });

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      throw err;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<ReportSchedule>) => {
    try {
      const { error } = await supabase
        .from('report_schedules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      throw err;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('report_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSchedules();
    } catch (err) {
      throw err;
    }
  };

  return {
    schedules,
    loading,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
  };
}

export function useReportMetrics() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('report_metrics')
          .select('*')
          .eq('is_active', true)
          .order('category', { ascending: true });

        if (error) throw error;
        setMetrics(data || []);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading };
}

export function useReportFilters(reportId?: string) {
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      if (!reportId) return;
      
      try {
        const { data, error } = await supabase
          .from('report_filters')
          .select('*')
          .eq('report_id', reportId);

        if (error) throw error;
        setFilters(data || []);
      } catch (err) {
        console.error('Error fetching filters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [reportId]);

  const addFilter = async (filter: Omit<ReportFilter, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('report_filters')
        .insert(filter);

      if (error) throw error;
      
      // Refresh filters
      if (reportId) {
        const { data } = await supabase
          .from('report_filters')
          .select('*')
          .eq('report_id', reportId);
        
        setFilters(data || []);
      }
    } catch (err) {
      throw err;
    }
  };

  return { filters, loading, addFilter };
}

export function useReportVisualizations(reportId?: string) {
  const [visualizations, setVisualizations] = useState<ReportVisualization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisualizations = async () => {
      if (!reportId) return;
      
      try {
        const { data, error } = await supabase
          .from('report_visualizations')
          .select('*')
          .eq('report_id', reportId)
          .order('position_order', { ascending: true });

        if (error) throw error;
        setVisualizations(data || []);
      } catch (err) {
        console.error('Error fetching visualizations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisualizations();
  }, [reportId]);

  const addVisualization = async (visualization: Omit<ReportVisualization, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('report_visualizations')
        .insert(visualization);

      if (error) throw error;
      
      // Refresh visualizations
      if (reportId) {
        const { data } = await supabase
          .from('report_visualizations')
          .select('*')
          .eq('report_id', reportId)
          .order('position_order', { ascending: true });
        
        setVisualizations(data || []);
      }
    } catch (err) {
      throw err;
    }
  };

  return { visualizations, loading, addVisualization };
}

// Helper function to calculate next scheduled time
function calculateNextScheduledTime(
  frequency: string,
  dayOfWeek?: number,
  dayOfMonth?: number,
  timeOfDay?: string
): string {
  const now = new Date();
  const nextDate = new Date(now);

  // Set time if provided
  if (timeOfDay) {
    const [hours, minutes] = timeOfDay.split(':').map(Number);
    nextDate.setHours(hours, minutes, 0, 0);
  }

  switch (frequency) {
    case 'daily':
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      break;
    case 'weekly':
      if (dayOfWeek !== undefined) {
        const daysUntilTarget = (dayOfWeek - nextDate.getDay() + 7) % 7;
        if (daysUntilTarget === 0 && nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 7);
        } else {
          nextDate.setDate(nextDate.getDate() + daysUntilTarget);
        }
      }
      break;
    case 'monthly':
      if (dayOfMonth !== undefined) {
        nextDate.setDate(dayOfMonth);
        if (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
      }
      break;
    case 'quarterly':
      // Set to first day of next quarter
      const currentQuarter = Math.floor(nextDate.getMonth() / 3);
      const nextQuarterStart = new Date(nextDate.getFullYear(), (currentQuarter + 1) * 3, 1);
      return nextQuarterStart.toISOString();
  }

  return nextDate.toISOString();
}