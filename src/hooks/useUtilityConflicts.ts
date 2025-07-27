import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UtilityConflict } from '@/types/field';
import { useToast } from '@/hooks/use-toast';

export function useUtilityConflicts(projectId?: string) {
  const [conflicts, setConflicts] = useState<UtilityConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('utility_conflicts')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setConflicts(data as UtilityConflict[] || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching utility conflicts:', err);
      setError('Failed to fetch utility conflicts');
      toast({
        title: "Error",
        description: "Failed to fetch utility conflicts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createConflict = async (conflictData: Omit<UtilityConflict, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('utility_conflicts')
        .insert([conflictData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setConflicts(prev => [...prev, data as UtilityConflict]);
      toast({
        title: "Success",
        description: "Utility conflict created successfully",
      });

      return data;
    } catch (err) {
      console.error('Error creating utility conflict:', err);
      toast({
        title: "Error",
        description: "Failed to create utility conflict",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateConflict = async (id: string, updates: Partial<UtilityConflict>) => {
    try {
      const { data, error } = await supabase
        .from('utility_conflicts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setConflicts(prev => prev.map(conflict => 
        conflict.id === id ? data as UtilityConflict : conflict
      ));

      toast({
        title: "Success",
        description: "Utility conflict updated successfully",
      });

      return data;
    } catch (err) {
      console.error('Error updating utility conflict:', err);
      toast({
        title: "Error",
        description: "Failed to update utility conflict",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteConflict = async (id: string) => {
    try {
      const { error } = await supabase
        .from('utility_conflicts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setConflicts(prev => prev.filter(conflict => conflict.id !== id));
      toast({
        title: "Success",
        description: "Utility conflict deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting utility conflict:', err);
      toast({
        title: "Error",
        description: "Failed to delete utility conflict",
        variant: "destructive",
      });
      throw err;
    }
  };

  const resolveConflict = async (id: string, resolutionNotes: string, resolvedBy: string) => {
    return updateConflict(id, {
      status: 'resolved',
      resolved_date: new Date().toISOString().split('T')[0],
      resolved_by: resolvedBy,
      resolution_notes: resolutionNotes,
    });
  };

  useEffect(() => {
    fetchConflicts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('utility_conflicts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'utility_conflicts',
          filter: projectId ? `project_id=eq.${projectId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConflicts(prev => [...prev, payload.new as UtilityConflict]);
          } else if (payload.eventType === 'UPDATE') {
            setConflicts(prev => prev.map(conflict => 
              conflict.id === payload.new.id ? payload.new as UtilityConflict : conflict
            ));
          } else if (payload.eventType === 'DELETE') {
            setConflicts(prev => prev.filter(conflict => conflict.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  return {
    conflicts,
    loading,
    error,
    createConflict,
    updateConflict,
    deleteConflict,
    resolveConflict,
    refetch: fetchConflicts,
  };
}