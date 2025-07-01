
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { 
  punchlistService, 
  workOrdersService, 
  fieldWorkersService, 
  subcontractorsService,
  utilityAdjustmentsService,
  equipmentService,
  dispatchService,
  fieldPhotosService,
  fieldRealtimeService
} from '@/services/fieldService';
import { toast } from '@/components/ui/sonner';

// Punchlist Items Hook
export const usePunchlistItems = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: punchlistItems = [], isLoading, error } = useQuery({
    queryKey: projectId ? ['punchlist-items', projectId] : ['punchlist-items'],
    queryFn: () => projectId ? punchlistService.getByProjectId(projectId) : punchlistService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: punchlistService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['punchlist-items'] });
      toast.success('Punchlist item created successfully');
    },
    onError: (error) => {
      console.error('Error creating punchlist item:', error);
      toast.error('Failed to create punchlist item');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      punchlistService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['punchlist-items'] });
      toast.success('Punchlist item updated successfully');
    },
    onError: (error) => {
      console.error('Error updating punchlist item:', error);
      toast.error('Failed to update punchlist item');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: punchlistService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['punchlist-items'] });
      toast.success('Punchlist item deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting punchlist item:', error);
      toast.error('Failed to delete punchlist item');
    }
  });

  // Real-time subscription
  useEffect(() => {
    const channel = fieldRealtimeService.subscribeToPunchlistItems((payload) => {
      console.log('Punchlist item updated:', payload);
      queryClient.invalidateQueries({ queryKey: ['punchlist-items'] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return {
    punchlistItems,
    isLoading,
    error,
    createPunchlistItem: createMutation.mutate,
    updatePunchlistItem: updateMutation.mutate,
    deletePunchlistItem: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};

// Work Orders Hook
export const useWorkOrders = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: workOrders = [], isLoading, error } = useQuery({
    queryKey: projectId ? ['work-orders', projectId] : ['work-orders'],
    queryFn: () => projectId ? workOrdersService.getByProjectId(projectId) : workOrdersService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: workOrdersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Work order created successfully');
    },
    onError: (error) => {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      workOrdersService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Work order updated successfully');
    },
    onError: (error) => {
      console.error('Error updating work order:', error);
      toast.error('Failed to update work order');
    }
  });

  // Real-time subscription
  useEffect(() => {
    const channel = fieldRealtimeService.subscribeToWorkOrders((payload) => {
      console.log('Work order updated:', payload);
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return {
    workOrders,
    isLoading,
    error,
    createWorkOrder: createMutation.mutate,
    updateWorkOrder: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};

// Field Workers Hook
export const useFieldWorkers = () => {
  const queryClient = useQueryClient();
  
  const { data: fieldWorkers = [], isLoading, error } = useQuery({
    queryKey: ['field-workers'],
    queryFn: fieldWorkersService.getAll,
  });

  const { data: activeWorkers = [] } = useQuery({
    queryKey: ['field-workers', 'active'],
    queryFn: fieldWorkersService.getActive,
  });

  const createMutation = useMutation({
    mutationFn: fieldWorkersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-workers'] });
      toast.success('Field worker created successfully');
    },
    onError: (error) => {
      console.error('Error creating field worker:', error);
      toast.error('Failed to create field worker');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      fieldWorkersService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-workers'] });
      toast.success('Field worker updated successfully');
    },
    onError: (error) => {
      console.error('Error updating field worker:', error);
      toast.error('Failed to update field worker');
    }
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, coordinates }: { id: string; coordinates: { lat: number; lng: number } }) => 
      fieldWorkersService.updateLocation(id, coordinates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-workers'] });
    },
    onError: (error) => {
      console.error('Error updating worker location:', error);
    }
  });

  // Real-time subscription
  useEffect(() => {
    const channel = fieldRealtimeService.subscribeToFieldWorkers((payload) => {
      console.log('Field worker updated:', payload);
      queryClient.invalidateQueries({ queryKey: ['field-workers'] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return {
    fieldWorkers,
    activeWorkers,
    isLoading,
    error,
    createFieldWorker: createMutation.mutate,
    updateFieldWorker: updateMutation.mutate,
    updateWorkerLocation: updateLocationMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};

// Subcontractors Hook
export const useSubcontractors = () => {
  const queryClient = useQueryClient();
  
  const { data: subcontractors = [], isLoading, error } = useQuery({
    queryKey: ['subcontractors'],
    queryFn: subcontractorsService.getAll,
  });

  const { data: activeSubcontractors = [] } = useQuery({
    queryKey: ['subcontractors', 'active'],
    queryFn: subcontractorsService.getActive,
  });

  const createMutation = useMutation({
    mutationFn: subcontractorsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors'] });
      toast.success('Subcontractor created successfully');
    },
    onError: (error) => {
      console.error('Error creating subcontractor:', error);
      toast.error('Failed to create subcontractor');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      subcontractorsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors'] });
      toast.success('Subcontractor updated successfully');
    },
    onError: (error) => {
      console.error('Error updating subcontractor:', error);
      toast.error('Failed to update subcontractor');
    }
  });

  return {
    subcontractors,
    activeSubcontractors,
    isLoading,
    error,
    createSubcontractor: createMutation.mutate,
    updateSubcontractor: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};

// Utility Adjustments Hook
export const useUtilityAdjustments = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: utilityAdjustments = [], isLoading, error } = useQuery({
    queryKey: projectId ? ['utility-adjustments', projectId] : ['utility-adjustments'],
    queryFn: () => projectId ? utilityAdjustmentsService.getByProjectId(projectId) : utilityAdjustmentsService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: utilityAdjustmentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-adjustments'] });
      toast.success('Utility adjustment created successfully');
    },
    onError: (error) => {
      console.error('Error creating utility adjustment:', error);
      toast.error('Failed to create utility adjustment');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      utilityAdjustmentsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-adjustments'] });
      toast.success('Utility adjustment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating utility adjustment:', error);
      toast.error('Failed to update utility adjustment');
    }
  });

  return {
    utilityAdjustments,
    isLoading,
    error,
    createUtilityAdjustment: createMutation.mutate,
    updateUtilityAdjustment: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};

// Equipment Tracking Hook
export const useEquipmentTracking = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: equipment = [], isLoading, error } = useQuery({
    queryKey: projectId ? ['equipment', projectId] : ['equipment'],
    queryFn: () => projectId ? equipmentService.getByProjectId(projectId) : equipmentService.getAll(),
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, coordinates }: { id: string; coordinates: { lat: number; lng: number } }) => 
      equipmentService.updateLocation(id, coordinates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      console.error('Error updating equipment location:', error);
    }
  });

  return {
    equipment,
    isLoading,
    error,
    updateEquipmentLocation: updateLocationMutation.mutate
  };
};

// Dispatch Assignments Hook
export const useDispatchAssignments = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: projectId ? ['dispatch-assignments', projectId] : ['dispatch-assignments'],
    queryFn: () => projectId ? dispatchService.getByProjectId(projectId) : dispatchService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: dispatchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-assignments'] });
      toast.success('Dispatch assignment created successfully');
    },
    onError: (error) => {
      console.error('Error creating dispatch assignment:', error);
      toast.error('Failed to create dispatch assignment');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, additionalData }: { id: string; status: string; additionalData?: any }) => 
      dispatchService.updateStatus(id, status, additionalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-assignments'] });
      toast.success('Assignment status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating assignment status:', error);
      toast.error('Failed to update assignment status');
    }
  });

  // Real-time subscription
  useEffect(() => {
    const channel = fieldRealtimeService.subscribeToDispatchAssignments((payload) => {
      console.log('Dispatch assignment updated:', payload);
      queryClient.invalidateQueries({ queryKey: ['dispatch-assignments'] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return {
    assignments,
    isLoading,
    error,
    createAssignment: createMutation.mutate,
    updateAssignmentStatus: updateStatusMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateStatusMutation.isPending
  };
};

// Field Photos Hook
export const useFieldPhotos = (relatedTable?: string, relatedId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ['field-photos', relatedTable, relatedId],
    queryFn: () => relatedTable && relatedId ? fieldPhotosService.getByRelatedItem(relatedTable, relatedId) : Promise.resolve([]),
    enabled: !!(relatedTable && relatedId)
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: any }) => 
      fieldPhotosService.upload(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-photos'] });
      toast.success('Photo uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    }
  });

  return {
    photos,
    isLoading,
    error,
    uploadPhoto: uploadMutation.mutate,
    isUploading: uploadMutation.isPending
  };
};

// GPS Location Hook
export const useGPSLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const watchLocation = (callback: (location: { lat: number; lng: number }) => void) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(newLocation);
        callback(newLocation);
        setError(null);
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    );

    return watchId;
  };

  const stopWatchingLocation = (watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  };

  return {
    location,
    error,
    isLoading,
    getCurrentLocation,
    watchLocation,
    stopWatchingLocation
  };
};
