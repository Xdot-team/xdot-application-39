
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useProjectTeamMembers = (projectId: string) => {
  return useQuery({
    queryKey: ['project-team-members', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_team_members')
        .select('*')
        .eq('project_id', projectId)
        .order('added_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (member: {
      project_id: string;
      user_name: string;
      user_email?: string;
      role: string;
      permissions?: string[];
    }) => {
      const { data, error } = await supabase
        .from('project_team_members')
        .insert(member)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-team-members', data.project_id] });
      toast.success('Team member added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add team member: ${error.message}`);
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-team-members'] });
      toast.success('Team member removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove team member: ${error.message}`);
    },
  });
};
