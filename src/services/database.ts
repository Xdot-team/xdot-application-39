import { supabase } from '@/integrations/supabase/client';
import { transformDatabaseProject, transformProjectToDatabase } from '@/utils/projectTransforms';

// Project services
export const projectService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database results to match Project interface
      return (data || []).map(transformDatabaseProject);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data ? transformDatabaseProject(data) : null;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  async create(project: any) {
    try {
      const dbProject = transformProjectToDatabase(project);
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...dbProject,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return transformDatabaseProject(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const dbUpdates = transformProjectToDatabase(updates);
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return transformDatabaseProject(data);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
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

// Remove the old documentService and replace with import
import { documentService } from './documentService';

// RFI services
export const rfiService = {
  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('rfis')
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
        .from('rfis')
        .insert(rfi)
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
        .from('rfis')
        .update(updates)
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
        .from('submittals')
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
        .from('submittals')
        .insert(submittal)
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
        .from('submittals')
        .update(updates)
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
