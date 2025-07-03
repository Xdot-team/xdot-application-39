import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PayrollCalculation {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  regular_hours: number;
  overtime_hours: number;
  double_time_hours: number;
  holiday_hours: number;
  vacation_hours: number;
  sick_hours: number;
  regular_rate: number;
  overtime_rate: number;
  holiday_rate: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  other_deductions: number;
  net_pay: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  calculation_date: string;
  approved_at?: string;
  approved_by?: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxes: number;
  pendingCalculations: number;
  approvedCalculations: number;
}

export function usePayrollCalculations() {
  const [calculations, setCalculations] = useState<PayrollCalculation[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payroll_calculations')
        .select('*')
        .order('pay_period_end', { ascending: false });

      if (error) throw error;

      setCalculations((data as PayrollCalculation[]) || []);
      
      // Calculate summary
      const totalEmployees = new Set(data?.map(calc => calc.employee_id)).size;
      const totalGrossPay = data?.reduce((sum, calc) => sum + calc.gross_pay, 0) || 0;
      const totalNetPay = data?.reduce((sum, calc) => sum + calc.net_pay, 0) || 0;
      const totalTaxes = data?.reduce((sum, calc) => 
        sum + calc.federal_tax + calc.state_tax + calc.social_security + calc.medicare, 0) || 0;
      const pendingCalculations = data?.filter(calc => calc.status === 'draft').length || 0;
      const approvedCalculations = data?.filter(calc => calc.status === 'approved').length || 0;

      setSummary({
        totalEmployees,
        totalGrossPay,
        totalNetPay,
        totalTaxes,
        pendingCalculations,
        approvedCalculations,
      });
    } catch (error) {
      console.error('Error fetching payroll calculations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payroll calculations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = async (employeeId: string, payPeriodStart: string, payPeriodEnd: string) => {
    try {
      // Get employee data
      const { data: employee, error: empError } = await supabase
        .from('employee_profiles')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (empError) throw empError;

      // Calculate hours based on actual time records (simplified for now)
      const regularHours = 40; // This would come from time tracking
      const overtimeHours = Math.max(0, regularHours - 40);
      const regularRate = employee.pay_rate;
      const overtimeRate = regularRate * 1.5;

      // Calculate gross pay
      const grossPay = (regularHours * regularRate) + (overtimeHours * overtimeRate);

      // Calculate taxes (simplified rates)
      const federalTax = grossPay * 0.12; // 12% federal
      const stateTax = grossPay * 0.05; // 5% state
      const socialSecurity = grossPay * 0.062; // 6.2%
      const medicare = grossPay * 0.0145; // 1.45%

      const netPay = grossPay - federalTax - stateTax - socialSecurity - medicare;

      const calculationData = {
        employee_id: employeeId,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        regular_hours: regularHours,
        overtime_hours: overtimeHours,
        double_time_hours: 0,
        holiday_hours: 0,
        vacation_hours: 0,
        sick_hours: 0,
        regular_rate: regularRate,
        overtime_rate: overtimeRate,
        holiday_rate: regularRate,
        gross_pay: grossPay,
        federal_tax: federalTax,
        state_tax: stateTax,
        social_security: socialSecurity,
        medicare: medicare,
        other_deductions: 0,
        net_pay: netPay,
        status: 'calculated' as const,
      };

      const { data, error } = await supabase
        .from('payroll_calculations')
        .insert([calculationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payroll calculated successfully",
      });

      fetchCalculations();
      return data;
    } catch (error) {
      console.error('Error calculating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to calculate payroll",
        variant: "destructive",
      });
      throw error;
    }
  };

  const approvePayroll = async (calculationId: string, approvedBy: string) => {
    try {
      const { error } = await supabase
        .from('payroll_calculations')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: approvedBy,
        })
        .eq('id', calculationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payroll approved successfully",
      });

      fetchCalculations();
    } catch (error) {
      console.error('Error approving payroll:', error);
      toast({
        title: "Error",
        description: "Failed to approve payroll",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  return {
    calculations,
    summary,
    loading,
    fetchCalculations,
    calculatePayroll,
    approvePayroll,
  };
}