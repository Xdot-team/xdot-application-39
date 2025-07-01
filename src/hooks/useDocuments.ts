
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/database';
import { toast } from '@/components/ui/sonner';

export const useDocuments = (projectId: string) => {
  return useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentService.getByProjectId(projectId),
    enabled: !!projectId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, projectId, metadata }: { 
      file: File; 
      projectId: string; 
      metadata: any 
    }) => documentService.upload(file, projectId, metadata),
    onSuccess: (data) => {
      if (data && data.project_id) {
        queryClient.invalidateQueries({ queryKey: ['documents', data.project_id] });
      }
      toast.success('Document uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: documentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
};

export const useDocumentVersions = (documentId: string) => {
  return useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: () => documentService.getVersions(documentId),
    enabled: !!documentId,
  });
};

export const useCreateDocumentVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ documentId, file, version, notes }: { 
      documentId: string; 
      file: File; 
      version: string; 
      notes: string 
    }) => documentService.createVersion(documentId, file, version, notes),
    onSuccess: (data) => {
      if (data && data.document_id) {
        queryClient.invalidateQueries({ queryKey: ['document-versions', data.document_id] });
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
      toast.success('Document version created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create document version: ${error.message}`);
    },
  });
};
