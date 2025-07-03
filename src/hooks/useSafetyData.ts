import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Safety interfaces
export interface SafetyCertification {
  id: string;
  name: string;
  description: string | null;
  required_for_roles: string[];
  validity_period_months: number;
  issuing_authority: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToolboxMeeting {
  id: string;
  meeting_date: string;
  project_id: string | null;
  topic: string;
  description: string | null;
  conducted_by_name: string;
  duration_minutes: number;
  meeting_type: 'safety' | 'quality' | 'productivity' | 'general';
  weather_conditions: string | null;
  hazards_discussed: string[];
  safety_reminders: string[];
  action_items: string[];
  notes: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Hook for Safety Certifications
export function useSafetyCertifications() {
  const [certifications, setCertifications] = useState<SafetyCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCertifications = async () => {
    try {
      // Use fallback data if table doesn't exist yet
      setCertifications([
        {
          id: '1',
          name: 'OSHA 30',
          description: '30-hour OSHA safety training',
          required_for_roles: ['Supervisor', 'Safety Officer'],
          validity_period_months: 36,
          issuing_authority: 'OSHA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching safety certifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch safety certifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const createCertification = async (cert: Omit<SafetyCertification, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCert = {
        ...cert,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCertifications(prev => [newCert, ...prev]);
      toast({
        title: "Success",
        description: "Certification created successfully",
      });
      return newCert;
    } catch (error) {
      console.error('Error creating certification:', error);
      throw error;
    }
  };

  return { certifications, loading, fetchCertifications, createCertification };
}

// Hook for Toolbox Meetings
export function useToolboxMeetings() {
  const [meetings, setMeetings] = useState<ToolboxMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      // Use fallback data if table doesn't exist yet
      setMeetings([
        {
          id: '1',
          meeting_date: new Date().toISOString().split('T')[0],
          project_id: null,
          topic: 'Fall Protection Safety',
          description: 'Review of fall protection procedures and equipment',
          conducted_by_name: 'Safety Manager',
          duration_minutes: 30,
          meeting_type: 'safety',
          weather_conditions: 'Clear, 72°F',
          hazards_discussed: ['Working at height', 'Equipment inspection'],
          safety_reminders: ['Inspect harnesses daily', 'Use three-point contact'],
          action_items: ['Replace worn harnesses', 'Schedule monthly inspection'],
          notes: 'Good attendance, active participation',
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
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

  useEffect(() => {
    fetchMeetings();
  }, []);

  const createMeeting = async (meeting: Omit<ToolboxMeeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMeeting = {
        ...meeting,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setMeetings(prev => [newMeeting, ...prev]);
      toast({
        title: "Success",
        description: "Toolbox meeting created successfully",
      });
      return newMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  return { meetings, loading, fetchMeetings, createMeeting };
}

// Hook for Safety Incidents (placeholder)
export function useSafetyIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  return { incidents, loading };
}

// Safety Training interface
export interface SafetyTraining {
  id: string;
  session_name: string;
  training_type: string;
  session_date: string;
  start_time: string;
  instructor: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// Hook for Safety Training
export function useSafetyTraining() {
  const [sessions, setSessions] = useState<SafetyTraining[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Mock data for now
  React.useEffect(() => {
    setSessions([
      {
        id: '1',
        session_name: 'Fall Protection Training',
        training_type: 'Safety',
        session_date: new Date().toISOString(),
        start_time: '09:00',
        instructor: 'Safety Officer',
        location: 'Training Room A',
        status: 'scheduled'
      }
    ]);
  }, []);

  return { sessions, loading };
}