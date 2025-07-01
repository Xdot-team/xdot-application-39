
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
      // Validate file
      if (!file || file.size === 0) {
        throw new Error('Invalid file selected');
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = `projects/${projectId}/documents/${fileName}`;

      console.log('Uploading file:', { fileName, filePath, size: file.size });

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Failed to get file URL');
      }

      // Insert document metadata
      const documentData = {
        project_id: projectId,
        name: metadata.name || file.name,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        category: metadata.category || 'document',
        tags: metadata.tags || [],
        version: metadata.version || '1.0',
        description: metadata.description || ''
      };

      console.log('Inserting document metadata:', documentData);

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (docError) {
        console.error('Database error:', docError);
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('project-documents')
          .remove([filePath]);
        throw new Error(`Failed to save document: ${docError.message}`);
      }

      console.log('Document uploaded successfully:', docData);
      return docData;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  async createVersion(documentId: string, file: File, version: string, notes: string = ''): Promise<DocumentVersion> {
    try {
      // Validate inputs
      if (!file || !version.trim()) {
        throw new Error('File and version are required');
      }

      // Get original document
      const { data: originalDoc, error: fetchError } = await supabase
        .from('documents')
        .select('project_id, name, file_name')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;
      if (!originalDoc) throw new Error('Document not found');

      // Generate unique filename for new version
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const baseName = originalDoc.name.replace(/\.[^/.]+$/, "");
      const fileName = `${timestamp}_${baseName}_v${version}.${fileExt}`;
      const filePath = `projects/${originalDoc.project_id}/versions/${fileName}`;

      // Upload new version to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          contentType: file.type
        });

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

      // Update main document version and file reference
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

      // Extract file path from URL for deletion
      const url = new URL(doc.file_url);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'project-documents');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('project-documents')
          .remove([filePath]);
          
        if (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
        }
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
      if (!query.trim()) {
        return this.getByProjectId(projectId);
      }

      const searchTerm = `%${query.trim()}%`;
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},file_name.ilike.${searchTerm}`)
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
  },

  async getAllDocuments(): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          projects!inner(name)
        `)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all documents:', error);
      return [];
    }
  },

  // Enhanced download method with proper error handling
  async downloadDocument(fileUrl: string, fileName: string): Promise<void> {
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download initiated for:', fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error('Failed to download document');
    }
  }
};
