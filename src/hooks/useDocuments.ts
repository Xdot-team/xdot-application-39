
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService, Document, DocumentVersion } from '@/services/documentService';
import { toast } from '@/components/ui/sonner';

export const useDocuments = (projectId: string) => {
  return useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentService.getByProjectId(projectId),
    enabled: !!projectId,
  });
};

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getById(documentId),
    enabled: !!documentId,
  });
};

export const useDocumentVersions = (documentId: string) => {
  return useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: () => documentService.getVersions(documentId),
    enabled: !!documentId,
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

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Document> }) => 
      documentService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['document', data.id] });
      toast.success('Document updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update document: ${error.message}`);
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

export const useSearchDocuments = (projectId: string, query: string) => {
  return useQuery({
    queryKey: ['documents', 'search', projectId, query],
    queryFn: () => documentService.searchDocuments(projectId, query),
    enabled: !!projectId && !!query,
  });
};

export const useDocumentsByCategory = (projectId: string, category: string) => {
  return useQuery({
    queryKey: ['documents', 'category', projectId, category],
    queryFn: () => documentService.getDocumentsByCategory(projectId, category),
    enabled: !!projectId && !!category,
  });
};
