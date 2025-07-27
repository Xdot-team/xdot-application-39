import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UtilityMeeting } from '@/types/field';
import { useToast } from '@/hooks/use-toast';

export function useUtilityMeetings(projectId?: string) {
  const [meetings, setMeetings] = useState<UtilityMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('utility_meetings')
        .select('*')
        .order('date', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setMeetings(data as UtilityMeeting[] || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching utility meetings:', err);
      setError('Failed to fetch utility meetings');
      toast({
        title: "Error",
        description: "Failed to fetch utility meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData: Omit<UtilityMeeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('utility_meetings')
        .insert([meetingData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMeetings(prev => [...prev, data as UtilityMeeting]);
      toast({
        title: "Success",
        description: "Utility meeting created successfully",
      });

      return data;
    } catch (err) {
      console.error('Error creating utility meeting:', err);
      toast({
        title: "Error",
        description: "Failed to create utility meeting",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateMeeting = async (id: string, updates: Partial<UtilityMeeting>) => {
    try {
      const { data, error } = await supabase
        .from('utility_meetings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMeetings(prev => prev.map(meeting => 
        meeting.id === id ? data as UtilityMeeting : meeting
      ));

      toast({
        title: "Success",
        description: "Utility meeting updated successfully",
      });

      return data;
    } catch (err) {
      console.error('Error updating utility meeting:', err);
      toast({
        title: "Error",
        description: "Failed to update utility meeting",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('utility_meetings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      toast({
        title: "Success",
        description: "Utility meeting deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting utility meeting:', err);
      toast({
        title: "Error",
        description: "Failed to delete utility meeting",
        variant: "destructive",
      });
      throw err;
    }
  };

  const completeMeeting = async (id: string, minutes: string) => {
    return updateMeeting(id, {
      status: 'completed',
      minutes: minutes,
    });
  };

  useEffect(() => {
    fetchMeetings();

    // Set up real-time subscription
    const subscription = supabase
      .channel('utility_meetings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'utility_meetings',
          filter: projectId ? `project_id=eq.${projectId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMeetings(prev => [...prev, payload.new as UtilityMeeting]);
          } else if (payload.eventType === 'UPDATE') {
            setMeetings(prev => prev.map(meeting => 
              meeting.id === payload.new.id ? payload.new as UtilityMeeting : meeting
            ));
          } else if (payload.eventType === 'DELETE') {
            setMeetings(prev => prev.filter(meeting => meeting.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  return {
    meetings,
    loading,
    error,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    completeMeeting,
    refetch: fetchMeetings,
  };
}