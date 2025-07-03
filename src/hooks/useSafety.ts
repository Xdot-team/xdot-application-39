import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SafetyIncident {
  id: string;
  incident_number: string;
  incident_date: string;
  location: string;
  incident_type: 'injury' | 'near_miss' | 'property_damage' | 'environmental' | 'security' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  immediate_cause?: string;
  root_cause?: string;
  injured_person_name?: string;
  injured_person_role?: string;
  witness_names?: string[];
  reported_by: string;
  project_id?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  corrective_actions?: string;
  preventive_actions?: string;
  investigation_notes?: string;
  photos?: string[];
  documents?: string[];
  estimated_cost?: number;
  actual_cost?: number;
  lost_time_hours?: number;
  recordable?: boolean;
  osha_reportable?: boolean;
  created_at: string;
  updated_at: string;
}

export interface HazardReport {
  id: string;
  hazard_number: string;
  reported_date: string;
  location: string;
  hazard_type: 'physical' | 'chemical' | 'biological' | 'ergonomic' | 'psychosocial' | 'environmental';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  potential_consequences?: string;
  recommended_actions?: string;
  reported_by: string;
  assigned_to?: string;
  project_id?: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  resolution_date?: string;
  resolution_notes?: string;
  photos?: string[];
  gps_coordinates?: { x: number; y: number };
  affected_workers?: number;
  estimated_cost?: number;
  actual_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  id: string;
  assessment_number: string;
  assessment_date: string;
  project_id?: string;
  site_location?: string;
  assessed_by: string;
  assessment_type: 'project_startup' | 'periodic' | 'change_driven' | 'incident_driven' | 'other';
  scope_description: string;
  methodology?: string;
  status: 'draft' | 'review' | 'approved' | 'active' | 'archived';
  approved_by?: string;
  approval_date?: string;
  next_review_date?: string;
  overall_risk_rating?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  recommendations?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverSafetyRecord {
  id: string;
  driver_id?: string;
  driver_name: string;
  vehicle_id?: string;
  record_date: string;
  record_type: 'pre_trip_inspection' | 'post_trip_inspection' | 'incident' | 'violation' | 'training' | 'performance_review';
  driving_score?: number;
  speed_violations?: number;
  harsh_braking_events?: number;
  harsh_acceleration_events?: number;
  harsh_cornering_events?: number;
  distracted_driving_events?: number;
  safety_belt_violations?: number;
  miles_driven?: number;
  fuel_efficiency?: number;
  incident_description?: string;
  corrective_actions?: string;
  training_completed?: string;
  license_status?: 'valid' | 'expired' | 'suspended' | 'revoked';
  license_expiry_date?: string;
  medical_cert_expiry?: string;
  created_at: string;
  updated_at: string;
}

export const useSafety = () => {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [hazardReports, setHazardReports] = useState<HazardReport[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [driverRecords, setDriverRecords] = useState<DriverSafetyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all safety data
  const fetchSafetyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('safety_incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (incidentsError) throw incidentsError;

      // Fetch hazard reports
      const { data: hazardsData, error: hazardsError } = await supabase
        .from('hazard_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (hazardsError) throw hazardsError;

      // Fetch risk assessments
      const { data: risksData, error: risksError } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (risksError) throw risksError;

      // Fetch driver records
      const { data: driverData, error: driverError } = await supabase
        .from('driver_safety_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (driverError) throw driverError;

      setIncidents(incidentsData || []);
      setHazardReports(hazardsData || []);
      setRiskAssessments(risksData || []);
      setDriverRecords(driverData || []);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching safety data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create safety incident
  const createIncident = async (incident: Omit<SafetyIncident, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('safety_incidents')
        .insert(incident)
        .select()
        .single();

      if (error) throw error;

      setIncidents(prev => [data, ...prev]);
      toast({
        title: "Safety incident created",
        description: `Incident ${data.incident_number} has been recorded.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating incident",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update safety incident
  const updateIncident = async (id: string, updates: Partial<SafetyIncident>) => {
    try {
      const { data, error } = await supabase
        .from('safety_incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setIncidents(prev => prev.map(incident => 
        incident.id === id ? data : incident
      ));

      toast({
        title: "Incident updated",
        description: "Safety incident has been updated successfully.",
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error updating incident",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create hazard report
  const createHazardReport = async (hazard: Omit<HazardReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hazard_reports')
        .insert(hazard)
        .select()
        .single();

      if (error) throw error;

      setHazardReports(prev => [data, ...prev]);
      toast({
        title: "Hazard report created",
        description: `Hazard ${data.hazard_number} has been reported.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating hazard report",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create risk assessment
  const createRiskAssessment = async (assessment: Omit<RiskAssessment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .insert(assessment)
        .select()
        .single();

      if (error) throw error;

      setRiskAssessments(prev => [data, ...prev]);
      toast({
        title: "Risk assessment created",
        description: `Assessment ${data.assessment_number} has been created.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating risk assessment",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchSafetyData();

    // Set up real-time subscriptions
    const incidentsChannel = supabase
      .channel('safety_incidents_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'safety_incidents' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIncidents(prev => [payload.new as SafetyIncident, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setIncidents(prev => prev.map(incident => 
              incident.id === payload.new.id ? payload.new as SafetyIncident : incident
            ));
          } else if (payload.eventType === 'DELETE') {
            setIncidents(prev => prev.filter(incident => incident.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const hazardsChannel = supabase
      .channel('hazard_reports_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'hazard_reports' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setHazardReports(prev => [payload.new as HazardReport, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setHazardReports(prev => prev.map(hazard => 
              hazard.id === payload.new.id ? payload.new as HazardReport : hazard
            ));
          } else if (payload.eventType === 'DELETE') {
            setHazardReports(prev => prev.filter(hazard => hazard.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(incidentsChannel);
      supabase.removeChannel(hazardsChannel);
    };
  }, []);

  return {
    // Data
    incidents,
    hazardReports,
    riskAssessments,
    driverRecords,
    loading,
    error,

    // Actions
    createIncident,
    updateIncident,
    createHazardReport,
    createRiskAssessment,
    refreshData: fetchSafetyData,

    // Analytics
    getIncidentsByType: () => {
      const types = incidents.reduce((acc, incident) => {
        acc[incident.incident_type] = (acc[incident.incident_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return types;
    },

    getHazardsByPriority: () => {
      const priorities = hazardReports.reduce((acc, hazard) => {
        acc[hazard.priority] = (acc[hazard.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return priorities;
    },

    getTotalLostTime: () => {
      return incidents.reduce((total, incident) => total + (incident.lost_time_hours || 0), 0);
    },

    getIncidentRate: () => {
      const totalIncidents = incidents.length;
      const recordableIncidents = incidents.filter(i => i.recordable).length;
      return { total: totalIncidents, recordable: recordableIncidents };
    }
  };
};