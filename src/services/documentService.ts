
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface Document {
  id: string;
  project_id: string;
  name: string;
  file_name: string;
  file_url: string;
  file_size: number;
  category: string;
  tags: string[];
  version: string;
  uploaded_at: string;
  uploaded_by?: string;
  description?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: string;
  file_url: string;
  file_size: number;
  notes: string;
  uploaded_at: string;
}

export const documentService = {
  async getByProjectId(projectId: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  },

  async upload(file: File, projectId: string, metadata: any = {}): Promise<Document> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      // Insert document metadata
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          name: metadata.name || file.name,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          category: metadata.category || 'document',
          tags: metadata.tags || [],
          version: metadata.version || '1.0',
          description: metadata.description || ''
        })
        .select()
        .single();

      if (docError) throw docError;
      return docData;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  async createVersion(documentId: string, file: File, version: string, notes: string = ''): Promise<DocumentVersion> {
    try {
      // Get original document
      const { data: originalDoc, error: fetchError } = await supabase
        .from('documents')
        .select('project_id, name')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;
      if (!originalDoc) throw new Error('Document not found');

      // Generate unique filename for new version
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_v${version}_${originalDoc.name}.${fileExt}`;
      const filePath = `projects/${originalDoc.project_id}/versions/${fileName}`;

      // Upload new version to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      // Insert version record
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          version: version,
          file_url: urlData.publicUrl,
          file_size: file.size,
          notes: notes
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update main document version
      await supabase
        .from('documents')
        .update({ 
          version: version,
          file_url: urlData.publicUrl,
          file_size: file.size
        })
        .eq('id', documentId);

      return versionData;
    } catch (error) {
      console.error('Error creating document version:', error);
      throw error;
    }
  },

  async getVersions(documentId: string): Promise<DocumentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching document versions:', error);
      return [];
    }
  },

  async update(id: string, updates: Partial<Document>): Promise<Document> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      // Get document info first to delete from storage
      const { data: doc, error: fetchError } = await supabase
        .from('documents')
        .select('file_url, project_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!doc) throw new Error('Document not found');

      // Extract file path from URL
      const urlParts = doc.file_url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'project-documents');
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        // Delete from storage
        await supabase.storage
          .from('project-documents')
          .remove([filePath]);
      }

      // Delete document versions first
      await supabase
        .from('document_versions')
        .delete()
        .eq('document_id', id);

      // Delete document record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  async searchDocuments(projectId: string, query: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,file_name.ilike.%${query}%`)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  },

  async getDocumentsByCategory(projectId: string, category: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .eq('category', category)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      return [];
    }
  }
};
