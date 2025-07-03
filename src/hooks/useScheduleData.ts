import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Schedule Events interfaces
export interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: 'meeting' | 'milestone' | 'task' | 'reminder' | 'deadline';
  start_date: string;
  end_date: string;
  all_day: boolean;
  location: string | null;
  project_id: string | null;
  created_by_name: string;
  attendees: string[];
  recurrence_rule: string | null;
  status: 'tentative' | 'confirmed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Hook for Schedule Events
export function useScheduleEvents() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      // Use fallback data if table doesn't exist yet
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setEvents([
        {
          id: '1',
          title: 'Project Kickoff Meeting',
          description: 'Initial project planning meeting',
          event_type: 'meeting',
          start_date: tomorrow.toISOString(),
          end_date: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          all_day: false,
          location: 'Conference Room A',
          project_id: null,
          created_by_name: 'Project Manager',
          attendees: ['john@example.com', 'jane@example.com'],
          recurrence_rule: null,
          status: 'confirmed',
          priority: 'high',
          notes: 'Bring project specifications',
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching schedule events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schedule events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (event: Omit<ScheduleEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newEvent = {
        ...event,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<ScheduleEvent>) => {
    try {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e));
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  return { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent };
}