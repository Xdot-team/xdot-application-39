import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SurveyProject {
  id: string;
  project_id: string;
  survey_type: string;
  status: string;
  priority: string;
  assigned_surveyor: string;
  start_date: string;
  end_date: string;
  progress_percentage: number;
  equipment_required: string[];
  notes: string;
  created_at: string;
}

export interface SurveyDataPoint {
  id: string;
  survey_project_id: string;
  point_id: string;
  latitude: number;
  longitude: number;
  elevation: number;
  accuracy_horizontal: number;
  accuracy_vertical: number;
  point_type: string;
  description: string;
  recorded_at: string;
  recorded_by: string;
  equipment_used: string;
}

export interface SurveyEquipment {
  id: string;
  equipment_id: string;
  equipment_type: string;
  model: string;
  serial_number: string;
  status: string;
  battery_level: number;
  signal_strength: number;
  assigned_to: string;
  last_sync: string;
  storage_used_gb: number;
  storage_total_gb: number;
}

export interface ControlPoint {
  id: string;
  point_name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  coordinate_system: string;
  datum: string;
  accuracy_class: string;
  verification_status: string;
  monument_type: string;
}

export function useSurveyProjects() {
  const [projects, setProjects] = useState<SurveyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (project: Omit<SurveyProject, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('survey_projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<SurveyProject>) => {
    try {
      const { error } = await supabase
        .from('survey_projects')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (err) {
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject
  };
}

export function useSurveyDataPoints(surveyProjectId?: string) {
  const [dataPoints, setDataPoints] = useState<SurveyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataPoints = async () => {
      if (!surveyProjectId) return;
      
      try {
        const { data, error } = await supabase
          .from('survey_data_points')
          .select('*')
          .eq('survey_project_id', surveyProjectId)
          .order('recorded_at', { ascending: false });

        if (error) throw error;
        setDataPoints(data || []);
      } catch (err) {
        console.error('Error fetching data points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPoints();
  }, [surveyProjectId]);

  const addDataPoint = async (dataPoint: Omit<SurveyDataPoint, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('survey_data_points')
        .insert(dataPoint);

      if (error) throw error;
      
      // Refresh data points
      if (surveyProjectId) {
        const { data } = await supabase
          .from('survey_data_points')
          .select('*')
          .eq('survey_project_id', surveyProjectId)
          .order('recorded_at', { ascending: false });
        
        setDataPoints(data || []);
      }
    } catch (err) {
      throw err;
    }
  };

  return { dataPoints, loading, addDataPoint };
}

export function useSurveyEquipment() {
  const [equipment, setEquipment] = useState<SurveyEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from('survey_equipment')
          .select('*')
          .order('equipment_id');

        if (error) throw error;
        setEquipment(data || []);
      } catch (err) {
        console.error('Error fetching equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const updateEquipmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('survey_equipment')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh equipment list
      const { data } = await supabase
        .from('survey_equipment')
        .select('*')
        .order('equipment_id');
      
      setEquipment(data || []);
    } catch (err) {
      throw err;
    }
  };

  return { equipment, loading, updateEquipmentStatus };
}

export function useControlPoints() {
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchControlPoints = async () => {
      try {
        const { data, error } = await supabase
          .from('control_points')
          .select('*')
          .order('point_name');

        if (error) throw error;
        setControlPoints(data || []);
      } catch (err) {
        console.error('Error fetching control points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchControlPoints();
  }, []);

  const addControlPoint = async (point: Omit<ControlPoint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('control_points')
        .insert(point);

      if (error) throw error;
      
      // Refresh control points
      const { data } = await supabase
        .from('control_points')
        .select('*')
        .order('point_name');
      
      setControlPoints(data || []);
    } catch (err) {
      throw err;
    }
  };

  return { controlPoints, loading, addControlPoint };
}