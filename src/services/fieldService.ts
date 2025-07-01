
import { supabase } from '@/integrations/supabase/client';

// Field Sites Service
export const fieldSitesService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('field_sites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching field sites:', error);
      throw error;
    }
  },

  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('field_sites')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching field sites for project:', error);
      throw error;
    }
  },

  async create(siteData: any) {
    try {
      const { data, error } = await supabase
        .from('field_sites')
        .insert(siteData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating field site:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('field_sites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating field site:', error);
      throw error;
    }
  }
};

// Punchlist Items Service
export const punchlistService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('punchlist_items')
        .select(`
          *,
          field_sites(name, address),
          projects(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching punchlist items:', error);
      throw error;
    }
  },

  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('punchlist_items')
        .select(`
          *,
          field_sites(name, address)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching punchlist items for project:', error);
      throw error;
    }
  },

  async create(itemData: any) {
    try {
      const { data, error } = await supabase
        .from('punchlist_items')
        .insert(itemData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating punchlist item:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('punchlist_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating punchlist item:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('punchlist_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting punchlist item:', error);
      throw error;
    }
  }
};

// Work Orders Service
export const workOrdersService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          field_sites(name, address),
          projects(name),
          punchlist_items(description, severity)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching work orders:', error);
      throw error;
    }
  },

  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          field_sites(name, address),
          punchlist_items(description, severity)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching work orders for project:', error);
      throw error;
    }
  },

  async create(workOrderData: any) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .insert(workOrderData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating work order:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating work order:', error);
      throw error;
    }
  }
};

// Field Workers Service
export const fieldWorkersService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .select(`
          *,
          projects(name),
          field_sites(name, address)
        `)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching field workers:', error);
      throw error;
    }
  },

  async getActive() {
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .select(`
          *,
          projects(name),
          field_sites(name, address)
        `)
        .eq('status', 'active')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active field workers:', error);
      throw error;
    }
  },

  async create(workerData: any) {
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .insert(workerData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating field worker:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating field worker:', error);
      throw error;
    }
  },

  async updateLocation(id: string, coordinates: { lat: number; lng: number }) {
    try {
      const { data, error } = await supabase
        .from('field_workers')
        .update({
          current_location: `POINT(${coordinates.lng} ${coordinates.lat})`,
          last_location_update: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating worker location:', error);
      throw error;
    }
  }
};

// Subcontractors Service
export const subcontractorsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .order('company_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subcontractors:', error);
      throw error;
    }
  },

  async getActive() {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .eq('status', 'active')
        .order('company_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active subcontractors:', error);
      throw error;
    }
  },

  async create(subcontractorData: any) {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .insert(subcontractorData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating subcontractor:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating subcontractor:', error);
      throw error;
    }
  }
};

// Utility Adjustments Service
export const utilityAdjustmentsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('utility_adjustments')
        .select(`
          *,
          projects(name),
          field_sites(name, address)
        `)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching utility adjustments:', error);
      throw error;
    }
  },

  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('utility_adjustments')
        .select(`
          *,
          field_sites(name, address)
        `)
        .eq('project_id', projectId)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching utility adjustments for project:', error);
      throw error;
    }
  },

  async create(adjustmentData: any) {
    try {
      const { data, error } = await supabase
        .from('utility_adjustments')
        .insert(adjustmentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating utility adjustment:', error);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('utility_adjustments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating utility adjustment:', error);
      throw error;
    }
  }
};

// Equipment Tracking Service
export const equipmentService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('equipment_tracking')
        .select(`
          *,
          projects(name),
          field_sites(name, address),
          field_workers(name, employee_id)
        `)
        .order('equipment_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw error;
    }
  },

  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('equipment_tracking')
        .select(`
          *,
          field_sites(name, address),
          field_workers(name, employee_id)
        `)
        .eq('project_id', projectId)
        .order('equipment_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching equipment for project:', error);
      throw error;
    }
  },

  async updateLocation(id: string, coordinates: { lat: number; lng: number }) {
    try {
      const { data, error } = await supabase
        .from('equipment_tracking')
        .update({
          current_location: `POINT(${coordinates.lng} ${coordinates.lat})`,
          last_location_update: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating equipment location:', error);
      throw error;
    }
  }
};

// Dispatch Service
export const dispatchService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('dispatch_assignments')
        .select(`
          *,
          projects(name),
          work_orders(title, description),
          field_workers(name, employee_id),
          field_crews(name, specialty)
        `)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching dispatch assignments:', error);
      throw error;
    }
  },

  async getByProjectId(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('dispatch_assignments')
        .select(`
          *,
          work_orders(title, description),
          field_workers(name, employee_id),
          field_crews(name, specialty)
        `)
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching dispatch assignments for project:', error);
      throw error;
    }
  },

  async create(assignmentData: any) {
    try {
      const { data, error } = await supabase
        .from('dispatch_assignments')
        .insert(assignmentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating dispatch assignment:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: string, additionalData?: any) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      const { data, error } = await supabase
        .from('dispatch_assignments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating dispatch assignment status:', error);
      throw error;
    }
  }
};

// Field Photos Service
export const fieldPhotosService = {
  async upload(file: File, metadata: any) {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `field-photos/${metadata.project_id}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      // Insert photo metadata
      const photoData = {
        project_id: metadata.project_id,
        site_id: metadata.site_id,
        related_table: metadata.related_table,
        related_id: metadata.related_id,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        caption: metadata.caption || '',
        description: metadata.description || '',
        photographer: metadata.photographer,
        gps_coordinates: metadata.gps_coordinates,
        direction_facing: metadata.direction_facing,
        weather_conditions: metadata.weather_conditions,
        tags: metadata.tags || [],
        is_before_photo: metadata.is_before_photo || false,
        is_after_photo: metadata.is_after_photo || false,
        is_progress_photo: metadata.is_progress_photo || false,
        is_safety_photo: metadata.is_safety_photo || false,
        is_quality_photo: metadata.is_quality_photo || false,
        metadata: metadata.camera_metadata || {}
      };

      const { data, error } = await supabase
        .from('field_photos')
        .insert(photoData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading field photo:', error);
      throw error;
    }
  },

  async getByRelatedItem(relatedTable: string, relatedId: string) {
    try {
      const { data, error } = await supabase
        .from('field_photos')
        .select('*')
        .eq('related_table', relatedTable)
        .eq('related_id', relatedId)
        .order('photo_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching photos for related item:', error);
      throw error;
    }
  }
};

// Real-time subscriptions
export const fieldRealtimeService = {
  subscribeToPunchlistItems(callback: (payload: any) => void) {
    const channel = supabase
      .channel('punchlist-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'punchlist_items'
        },
        callback
      )
      .subscribe();

    return channel;
  },

  subscribeToWorkOrders(callback: (payload: any) => void) {
    const channel = supabase
      .channel('work-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_orders'
        },
        callback
      )
      .subscribe();

    return channel;
  },

  subscribeToFieldWorkers(callback: (payload: any) => void) {
    const channel = supabase
      .channel('field-workers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'field_workers'
        },
        callback
      )
      .subscribe();

    return channel;
  },

  subscribeToDispatchAssignments(callback: (payload: any) => void) {
    const channel = supabase
      .channel('dispatch-assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dispatch_assignments'
        },
        callback
      )
      .subscribe();

    return channel;
  }
};
