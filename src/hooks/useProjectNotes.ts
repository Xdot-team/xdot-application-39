
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useProjectNotes = (projectId: string) => {
  return useQuery({
    queryKey: ['project-notes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (note: {
      project_id: string;
      title: string;
      content?: string;
      author?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_notes')
        .insert(note)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-notes', data.project_id] });
      toast.success('Note created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create note: ${error.message}`);
    },
  });
};

export const useUpdateProjectNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('project_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-notes'] });
      toast.success('Note updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update note: ${error.message}`);
    },
  });
};

export const useDeleteProjectNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-notes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });
};
