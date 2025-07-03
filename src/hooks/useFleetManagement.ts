import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FleetVehicle, FleetMaintenanceRecord, FleetFuelRecord, FleetTripLog, FleetInspection, FleetMetrics } from '@/types/fleet';
import { toast } from '@/hooks/use-toast';

// Fleet Vehicles Hook
export const useFleetVehicles = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .order('vehicle_number');

      if (error) throw error;
      setVehicles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      toast({
        title: "Error",
        description: "Failed to fetch fleet vehicles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicle: Omit<FleetVehicle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert([vehicle])
        .select()
        .single();

      if (error) throw error;
      
      setVehicles(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<FleetVehicle>) => {
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setVehicles(prev => prev.map(v => v.id === id ? data : v));
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fleet_vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchVehicles();

    // Set up real-time subscription for fleet vehicles
    const channel = supabase
      .channel('fleet-vehicles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fleet_vehicles'
        },
        (payload) => {
          console.log('Fleet vehicle change:', payload);
          fetchVehicles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
};

// Fleet Maintenance Hook
export const useFleetMaintenance = (vehicleId?: string) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<FleetMaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('fleet_maintenance_records')
        .select('*')
        .order('service_date', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMaintenanceRecords(data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch maintenance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMaintenanceRecord = async (record: Omit<FleetMaintenanceRecord, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fleet_maintenance_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      
      setMaintenanceRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Maintenance record added successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add maintenance record",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [vehicleId]);

  return {
    maintenanceRecords,
    loading,
    addMaintenanceRecord,
    refetch: fetchMaintenance
  };
};

// Fleet Fuel Tracking Hook
export const useFleetFuel = (vehicleId?: string) => {
  const [fuelRecords, setFuelRecords] = useState<FleetFuelRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('fleet_fuel_records')
        .select('*')
        .order('fuel_date', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setFuelRecords(data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch fuel records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFuelRecord = async (record: Omit<FleetFuelRecord, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fleet_fuel_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      
      setFuelRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Fuel record added successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add fuel record",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchFuelRecords();
  }, [vehicleId]);

  return {
    fuelRecords,
    loading,
    addFuelRecord,
    refetch: fetchFuelRecords
  };
};

// Fleet Metrics Hook
export const useFleetMetrics = () => {
  const [metrics, setMetrics] = useState<FleetMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles with basic counts
      const { data: vehicles, error: vehicleError } = await supabase
        .from('fleet_vehicles')
        .select('*');

      if (vehicleError) throw vehicleError;

      const totalVehicles = vehicles?.length || 0;
      const activeVehicles = vehicles?.filter(v => v.status === 'in_use').length || 0;
      const availableVehicles = vehicles?.filter(v => v.status === 'available').length || 0;
      const maintenanceVehicles = vehicles?.filter(v => v.status === 'maintenance').length || 0;
      const offlineVehicles = vehicles?.filter(v => v.status === 'offline').length || 0;

      // Calculate utilization rate
      const utilizationRate = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;

      // Fetch maintenance costs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: maintenanceRecords, error: maintenanceError } = await supabase
        .from('fleet_maintenance_records')
        .select('cost')
        .gte('service_date', thirtyDaysAgo.toISOString().split('T')[0]);

      if (maintenanceError) throw maintenanceError;

      const totalMaintenanceCost = maintenanceRecords?.reduce((sum, record) => sum + (record.cost || 0), 0) || 0;

      // Calculate overdue maintenance
      const today = new Date().toISOString().split('T')[0];
      const overdueVehicles = vehicles?.filter(v => 
        v.registration_expiry && v.registration_expiry < today ||
        v.inspection_expiry && v.inspection_expiry < today
      ) || [];

      const calculatedMetrics: FleetMetrics = {
        totalVehicles,
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        offlineVehicles,
        utilizationRate,
        averageFuelEfficiency: 0, // TODO: Calculate from fuel records
        totalMaintenanceCost,
        overdueMaintenanceCount: overdueVehicles.length
      };

      setMetrics(calculatedMetrics);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to calculate fleet metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateMetrics();
  }, []);

  return {
    metrics,
    loading,
    refetch: calculateMetrics
  };
};