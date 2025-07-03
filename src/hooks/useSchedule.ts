import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  event_type: 'project_milestone' | 'equipment_maintenance' | 'employee_shift' | 'training_session' | 'meeting' | 'inspection' | 'other';
  category: 'project' | 'equipment' | 'labor' | 'training' | 'meeting' | 'inspection' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  start_date: string;
  end_date: string;
  all_day: boolean;
  location?: string;
  project_id?: string;
  created_by: string;
  assigned_to?: string[];
  notes?: string;
  attachments?: string[];
  recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurring_interval?: number;
  recurring_end_date?: string;
  parent_event_id?: string;
  color_code?: string;
  reminder_minutes?: number[];
  created_at: string;
  updated_at: string;
}

export interface ResourceAllocation {
  id: string;
  resource_type: 'employee' | 'equipment' | 'material';
  resource_id: string;
  resource_name: string;
  project_id?: string;
  event_id?: string;
  allocation_start: string;
  allocation_end: string;
  hours_per_day?: number;
  quantity_allocated?: number;
  allocation_percentage?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  cost_per_hour?: number;
  total_estimated_cost?: number;
  actual_hours_used?: number;
  actual_cost?: number;
  created_by: string;
  approved_by?: string;
  approval_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_type: 'project_kickoff' | 'progress_review' | 'safety_meeting' | 'client_meeting' | 'team_standup' | 'other';
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_virtual: boolean;
  meeting_link?: string;
  organizer: string;
  project_id?: string;
  agenda?: string[];
  meeting_minutes?: string;
  action_items?: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ScheduleConflict {
  id: string;
  conflict_type: 'resource_double_booked' | 'overlapping_events' | 'resource_unavailable' | 'deadline_conflict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affected_resources?: string[];
  conflicting_event_ids?: string[];
  conflicting_allocation_ids?: string[];
  detected_date: string;
  status: 'unresolved' | 'acknowledged' | 'resolved' | 'ignored';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_date?: string;
  created_at: string;
  updated_at: string;
}

export const useSchedule = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all schedule data
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('schedule_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch resource allocations
      const { data: allocationsData, error: allocationsError } = await supabase
        .from('resource_allocations')
        .select('*')
        .order('allocation_start', { ascending: true });

      if (allocationsError) throw allocationsError;

      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });

      if (meetingsError) throw meetingsError;

      // Fetch conflicts
      const { data: conflictsData, error: conflictsError } = await supabase
        .from('schedule_conflicts')
        .select('*')
        .order('detected_date', { ascending: false });

      if (conflictsError) throw conflictsError;

      setEvents(eventsData || []);
      setAllocations(allocationsData || []);
      setMeetings(meetingsData || []);
      setConflicts(conflictsData || []);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching schedule data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create schedule event
  const createEvent = async (event: Omit<ScheduleEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data].sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      ));

      toast({
        title: "Event created",
        description: `"${data.title}" has been scheduled.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating event",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update schedule event
  const updateEvent = async (id: string, updates: Partial<ScheduleEvent>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === id ? data : event
      ));

      toast({
        title: "Event updated",
        description: "Schedule event has been updated successfully.",
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error updating event",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create resource allocation
  const createAllocation = async (allocation: Omit<ResourceAllocation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('resource_allocations')
        .insert(allocation)
        .select()
        .single();

      if (error) throw error;

      setAllocations(prev => [...prev, data]);
      toast({
        title: "Resource allocated",
        description: `${data.resource_name} has been allocated.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating allocation",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create meeting
  const createMeeting = async (meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert(meeting)
        .select()
        .single();

      if (error) throw error;

      setMeetings(prev => [...prev, data]);
      toast({
        title: "Meeting scheduled",
        description: `"${data.title}" has been scheduled.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error creating meeting",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Detect scheduling conflicts
  const detectConflicts = async () => {
    try {
      // This would implement conflict detection logic
      // For now, we'll just fetch existing conflicts
      const { data, error } = await supabase
        .from('schedule_conflicts')
        .select('*')
        .eq('status', 'unresolved');

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      toast({
        title: "Error detecting conflicts",
        description: err.message,
        variant: "destructive",
      });
      return [];
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchScheduleData();

    // Set up real-time subscriptions
    const eventsChannel = supabase
      .channel('schedule_events_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'schedule_events' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [...prev, payload.new as ScheduleEvent].sort((a, b) => 
              new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => prev.map(event => 
              event.id === payload.new.id ? payload.new as ScheduleEvent : event
            ));
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => prev.filter(event => event.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const allocationsChannel = supabase
      .channel('resource_allocations_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'resource_allocations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAllocations(prev => [...prev, payload.new as ResourceAllocation]);
          } else if (payload.eventType === 'UPDATE') {
            setAllocations(prev => prev.map(allocation => 
              allocation.id === payload.new.id ? payload.new as ResourceAllocation : allocation
            ));
          } else if (payload.eventType === 'DELETE') {
            setAllocations(prev => prev.filter(allocation => allocation.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const meetingsChannel = supabase
      .channel('meetings_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'meetings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMeetings(prev => [...prev, payload.new as Meeting]);
          } else if (payload.eventType === 'UPDATE') {
            setMeetings(prev => prev.map(meeting => 
              meeting.id === payload.new.id ? payload.new as Meeting : meeting
            ));
          } else if (payload.eventType === 'DELETE') {
            setMeetings(prev => prev.filter(meeting => meeting.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(allocationsChannel);
      supabase.removeChannel(meetingsChannel);
    };
  }, []);

  return {
    // Data
    events,
    allocations,
    meetings,
    conflicts,
    loading,
    error,

    // Actions
    createEvent,
    updateEvent,
    createAllocation,
    createMeeting,
    detectConflicts,
    refreshData: fetchScheduleData,

    // Utilities
    getEventsByDate: (date: string) => {
      return events.filter(event => {
        const eventDate = new Date(event.start_date).toDateString();
        const targetDate = new Date(date).toDateString();
        return eventDate === targetDate;
      });
    },

    getResourceUtilization: (resourceId: string, resourceType: string) => {
      return allocations.filter(allocation => 
        allocation.resource_id === resourceId && 
        allocation.resource_type === resourceType &&
        allocation.status !== 'cancelled'
      );
    },

    getUpcomingEvents: (days: number = 7) => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
      
      return events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= now && eventDate <= futureDate;
      });
    },

    getConflictsByType: () => {
      const conflictsByType = conflicts.reduce((acc, conflict) => {
        acc[conflict.conflict_type] = (acc[conflict.conflict_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return conflictsByType;
    }
  };
};