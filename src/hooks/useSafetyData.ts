import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SafetyIncident {
  id: string;
  incident_number: string;
  incident_type: string;
  severity: string;
  location: string;
  incident_date: string;
  status: string;
  description: string;
  reported_by: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface HazardReport {
  id: string;
  hazard_number: string;
  reported_date: string;
  reported_by: string;
  project_id?: string;
  location: string;
  hazard_type: string;
  priority: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SafetyTrainingSession {
  id: string;
  session_name: string;
  training_type: string;
  instructor: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export const useSafetyIncidents = () => {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('safety_incidents')
        .select('*')
        .order('incident_date', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching safety incidents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch safety incidents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incident: Omit<SafetyIncident, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('safety_incidents')
        .insert([incident])
        .select()
        .single();

      if (error) throw error;
      setIncidents(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Safety incident reported successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating safety incident:', error);
      toast({
        title: "Error", 
        description: "Failed to report safety incident",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Set up real-time subscription
    const channel = supabase
      .channel('safety_incidents_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'safety_incidents'
      }, () => {
        fetchIncidents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    incidents,
    loading,
    createIncident,
    refreshIncidents: fetchIncidents,
  };
};

export const useHazardReports = () => {
  const [hazards, setHazards] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHazards = async () => {
    try {
      const { data, error } = await supabase
        .from('hazard_reports')
        .select('*')
        .order('reported_date', { ascending: false });

      if (error) throw error;
      setHazards(data || []);
    } catch (error) {
      console.error('Error fetching hazard reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hazard reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHazard = async (hazard: Omit<HazardReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hazard_reports')
        .insert([hazard])
        .select()
        .single();

      if (error) throw error;
      setHazards(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Hazard report created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating hazard report:', error);
      toast({
        title: "Error",
        description: "Failed to create hazard report", 
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchHazards();

    // Set up real-time subscription
    const channel = supabase
      .channel('hazard_reports_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hazard_reports'
      }, () => {
        fetchHazards();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    hazards,
    loading,
    createHazard,
    refreshHazards: fetchHazards,
  };
};

export const useSafetyTraining = () => {
  const [sessions, setSessions] = useState<SafetyTrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('safety_training_sessions')
        .select('*')
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session: Omit<SafetyTrainingSession, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('safety_training_sessions')
        .insert([session])
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Training session created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating training session:', error);
      toast({
        title: "Error",
        description: "Failed to create training session",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSessions();

    // Set up real-time subscription
    const channel = supabase
      .channel('training_sessions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'safety_training_sessions'
      }, () => {
        fetchSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    sessions,
    loading,
    createSession,
    refreshSessions: fetchSessions,
  };
};