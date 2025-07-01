
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfiService } from '@/services/database';
import { toast } from '@/components/ui/sonner';

export const useRFIs = (projectId: string) => {
  return useQuery({
    queryKey: ['rfis', projectId],
    queryFn: () => rfiService.getByProjectId(projectId),
    enabled: !!projectId,
  });
};

export const useCreateRFI = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rfiService.create,
    onSuccess: (data: any) => {
      if (data && data.project_id) {
        queryClient.invalidateQueries({ queryKey: ['rfis', data.project_id] });
      }
      toast.success('RFI created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create RFI: ${error.message}`);
    },
  });
};

export const useUpdateRFI = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      rfiService.update(id, updates),
    onSuccess: (data: any) => {
      if (data && data.project_id) {
        queryClient.invalidateQueries({ queryKey: ['rfis', data.project_id] });
      }
      toast.success('RFI updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update RFI: ${error.message}`);
    },
  });
};
