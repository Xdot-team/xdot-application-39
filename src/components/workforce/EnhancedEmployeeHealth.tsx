import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { 
  Heart, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Stethoscope,
  Syringe,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';

interface HealthRecord {
  id: string;
  employee_id: string;
  record_type: string;
  record_date: string;
  provider_name?: string;
  provider_contact?: string;
  test_results?: any;
  status: string;
  expiry_date?: string;
  certification_number?: string;
  restrictions?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  confidential_notes?: string;
  attachments?: string[];
  compliance_status: string;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  job_title: string;
}

export function EnhancedEmployeeHealth() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newRecord, setNewRecord] = useState({
    employee_id: '',
    record_type: 'physical',
    record_date: '',
    provider_name: '',
    provider_contact: '',
    expiry_date: '',
    certification_number: '',
    restrictions: '',
    follow_up_required: false,
    follow_up_date: '',
    confidential_notes: '',
    compliance_status: 'compliant'
  });

  useEffect(() => {
    fetchEmployees();
    fetchHealthRecords();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('id, first_name, last_name, employee_id, department, job_title')
        .eq('status', 'active')
        .order('last_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      });
    }
  };

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_health_records')
        .select('*')
        .order('record_date', { ascending: false });

      if (error) throw error;
      setHealthRecords(data || []);
    } catch (error) {
      console.error('Error fetching health records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch health records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHealthRecord = async () => {
    try {
      const { error } = await supabase
        .from('employee_health_records')
        .insert([{
          ...newRecord,
          status: newRecord.expiry_date && new Date(newRecord.expiry_date) > new Date() 
            ? 'current' : 'expired'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Health record added successfully",
      });

      setNewRecord({
        employee_id: '',
        record_type: 'physical',
        record_date: '',
        provider_name: '',
        provider_contact: '',
        expiry_date: '',
        certification_number: '',
        restrictions: '',
        follow_up_required: false,
        follow_up_date: '',
        confidential_notes: '',
        compliance_status: 'compliant'
      });
      setIsAddDialogOpen(false);
      fetchHealthRecords();
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: "Error",
        description: "Failed to add health record",
        variant: "destructive",
      });
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'physical': return <Stethoscope className="h-4 w-4" />;
      case 'drug_test': return <Syringe className="h-4 w-4" />;
      case 'vaccination': return <Shield className="h-4 w-4" />;
      case 'injury': return <Heart className="h-4 w-4" />;
      case 'certification': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      case 'pending_renewal': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'non_compliant': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filterRecordsByEmployee = (employeeId: string) => {
    return healthRecords.filter(record => record.employee_id === employeeId);
  };

  const getExpiringRecords = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return healthRecords.filter(record => 
      record.expiry_date && 
      new Date(record.expiry_date) <= thirtyDaysFromNow &&
      new Date(record.expiry_date) >= new Date()
    );
  };

  const recordTypes = [
    { value: 'physical', label: 'Physical Exam' },
    { value: 'drug_test', label: 'Drug Test' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'injury', label: 'Injury Report' },
    { value: 'certification', label: 'Safety Certification' }
  ];

  const expiringRecords = getExpiringRecords();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Health Management</h1>
          <p className="text-muted-foreground">
            Comprehensive health records and compliance tracking
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Health Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Health Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee *</Label>
                  <Select
                    value={newRecord.employee_id}
                    onValueChange={(value) => setNewRecord(prev => ({ ...prev, employee_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - {employee.employee_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="record_type">Record Type *</Label>
                  <Select
                    value={newRecord.record_type}
                    onValueChange={(value) => setNewRecord(prev => ({ ...prev, record_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {recordTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="record_date">Record Date *</Label>
                  <Input
                    id="record_date"
                    type="date"
                    value={newRecord.record_date}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, record_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={newRecord.expiry_date}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, expiry_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider_name">Provider Name</Label>
                  <Input
                    id="provider_name"
                    value={newRecord.provider_name}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, provider_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certification_number">Certification Number</Label>
                  <Input
                    id="certification_number"
                    value={newRecord.certification_number}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, certification_number: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restrictions">Restrictions/Limitations</Label>
                <Textarea
                  id="restrictions"
                  value={newRecord.restrictions}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, restrictions: e.target.value }))}
                  placeholder="Any work restrictions or limitations..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="follow_up_required"
                  checked={newRecord.follow_up_required}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, follow_up_required: e.target.checked }))}
                />
                <Label htmlFor="follow_up_required">Follow-up required</Label>
              </div>

              {newRecord.follow_up_required && (
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Follow-up Date</Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={newRecord.follow_up_date}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, follow_up_date: e.target.value }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confidential_notes">Confidential Notes</Label>
                <Textarea
                  id="confidential_notes"
                  value={newRecord.confidential_notes}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, confidential_notes: e.target.value }))}
                  placeholder="Confidential medical information..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addHealthRecord}>
                  Add Record
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Cards */}
      {expiringRecords.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Expiring Health Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringRecords.slice(0, 3).map((record) => {
                const employee = employees.find(e => e.id === record.employee_id);
                return (
                  <div key={record.id} className="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                      <span className="font-medium">
                        {employee?.first_name} {employee?.last_name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {recordTypes.find(t => t.value === record.record_type)?.label}
                      </span>
                    </div>
                    <div className="text-sm text-yellow-600">
                      Expires: {record.expiry_date ? new Date(record.expiry_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                );
              })}
              {expiringRecords.length > 3 && (
                <p className="text-sm text-yellow-700">
                  ...and {expiringRecords.length - 3} more records expiring soon
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{healthRecords.length}</div>
            <div className="text-xs text-muted-foreground">
              All health records
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current/Valid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {healthRecords.filter(r => r.status === 'current').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Up to date
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {expiringRecords.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Within 30 days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Non-Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {healthRecords.filter(r => r.compliance_status === 'non_compliant').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Need attention
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-records">All Records</TabsTrigger>
          <TabsTrigger value="by-employee">By Employee</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="all-records">
          <Card>
            <CardHeader>
              <CardTitle>All Health Records</CardTitle>
              <CardDescription>
                {healthRecords.length} records found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Record Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthRecords.map((record) => {
                    const employee = employees.find(e => e.id === record.employee_id);
                    const recordType = recordTypes.find(t => t.value === record.record_type);
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">
                            {employee?.first_name} {employee?.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {employee?.employee_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRecordTypeIcon(record.record_type)}
                            {recordType?.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(record.record_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.provider_name || '-'}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(record.status)} text-white`}>
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getComplianceColor(record.compliance_status)} text-white`}>
                            {record.compliance_status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.expiry_date ? (
                            <div className={
                              new Date(record.expiry_date) < new Date() ? 'text-red-600 font-medium' :
                              new Date(record.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-yellow-600 font-medium' :
                              ''
                            }>
                              {new Date(record.expiry_date).toLocaleDateString()}
                            </div>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-employee">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Employee</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedEmployee?.id || ''}
                  onValueChange={(value) => {
                    const employee = employees.find(e => e.id === value);
                    setSelectedEmployee(employee || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} - {employee.employee_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedEmployee && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Health Records for {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </CardTitle>
                  <CardDescription>
                    {filterRecordsByEmployee(selectedEmployee.id).length} records found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filterRecordsByEmployee(selectedEmployee.id).map((record) => {
                      const recordType = recordTypes.find(t => t.value === record.record_type);
                      
                      return (
                        <div key={record.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getRecordTypeIcon(record.record_type)}
                              <div>
                                <div className="font-medium">{recordType?.label}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(record.record_date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={`${getStatusColor(record.status)} text-white`}>
                                {record.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={`${getComplianceColor(record.compliance_status)} text-white`}>
                                {record.compliance_status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          
                          {record.provider_name && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Provider:</span> {record.provider_name}
                            </div>
                          )}
                          
                          {record.expiry_date && (
                            <div className="mt-1 text-sm">
                              <span className="font-medium">Expires:</span> {new Date(record.expiry_date).toLocaleDateString()}
                            </div>
                          )}
                          
                          {record.restrictions && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Restrictions:</span> {record.restrictions}
                            </div>
                          )}
                          
                          {record.follow_up_required && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
                              <Clock className="h-4 w-4" />
                              Follow-up required {record.follow_up_date && `by ${new Date(record.follow_up_date).toLocaleDateString()}`}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>
                  Health compliance status across all employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Compliant</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {healthRecords.filter(r => r.compliance_status === 'compliant').length}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {healthRecords.filter(r => r.compliance_status === 'pending').length}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">Non-Compliant</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {healthRecords.filter(r => r.compliance_status === 'non_compliant').length}
                    </div>
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