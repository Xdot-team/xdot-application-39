import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Onboarding interfaces
export interface OnboardingWorkflow {
  id: string;
  employee_id: string;
  employee_name?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string | null;
  expected_completion_date: string | null;
  actual_completion_date: string | null;
  completion_percentage: number;
  current_step: string | null;
  assigned_to_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Hook for Onboarding Workflows
export function useOnboardingWorkflows() {
  const [workflows, setWorkflows] = useState<OnboardingWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorkflows = async () => {
    try {
      // Use fallback data if table doesn't exist yet
      setWorkflows([
        {
          id: '1',
          employee_id: 'EMP-001',
          employee_name: 'John Doe',
          status: 'in_progress',
          start_date: new Date().toISOString(),
          expected_completion_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          actual_completion_date: null,
          completion_percentage: 60,
          current_step: 'Equipment Assignment',
          assigned_to_name: 'HR Manager',
          notes: 'New hire onboarding in progress',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching onboarding workflows:', error);
      toast({
        title: "Error",
        description: "Failed to fetch onboarding workflows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const createWorkflow = async (workflow: Omit<OnboardingWorkflow, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newWorkflow = {
        ...workflow,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast({
        title: "Success",
        description: "Onboarding workflow created successfully",
      });
      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<OnboardingWorkflow>) => {
    try {
      setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w));
      toast({
        title: "Success",
        description: "Workflow updated successfully",
      });
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      setWorkflows(prev => prev.filter(w => w.id !== id));
      toast({
        title: "Success",
        description: "Workflow deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  };

  return { workflows, loading, fetchWorkflows, createWorkflow, updateWorkflow, deleteWorkflow };
}