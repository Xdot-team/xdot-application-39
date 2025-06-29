
import { supabase } from '@/integrations/supabase/client';

// Project services
export const projectService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_manager:profiles!projects_project_manager_id_fkey(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_manager:profiles!projects_project_manager_id_fkey(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// RFI services
export const rfiService = {
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('rfis')
      .select(`
        *,
        created_by_profile:profiles!rfis_created_by_fkey(name),
        responded_by_profile:profiles!rfis_responded_by_fkey(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(rfi: any) {
    const { data, error } = await supabase
      .from('rfis')
      .insert(rfi)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('rfis')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Submittal services
export const submittalService = {
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('submittals')
      .select(`
        *,
        created_by_profile:profiles!submittals_created_by_fkey(name),
        reviewed_by_profile:profiles!submittals_reviewed_by_fkey(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(submittal: any) {
    const { data, error } = await supabase
      .from('submittals')
      .insert(submittal)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('submittals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Change Order services
export const changeOrderService = {
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('change_orders')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(changeOrder: any) {
    const { data, error } = await supabase
      .from('change_orders')
      .insert(changeOrder)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('change_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Document services
export const documentService = {
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by_profile:profiles!documents_uploaded_by_fkey(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(document: any) {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Project Notes services
export const projectNotesService = {
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('project_notes')
      .select(`
        *,
        author:profiles!project_notes_author_id_fkey(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(note: any) {
    const { data, error } = await supabase
      .from('project_notes')
      .insert(note)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('project_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Notification services
export const notificationService = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Profile services
export const profileService = {
  async getCurrent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(updates: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
