import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KPI {
  id: string;
  name: string;
  category: string;
  description: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: string;
  period: string;
  last_updated: string;
  threshold_warning?: number;
  threshold_critical?: number;
}

export interface EOSGoal {
  id: string;
  name: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  end_date: string;
  owner_name: string;
  status: string;
  priority: string;
  quarterly_targets: any;
}

export interface EOSMilestone {
  id: string;
  goal_id: string;
  name: string;
  description: string;
  due_date: string;
  completed: boolean;
  completed_date?: string;
  notes?: string;
}

export interface DashboardWidget {
  id: string;
  widget_type: string;
  title: string;
  size: string;
  position_x: number;
  position_y: number;
  data_source: string;
  configuration: any;
  refresh_interval: number;
  is_active: boolean;
}

export interface PerformanceMetric {
  id: string;
  metric_name: string;
  category: string;
  value: number;
  unit: string;
  measurement_date: string;
  project_id?: string;
}

export interface Projection {
  id: string;
  name: string;
  category: string;
  projection_type: string;
  period: string;
  projection_data: any;
  confidence_level?: number;
  methodology?: string;
}

export function useKPIs() {
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setKPIs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const createKPI = async (kpi: Omit<KPI, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kpis')
        .insert(kpi)
        .select()
        .single();

      if (error) throw error;
      await fetchKPIs();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateKPI = async (id: string, updates: Partial<KPI>) => {
    try {
      const { error } = await supabase
        .from('kpis')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchKPIs();
    } catch (err) {
      throw err;
    }
  };

  return { kpis, loading, error, fetchKPIs, createKPI, updateKPI };
}

export function useEOSGoals() {
  const [goals, setGoals] = useState<EOSGoal[]>([]);
  const [milestones, setMilestones] = useState<EOSMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const { data: goalsData, error: goalsError } = await supabase
        .from('eos_goals')
        .select('*')
        .order('end_date', { ascending: true });

      const { data: milestonesData, error: milestonesError } = await supabase
        .from('eos_milestones')
        .select('*')
        .order('due_date', { ascending: true });

      if (goalsError) throw goalsError;
      if (milestonesError) throw milestonesError;

      setGoals(goalsData || []);
      setMilestones(milestonesData || []);
    } catch (err) {
      console.error('Error fetching EOS goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const createGoal = async (goal: Omit<EOSGoal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('eos_goals')
        .insert(goal)
        .select()
        .single();

      if (error) throw error;
      await fetchGoals();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<EOSGoal>) => {
    try {
      const { error } = await supabase
        .from('eos_goals')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchGoals();
    } catch (err) {
      throw err;
    }
  };

  const createMilestone = async (milestone: Omit<EOSMilestone, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('eos_milestones')
        .insert(milestone);

      if (error) throw error;
      await fetchGoals();
    } catch (err) {
      throw err;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<EOSMilestone>) => {
    try {
      const { error } = await supabase
        .from('eos_milestones')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchGoals();
    } catch (err) {
      throw err;
    }
  };

  return {
    goals,
    milestones,
    loading,
    fetchGoals,
    createGoal,
    updateGoal,
    createMilestone,
    updateMilestone
  };
}

export function useDashboardWidgets() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const { data, error } = await supabase
          .from('dashboard_widgets')
          .select('*')
          .eq('is_active', true)
          .order('position_y', { ascending: true });

        if (error) throw error;
        setWidgets(data || []);
      } catch (err) {
        console.error('Error fetching widgets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWidgets();
  }, []);

  const createWidget = async (widget: Omit<DashboardWidget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('dashboard_widgets')
        .insert(widget);

      if (error) throw error;
      
      // Refresh widgets
      const { data } = await supabase
        .from('dashboard_widgets')
        .select('*')
        .eq('is_active', true)
        .order('position_y', { ascending: true });
      
      setWidgets(data || []);
    } catch (err) {
      throw err;
    }
  };

  const updateWidget = async (id: string, updates: Partial<DashboardWidget>) => {
    try {
      const { error } = await supabase
        .from('dashboard_widgets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh widgets
      const { data } = await supabase
        .from('dashboard_widgets')
        .select('*')
        .eq('is_active', true)
        .order('position_y', { ascending: true });
      
      setWidgets(data || []);
    } catch (err) {
      throw err;
    }
  };

  return { widgets, loading, createWidget, updateWidget };
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('performance_metrics')
          .select('*')
          .order('measurement_date', { ascending: false })
          .limit(100);

        if (error) throw error;
        setMetrics(data || []);
      } catch (err) {
        console.error('Error fetching performance metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const addMetric = async (metric: Omit<PerformanceMetric, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('performance_metrics')
        .insert(metric);

      if (error) throw error;
      
      // Refresh metrics
      const { data } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('measurement_date', { ascending: false })
        .limit(100);
      
      setMetrics(data || []);
    } catch (err) {
      throw err;
    }
  };

  return { metrics, loading, addMetric };
}

export function useProjections() {
  const [projections, setProjections] = useState<Projection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjections = async () => {
      try {
        const { data, error } = await supabase
          .from('projections')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjections(data || []);
      } catch (err) {
        console.error('Error fetching projections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, []);

  const createProjection = async (projection: Omit<Projection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('projections')
        .insert(projection);

      if (error) throw error;
      
      // Refresh projections
      const { data } = await supabase
        .from('projections')
        .select('*')
        .order('created_at', { ascending: false });
      
      setProjections(data || []);
    } catch (err) {
      throw err;
    }
  };

  return { projections, loading, createProjection };
}