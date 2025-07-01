
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submittalService } from '@/services/database';
import { toast } from '@/components/ui/sonner';

export const useSubmittals = (projectId: string) => {
  return useQuery({
    queryKey: ['submittals', projectId],
    queryFn: () => submittalService.getByProjectId(projectId),
    enabled: !!projectId,
  });
};

export const useCreateSubmittal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submittalService.create,
    onSuccess: (data: any) => {
      if (data && data.project_id) {
        queryClient.invalidateQueries({ queryKey: ['submittals', data.project_id] });
      }
      toast.success('Submittal created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create submittal: ${error.message}`);
    },
  });
};

export const useUpdateSubmittal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      submittalService.update(id, updates),
    onSuccess: (data: any) => {
      if (data && data.project_id) {
        queryClient.invalidateQueries({ queryKey: ['submittals', data.project_id] });
      }
      toast.success('Submittal updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update submittal: ${error.message}`);
    },
  });
};
