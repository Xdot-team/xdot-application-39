
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useProjectBudgetItems = (projectId: string) => {
  return useQuery({
    queryKey: ['project-budget-items', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_budget_items')
        .select('*')
        .eq('project_id', projectId)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });
};

export const useCreateBudgetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: {
      project_id: string;
      category: string;
      item_name: string;
      budgeted_amount: number;
      actual_amount?: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_budget_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-budget-items', data.project_id] });
      toast.success('Budget item created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create budget item: ${error.message}`);
    },
  });
};

export const useUpdateBudgetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('project_budget_items')
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
      queryClient.invalidateQueries({ queryKey: ['project-budget-items'] });
      toast.success('Budget item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update budget item: ${error.message}`);
    },
  });
};
