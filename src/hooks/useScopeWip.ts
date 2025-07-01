
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ScopeWipItem {
  id: string;
  project_id: string;
  scope_description: string;
  progress_percentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  start_date?: string;
  estimated_end_date?: string;
  actual_end_date?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useScopeWipItems = (projectId: string) => {
  return useQuery({
    queryKey: ['scope-wip', projectId],
    queryFn: async () => {
      // Since we don't have a scope_wip table yet, let's create mock data based on project milestones
      const { data: milestones, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      // Transform milestones to scope WIP items
      const scopeWipItems: ScopeWipItem[] = (milestones || []).map(milestone => ({
        id: milestone.id,
        project_id: milestone.project_id,
        scope_description: milestone.title,
        progress_percentage: milestone.status === 'completed' ? 100 : 
                           milestone.status === 'in_progress' ? 50 : 0,
        status: milestone.status === 'completed' ? 'completed' :
                milestone.status === 'in_progress' ? 'in_progress' : 'not_started',
        start_date: milestone.created_at,
        estimated_end_date: milestone.due_date,
        actual_end_date: milestone.completion_date,
        assigned_to: 'Project Team',
        notes: milestone.description,
        created_at: milestone.created_at,
        updated_at: milestone.updated_at
      }));
      
      return scopeWipItems;
    },
    enabled: !!projectId,
  });
};

export const useUpdateScopeWipProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, progress, status }: { 
      id: string; 
      progress: number; 
      status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
    }) => {
      // Update the milestone status based on progress
      const milestoneStatus = progress === 100 ? 'completed' : 
                             progress > 0 ? 'in_progress' : 'pending';
      
      const { data, error } = await supabase
        .from('project_milestones')
        .update({
          status: milestoneStatus,
          completion_date: progress === 100 ? new Date().toISOString().split('T')[0] : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scope-wip'] });
      toast.success('Progress updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });
};
