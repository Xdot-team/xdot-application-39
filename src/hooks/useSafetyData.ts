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

export interface JobSafetyAnalysis {
  id: string;
  jsa_number: string;
  job_title: string;
  job_description: string;
  project_id?: string;
  site_id?: string;
  prepared_by: string;
  reviewed_by?: string;
  approved_by?: string;
  preparation_date: string;
  review_date?: string;
  approval_date?: string;
  effective_date?: string;
  expiry_date?: string;
  status: string;
  equipment_required?: string[];
  materials_required?: string[];
  personnel_required?: number;
  environmental_conditions?: string;
  emergency_procedures?: string;
  created_at: string;
  updated_at: string;
}

export interface ToolboxMeeting {
  id: string;
  meeting_date: string;
  meeting_time: string;
  project_id?: string;
  site_id?: string;
  crew_id?: string;
  foreman: string;
  topics_discussed: string[];
  safety_concerns?: string[];
  action_items?: string[];
  weather_conditions?: string;
  work_planned?: string;
  hazards_identified?: string[];
  ppe_required?: string[];
  emergency_procedures_reviewed?: boolean;
  attendee_count?: number;
  duration_minutes?: number;
  follow_up_required?: boolean;
  follow_up_date?: string;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  assessment_number: string;
  assessment_date: string;
  project_id?: string;
  assessed_by: string;
  assessment_type: string;
  scope_description: string;
  methodology?: string;
  status: string;
  approval_date?: string;
  approved_by?: string;
  next_review_date?: string;
  overall_risk_rating?: string;
  recommendations?: string;
  created_at: string;
  updated_at: string;
}

export interface AIPredictionLog {
  id: string;
  prediction_type: string;
  confidence_score: number;
  prediction_data: any;
  related_entity_type: string;
  related_entity_id: string;
  status: string;
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
        .insert([{
          ...hazard,
          hazard_number: `HAZ-${Date.now()}`
        }])
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

export const useJobSafetyAnalyses = () => {
  const [jsas, setJsas] = useState<JobSafetyAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJsas = async () => {
    try {
      const { data, error } = await supabase
        .from('job_safety_analyses')
        .select('*')
        .order('preparation_date', { ascending: false });

      if (error) throw error;
      setJsas(data || []);
    } catch (error) {
      console.error('Error fetching JSAs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job safety analyses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJsa = async (jsa: Omit<JobSafetyAnalysis, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('job_safety_analyses')
        .insert([{
          ...jsa,
          jsa_number: `JSA-${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;
      setJsas(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Job Safety Analysis created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating JSA:', error);
      toast({
        title: "Error",
        description: "Failed to create Job Safety Analysis",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchJsas();

    const channel = supabase
      .channel('job_safety_analyses_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'job_safety_analyses'
      }, () => {
        fetchJsas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    jsas,
    loading,
    createJsa,
    refreshJsas: fetchJsas,
  };
};

export const useToolboxMeetings = () => {
  const [meetings, setMeetings] = useState<ToolboxMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('toolbox_meetings')
        .select('*')
        .order('meeting_date', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching toolbox meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch toolbox meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meeting: Omit<ToolboxMeeting, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('toolbox_meetings')
        .insert([meeting])
        .select()
        .single();

      if (error) throw error;
      setMeetings(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Toolbox meeting created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating toolbox meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create toolbox meeting",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMeetings();

    const channel = supabase
      .channel('toolbox_meetings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'toolbox_meetings'
      }, () => {
        fetchMeetings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    meetings,
    loading,
    createMeeting,
    refreshMeetings: fetchMeetings,
  };
};

export const useRiskAssessments = () => {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      setRisks(data || []);
    } catch (error) {
      console.error('Error fetching risk assessments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch risk assessments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRisk = async (risk: Omit<RiskAssessment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .insert([{
          ...risk,
          assessment_number: `RISK-${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;
      setRisks(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Risk assessment created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating risk assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create risk assessment",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRisks();

    const channel = supabase
      .channel('risk_assessments_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'risk_assessments'
      }, () => {
        fetchRisks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    risks,
    loading,
    createRisk,
    refreshRisks: fetchRisks,
  };
};

export const useAIPredictions = () => {
  const [predictions, setPredictions] = useState<AIPredictionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_prediction_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI predictions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPrediction = async (prediction: Omit<AIPredictionLog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ai_prediction_logs')
        .insert([prediction])
        .select()
        .single();

      if (error) throw error;
      setPredictions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating AI prediction:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPredictions();

    const channel = supabase
      .channel('ai_predictions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_prediction_logs'
      }, () => {
        fetchPredictions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    predictions,
    loading,
    createPrediction,
    refreshPredictions: fetchPredictions,
  };
};