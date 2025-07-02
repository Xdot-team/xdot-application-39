import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Plus, 
  Calculator, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Eye,
  Calendar
} from 'lucide-react';

interface PayrollCalculation {
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
  overtime_rate?: number;
  holiday_rate?: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  other_deductions: number;
  net_pay: number;
  status: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  pay_rate: number;
  pay_type: string;
}

export function PayrollIntegration() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollCalculations, setPayrollCalculations] = useState<PayrollCalculation[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = useState(false);

  const [calculationForm, setCalculationForm] = useState({
    employee_id: '',
    pay_period_start: '',
    pay_period_end: '',
    regular_hours: 0,
    overtime_hours: 0,
    double_time_hours: 0,
    holiday_hours: 0,
    vacation_hours: 0,
    sick_hours: 0,
    other_deductions: 0
  });

  useEffect(() => {
    fetchEmployees();
    fetchPayrollCalculations();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('id, first_name, last_name, employee_id, department, pay_rate, pay_type')
        .eq('status', 'active')
        .order('last_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchPayrollCalculations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payroll_calculations')
        .select('*')
        .order('pay_period_end', { ascending: false });

      if (error) throw error;
      setPayrollCalculations(data || []);
    } catch (error) {
      console.error('Error fetching payroll calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = async () => {
    try {
      const employee = employees.find(e => e.id === calculationForm.employee_id);
      if (!employee) return;

      const regularRate = employee.pay_rate;
      const overtimeRate = regularRate * 1.5;
      const holidayRate = regularRate * 2;

      // Calculate gross pay
      const regularPay = calculationForm.regular_hours * regularRate;
      const overtimePay = calculationForm.overtime_hours * overtimeRate;
      const doubleTimePay = calculationForm.double_time_hours * (regularRate * 2);
      const holidayPay = calculationForm.holiday_hours * holidayRate;
      const vacationPay = calculationForm.vacation_hours * regularRate;
      const sickPay = calculationForm.sick_hours * regularRate;

      const grossPay = regularPay + overtimePay + doubleTimePay + holidayPay + vacationPay + sickPay;

      // Calculate taxes (simplified calculations)
      const federalTax = grossPay * 0.12; // 12% federal tax rate
      const stateTax = grossPay * 0.05; // 5% state tax rate
      const socialSecurity = grossPay * 0.062; // 6.2% SS
      const medicare = grossPay * 0.0145; // 1.45% Medicare

      const totalDeductions = federalTax + stateTax + socialSecurity + medicare + calculationForm.other_deductions;
      const netPay = grossPay - totalDeductions;

      const payrollData = {
        ...calculationForm,
        regular_rate: regularRate,
        overtime_rate: overtimeRate,
        holiday_rate: holidayRate,
        gross_pay: grossPay,
        federal_tax: federalTax,
        state_tax: stateTax,
        social_security: socialSecurity,
        medicare: medicare,
        net_pay: netPay,
        status: 'draft'
      };

      const { error } = await supabase
        .from('payroll_calculations')
        .insert([payrollData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payroll calculation created successfully",
      });

      setCalculationForm({
        employee_id: '',
        pay_period_start: '',
        pay_period_end: '',
        regular_hours: 0,
        overtime_hours: 0,
        double_time_hours: 0,
        holiday_hours: 0,
        vacation_hours: 0,
        sick_hours: 0,
        other_deductions: 0
      });
      setIsCalculateDialogOpen(false);
      fetchPayrollCalculations();
    } catch (error) {
      console.error('Error calculating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to calculate payroll",
        variant: "destructive",
      });
    }
  };

  const approvePayroll = async (payrollId: string) => {
    try {
      const { error } = await supabase
        .from('payroll_calculations')
        .update({
          status: 'approved',
          approved_by: 'Current User', // Replace with actual user
          approved_at: new Date().toISOString()
        })
        .eq('id', payrollId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payroll approved successfully",
      });

      fetchPayrollCalculations();
    } catch (error) {
      console.error('Error approving payroll:', error);
      toast({
        title: "Error",
        description: "Failed to approve payroll",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'paid': return 'bg-blue-500';
      case 'pending_approval': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentPayPeriod = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const totalGrossPay = payrollCalculations
    .filter(p => p.status === 'approved' || p.status === 'paid')
    .reduce((sum, p) => sum + p.gross_pay, 0);

  const totalNetPay = payrollCalculations
    .filter(p => p.status === 'approved' || p.status === 'paid')
    .reduce((sum, p) => sum + p.net_pay, 0);

  const pendingApprovals = payrollCalculations.filter(p => p.status === 'pending_approval').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Integration</h1>
          <p className="text-muted-foreground">
            Calculate, approve, and manage employee payroll
          </p>
        </div>
        <Dialog open={isCalculateDialogOpen} onOpenChange={setIsCalculateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Calculate Payroll
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Calculate Employee Payroll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee *</Label>
                  <Select
                    value={calculationForm.employee_id}
                    onValueChange={(value) => setCalculationForm(prev => ({ ...prev, employee_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - ${employee.pay_rate}/{employee.pay_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pay Period</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const period = getCurrentPayPeriod();
                      setCalculationForm(prev => ({
                        ...prev,
                        pay_period_start: period.start,
                        pay_period_end: period.end
                      }));
                    }}
                  >
                    Use Current Week
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay_period_start">Pay Period Start *</Label>
                  <Input
                    id="pay_period_start"
                    type="date"
                    value={calculationForm.pay_period_start}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, pay_period_start: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay_period_end">Pay Period End *</Label>
                  <Input
                    id="pay_period_end"
                    type="date"
                    value={calculationForm.pay_period_end}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, pay_period_end: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="regular_hours">Regular Hours</Label>
                  <Input
                    id="regular_hours"
                    type="number"
                    step="0.25"
                    value={calculationForm.regular_hours}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, regular_hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtime_hours">Overtime Hours</Label>
                  <Input
                    id="overtime_hours"
                    type="number"
                    step="0.25"
                    value={calculationForm.overtime_hours}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, overtime_hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="double_time_hours">Double Time Hours</Label>
                  <Input
                    id="double_time_hours"
                    type="number"
                    step="0.25"
                    value={calculationForm.double_time_hours}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, double_time_hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holiday_hours">Holiday Hours</Label>
                  <Input
                    id="holiday_hours"
                    type="number"
                    step="0.25"
                    value={calculationForm.holiday_hours}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, holiday_hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacation_hours">Vacation Hours</Label>
                  <Input
                    id="vacation_hours"
                    type="number"
                    step="0.25"
                    value={calculationForm.vacation_hours}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, vacation_hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sick_hours">Sick Hours</Label>
                  <Input
                    id="sick_hours"
                    type="number"
                    step="0.25"
                    value={calculationForm.sick_hours}
                    onChange={(e) => setCalculationForm(prev => ({ ...prev, sick_hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_deductions">Other Deductions ($)</Label>
                <Input
                  id="other_deductions"
                  type="number"
                  step="0.01"
                  value={calculationForm.other_deductions}
                  onChange={(e) => setCalculationForm(prev => ({ ...prev, other_deductions: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCalculateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={calculatePayroll}>
                  <Calculator className="h-4 w-4 mr-1" />
                  Calculate Payroll
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{payrollCalculations.length}</div>
            <div className="text-xs text-muted-foreground">
              All time
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingApprovals}</div>
            <div className="text-xs text-muted-foreground">
              Awaiting approval
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Gross Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${totalGrossPay.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Approved payroll
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Net Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ${totalNetPay.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              After deductions
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Pay Period Calculations</CardTitle>
              <CardDescription>
                {payrollCalculations.filter(p => p.status === 'draft' || p.status === 'pending_approval').length} calculations for current period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollCalculations
                    .filter(p => p.status === 'draft' || p.status === 'pending_approval')
                    .map((calculation) => {
                      const employee = employees.find(e => e.id === calculation.employee_id);
                      const totalHours = calculation.regular_hours + calculation.overtime_hours + 
                                       calculation.double_time_hours + calculation.holiday_hours +
                                       calculation.vacation_hours + calculation.sick_hours;
                      
                      return (
                        <TableRow key={calculation.id}>
                          <TableCell>
                            <div className="font-medium">
                              {employee?.first_name} {employee?.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {employee?.employee_id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(calculation.pay_period_start).toLocaleDateString()} - 
                              {new Date(calculation.pay_period_end).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {totalHours.toFixed(2)}h
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {calculation.overtime_hours > 0 && `${calculation.overtime_hours}h OT`}
                            </div>
                          </TableCell>
                          <TableCell>${calculation.gross_pay.toFixed(2)}</TableCell>
                          <TableCell>${calculation.net_pay.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(calculation.status)} text-white`}>
                              {calculation.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {calculation.status === 'draft' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => approvePayroll(calculation.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                All approved and paid payroll calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollCalculations
                    .filter(p => p.status === 'approved' || p.status === 'paid')
                    .map((calculation) => {
                      const employee = employees.find(e => e.id === calculation.employee_id);
                      const totalDeductions = calculation.federal_tax + calculation.state_tax + 
                                            calculation.social_security + calculation.medicare + 
                                            calculation.other_deductions;
                      
                      return (
                        <TableRow key={calculation.id}>
                          <TableCell>
                            <div className="font-medium">
                              {employee?.first_name} {employee?.last_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(calculation.pay_period_start).toLocaleDateString()} - 
                            {new Date(calculation.pay_period_end).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${calculation.gross_pay.toFixed(2)}</TableCell>
                          <TableCell>${totalDeductions.toFixed(2)}</TableCell>
                          <TableCell>${calculation.net_pay.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(calculation.status)} text-white`}>
                              {calculation.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {calculation.approved_at ? 
                              new Date(calculation.approved_at).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Reports</CardTitle>
                <CardDescription>
                  Generate and download payroll reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Pay Stub Reports</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Generate individual pay stubs for employees
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Generate Pay Stubs
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-5 w-5" />
                      <span className="font-medium">Tax Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Summary of tax withholdings and deductions
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Tax Report
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="font-medium">Payroll Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Overall payroll costs and breakdown
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Summary
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">Monthly Report</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive monthly payroll analysis
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}