
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useProjectMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (milestone: {
      project_id: string;
      title: string;
      description?: string;
      due_date?: string;
      priority?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert(milestone)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones', data.project_id] });
      toast.success('Milestone created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create milestone: ${error.message}`);
    },
  });
};

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('project_milestones')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones'] });
      toast.success('Milestone updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update milestone: ${error.message}`);
    },
  });
};
