import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeProfile, TimeClockRecord, EmployeeSchedule, WorkforceMetrics, EmployeeTrainingRecord, EmployeePerformanceReview } from '@/types/employee';
import { toast } from '@/hooks/use-toast';

// Employee Profiles Hook
export const useEmployeeProfiles = () => {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      toast({
        title: "Error",
        description: "Failed to fetch employee profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employee: Omit<EmployeeProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .insert([employee])
        .select()
        .single();

      if (error) throw error;
      
      setEmployees(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<EmployeeProfile>) => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEmployees(prev => prev.map(e => e.id === id ? data : e));
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employee_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees
  };
};

// Time Clock Hook
export const useTimeClock = (employeeId?: string) => {
  const [timeRecords, setTimeRecords] = useState<TimeClockRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeRecords = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('time_clock_records')
        .select('*')
        .order('clock_in', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTimeRecords(data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch time records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async (employeeId: string, location?: any, photo?: string) => {
    try {
      const now = new Date().toISOString();
      const record = {
        employee_id: employeeId,
        clock_in: now,
        location,
        clock_in_photo: photo,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('time_clock_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      
      setTimeRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Clocked in successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to clock in",
        variant: "destructive",
      });
      throw err;
    }
  };

  const clockOut = async (recordId: string, photo?: string) => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('time_clock_records')
        .update({
          clock_out: now,
          clock_out_photo: photo
        })
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;
      
      setTimeRecords(prev => prev.map(r => r.id === recordId ? data : r));
      toast({
        title: "Success",
        description: "Clocked out successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to clock out",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTimeRecords();
  }, [employeeId]);

  return {
    timeRecords,
    loading,
    clockIn,
    clockOut,
    refetch: fetchTimeRecords
  };
};

// Employee Scheduling Hook
export const useEmployeeScheduling = () => {
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('employee_schedules')
        .select('*, employee_profiles(first_name, last_name)')
        .order('schedule_date', { ascending: true });

      if (startDate && endDate) {
        query = query.gte('schedule_date', startDate).lte('schedule_date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (schedule: Omit<EmployeeSchedule, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employee_schedules')
        .insert([schedule])
        .select()
        .single();

      if (error) throw error;
      
      setSchedules(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Schedule created successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<EmployeeSchedule>) => {
    try {
      const { data, error } = await supabase
        .from('employee_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSchedules(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    createSchedule,
    updateSchedule,
    refetch: fetchSchedules
  };
};

// Training Management Hook
export const useEmployeeTraining = (employeeId?: string) => {
  const [trainingRecords, setTrainingRecords] = useState<EmployeeTrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainingRecords = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('employee_training_records')
        .select('*')
        .order('start_date', { ascending: false });

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTrainingRecords(data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch training records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTrainingRecord = async (record: Omit<EmployeeTrainingRecord, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employee_training_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      
      setTrainingRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Training record added successfully",
      });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add training record",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTrainingRecords();
  }, [employeeId]);

  return {
    trainingRecords,
    loading,
    addTrainingRecord,
    refetch: fetchTrainingRecords
  };
};

// Workforce Metrics Hook
export const useWorkforceMetrics = () => {
  const [metrics, setMetrics] = useState<WorkforceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const { data: employees, error: employeeError } = await supabase
        .from('employee_profiles')
        .select('*');

      if (employeeError) throw employeeError;

      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(e => e.status === 'active').length || 0;
      const onLeaveEmployees = employees?.filter(e => e.status === 'on_leave').length || 0;
      const terminatedEmployees = employees?.filter(e => e.status === 'terminated').length || 0;

      // Calculate payroll costs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: payrollRecords, error: payrollError } = await supabase
        .from('employee_payroll_records')
        .select('net_pay')
        .gte('pay_period_start', thirtyDaysAgo.toISOString().split('T')[0]);

      if (payrollError) throw payrollError;

      const totalPayrollCost = payrollRecords?.reduce((sum, record) => sum + (record.net_pay || 0), 0) || 0;

      // Calculate training completion rate
      const { data: trainingRecords, error: trainingError } = await supabase
        .from('employee_training_records')
        .select('status');

      if (trainingError) throw trainingError;

      const completedTraining = trainingRecords?.filter(t => t.status === 'completed').length || 0;
      const totalTraining = trainingRecords?.length || 0;
      const trainingCompletionRate = totalTraining > 0 ? (completedTraining / totalTraining) * 100 : 0;

      const calculatedMetrics: WorkforceMetrics = {
        totalEmployees,
        activeEmployees,
        onLeaveEmployees,
        terminatedEmployees,
        averageHoursPerWeek: 0, // TODO: Calculate from time records
        overtimePercentage: 0, // TODO: Calculate from time records
        totalPayrollCost,
        trainingCompletionRate,
        performanceAverageRating: 0, // TODO: Calculate from performance reviews
        turnoverRate: 0 // TODO: Calculate based on terminations
      };

      setMetrics(calculatedMetrics);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to calculate workforce metrics",
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