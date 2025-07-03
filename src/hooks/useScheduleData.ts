import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  category: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location?: string;
  project_id?: string;
  created_by: string;
  assigned_to?: string[];
  attendees?: string[];
  color_code: string;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_type: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_virtual: boolean;
  meeting_link?: string;
  organizer: string;
  project_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceAllocation {
  id: string;
  resource_type: string;
  resource_id?: string;
  resource_name: string;
  project_id?: string;
  event_id?: string;
  allocation_start: string;
  allocation_end: string;
  hours_per_day: number;
  quantity_allocated: number;
  allocation_percentage: number;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useScheduleEvents = () => {
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

  const createEvent = async (event: Omit<ScheduleEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      setEvents(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Schedule event created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating schedule event:', error);
      toast({
        title: "Error",
        description: "Failed to create schedule event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<ScheduleEvent>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEvents(prev => prev.map(event => event.id === id ? data : event));
      toast({
        title: "Success",
        description: "Schedule event updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating schedule event:', error);
      toast({
        title: "Error",
        description: "Failed to update schedule event",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel('schedule_events_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'schedule_events'
      }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    refreshEvents: fetchEvents,
  };
};

export const useMeetings = () => {
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

  const createMeeting = async (meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert([meeting])
        .select()
        .single();

      if (error) throw error;
      setMeetings(prev => [...prev, data]);
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

  useEffect(() => {
    fetchMeetings();

    // Set up real-time subscription
    const channel = supabase
      .channel('meetings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meetings'
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

export const useResourceAllocations = () => {
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

  const createAllocation = async (allocation: Omit<ResourceAllocation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('resource_allocations')
        .insert([allocation])
        .select()
        .single();

      if (error) throw error;
      setAllocations(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Resource allocation created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating resource allocation:', error);
      toast({
        title: "Error",
        description: "Failed to create resource allocation",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAllocations();

    // Set up real-time subscription
    const channel = supabase
      .channel('resource_allocations_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'resource_allocations'
      }, () => {
        fetchAllocations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    allocations,
    loading,
    createAllocation,
    refreshAllocations: fetchAllocations,
  };
};