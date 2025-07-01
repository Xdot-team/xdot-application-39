
import { supabase } from '@/integrations/supabase/client';

// Project services
export const projectService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('projects' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('projects' as any)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  async create(project: any) {
    try {
      const { data, error } = await supabase
        .from('projects' as any)
        .insert({
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('projects' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('projects' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// Document services
export const documentService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('documents' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  },

  async upload(file: File, projectId: string, metadata: any = {}) {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      // Insert document metadata
      const { data: docData, error: docError } = await supabase
        .from('documents' as any)
        .insert({
          project_id: projectId,
          name: metadata.name || file.name,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          category: metadata.category || 'document',
          tags: metadata.tags || [],
          version: metadata.version || '1.0'
        } as any)
        .select()
        .single();

      if (docError) throw docError;

      return docData;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  async createVersion(documentId: string, file: File, version: string, notes: string = '') {
    try {
      // Get original document
      const { data: originalDoc, error: fetchError } = await supabase
        .from('documents' as any)
        .select('project_id')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;
      if (!originalDoc) throw new Error('Document not found');

      // Generate unique filename for new version
      const fileName = `${Date.now()}_v${version}_${file.name}`;
      const filePath = `projects/${originalDoc.project_id}/${fileName}`;

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
        .from('document_versions' as any)
        .insert({
          document_id: documentId,
          version: version,
          file_url: urlData.publicUrl,
          file_size: file.size,
          notes: notes
        } as any)
        .select()
        .single();

      if (versionError) throw versionError;

      // Update main document version
      await supabase
        .from('documents' as any)
        .update({ 
          version: version,
          file_url: urlData.publicUrl,
          file_size: file.size
        } as any)
        .eq('id', documentId);

      return versionData;
    } catch (error) {
      console.error('Error creating document version:', error);
      throw error;
    }
  },

  async getVersions(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('document_versions' as any)
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

  async delete(id: string) {
    try {
      // Get document info first to delete from storage
      const { data: doc, error: fetchError } = await supabase
        .from('documents' as any)
        .select('file_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Extract file path from URL
      const urlParts = doc.file_url.split('/');
      const filePath = urlParts.slice(-3).join('/'); // projects/projectId/filename

      // Delete from storage
      await supabase.storage
        .from('project-documents')
        .remove([filePath]);

      // Delete document record
      const { error } = await supabase
        .from('documents' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};

// RFI services
export const rfiService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('rfis' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching RFIs:', error);
      return [];
    }
  },

  async create(rfi: any) {
    try {
      const { data, error } = await supabase
        .from('rfis' as any)
        .insert(rfi as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating RFI:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('rfis' as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating RFI:', error);
      throw error;
    }
  }
};

// Submittal services
export const submittalService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('submittals' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching submittals:', error);
      return [];
    }
  },

  async create(submittal: any) {
    try {
      const { data, error } = await supabase
        .from('submittals' as any)
        .insert(submittal as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating submittal:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('submittals' as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating submittal:', error);
      throw error;
    }
  }
};

// Change Order services
export const changeOrderService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('change_orders')
        .select('*')
        .eq('project_id', projectId)
        .order('request_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching change orders:', error);
      return [];
    }
  },

  async create(changeOrder: any) {
    try {
      const { data, error } = await supabase
        .from('change_orders')
        .insert(changeOrder)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating change order:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('change_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating change order:', error);
      throw error;
    }
  }
};

// Project Notes services
export const projectNotesService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project notes:', error);
      return [];
    }
  },

  async create(note: any) {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .insert(note)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project note:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project note:', error);
      throw error;
    }
  }
};

// Notification services
export const notificationService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markAsRead(id: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};

// Profile services (kept for compatibility)
export const profileService = {
  async getCurrent() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Since we don't have auth enabled, return a mock profile
      return {
        id: 'mock-user-id',
        name: 'Demo User',
        email: 'demo@xdotcontractor.com',
        role: 'admin'
      };
    } catch (error) {
      console.error('Error fetching current profile:', error);
      return null;
    }
  },

  async update(updates: any) {
    try {
      // Mock implementation for now
      console.log('Profile update requested:', updates);
      return updates;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};
