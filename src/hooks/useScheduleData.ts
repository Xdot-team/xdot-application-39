
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Database interfaces matching the actual database schema
export interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string;
  all_day: boolean | null;
  location: string | null;
  project_id: string | null;
  created_by: string;
  attendees: string[] | null;
  assigned_to: string[] | null;
  status: string;
  priority: string;
  notes: string | null;
  category: string;
  completion_percentage: number | null;
  attachments: string[] | null;
  color_code: string | null;
  recurring_pattern: string | null;
  recurring_interval: number | null;
  recurring_until: string | null;
  notifications_enabled: boolean | null;
  notification_times: number[] | null;
  parent_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceAllocation {
  id: string;
  resource_id: string | null;
  resource_name: string;
  resource_type: string;
  project_id: string | null;  
  allocation_start: string;
  allocation_end: string;
  hours_per_day: number | null;
  quantity_allocated: number | null;
  notes: string | null;
  status: string;
  created_by: string;
  actual_cost: number | null;
  actual_hours_worked: number | null;
  allocation_percentage: number | null;
  cost_per_hour: number | null;
  event_id: string | null;
  total_estimated_cost: number | null;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  organizer: string;
  agenda: any | null;
  minutes: string | null;
  project_id: string | null;
  is_virtual: boolean | null;
  meeting_link: string | null;
  meeting_type: string;
  documents: string[] | null;
  status: string;
  action_items: any | null;
  recurring: boolean | null;
  recurring_pattern: string | null;
  recurring_until: string | null;
  timezone: string | null;
  recording_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleConflict {
  id: string;
  conflict_type: string;
  affected_events: string[];
  affected_resources: string[];
  severity: string;
  description: string;
  resolution_notes: string | null;
  status: string;
  detected_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  auto_detected: boolean | null;
  created_at: string;
}

// Hook for Schedule Events
export function useScheduleEvents() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
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

    // Set up real-time subscription
    const channel = supabase
      .channel('schedule_events_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'schedule_events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createEvent = async (event: any) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<ScheduleEvent>) => {
    try {
      const { error } = await supabase
        .from('schedule_events')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent };
}

// Hook for Resource Allocations
export function useResourceAllocations() {
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllocations = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_allocations')
        .select('*')
        .order('allocation_start', { ascending: true });

      if (error) throw error;
      setAllocations(data || []);
    } catch (error) {
      console.error('Error fetching resource allocations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resource allocations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();

    // Set up real-time subscription
    const channel = supabase
      .channel('resource_allocations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'resource_allocations' },
        () => fetchAllocations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { allocations, loading, fetchAllocations };
}

// Hook for Meetings
export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();

    // Set up real-time subscription
    const channel = supabase
      .channel('meetings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meetings' },
        () => fetchMeetings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createMeeting = async (meeting: any) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert(meeting)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { meetings, loading, fetchMeetings, createMeeting };
}

// Hook for Schedule Conflicts
export function useScheduleConflicts() {
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConflicts = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_conflicts')
        .select('*')
        .order('detected_at', { ascending: false });

      if (error) throw error;
      setConflicts(data || []);
    } catch (error) {
      console.error('Error fetching schedule conflicts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schedule conflicts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();

    // Set up real-time subscription
    const channel = supabase
      .channel('schedule_conflicts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'schedule_conflicts' },
        () => fetchConflicts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resolveConflict = async (id: string, resolution: string) => {
    try {
      const { error } = await supabase
        .from('schedule_conflicts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: 'Current User', // TODO: Replace with actual user
          resolution_notes: resolution
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Conflict resolved successfully",
      });
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Error",
        description: "Failed to resolve conflict",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { conflicts, loading, fetchConflicts, resolveConflict };
}
