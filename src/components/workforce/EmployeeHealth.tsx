
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Search, FileSymlink, CalendarCheck, AlertTriangle } from 'lucide-react';
import { mockHealthRecords, mockEmployees } from '@/data/mockWorkforceData';
import { EmployeeHealth, HealthStatus, HealthRecordType } from '@/types/workforce';
import { useIsMobile } from '@/hooks/use-mobile';

// Health record form schema
const healthRecordSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee is required" }),
  recordType: z.string().min(1, { message: "Record type is required" }),
  healthStatus: z.string().min(1, { message: "Health status is required" }),
  medicalNotes: z.string().min(1, { message: "Medical notes are required" }),
  restrictions: z.string().optional(),
  followUpDate: z.date().optional(),
  confidential: z.boolean().default(true),
});

export const EmployeeHealth = () => {
  const [healthRecords, setHealthRecords] = useState<EmployeeHealth[]>(mockHealthRecords);
  const [activeTab, setActiveTab] = useState("records");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof healthRecordSchema>>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      confidential: true,
    },
  });
  
  // Filter health records based on search and filters
  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.medicalNotes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || record.healthStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get records that need attention (follow-up or pending evaluation)
  const recordsNeedingAttention = healthRecords.filter(record => 
    (record.followUpDate && new Date(record.followUpDate) <= new Date()) || 
    record.healthStatus === 'pending_evaluation'
  );
  
  // Count records by status
  const recordsByStatus = {
    fit: healthRecords.filter(r => r.healthStatus === 'fit_for_duty').length,
    restricted: healthRecords.filter(r => r.healthStatus === 'restricted_duty').length,
    notFit: healthRecords.filter(r => r.healthStatus === 'not_fit_for_duty').length,
    pending: healthRecords.filter(r => r.healthStatus === 'pending_evaluation').length,
  };
  
  const onSubmit = (data: z.infer<typeof healthRecordSchema>) => {
    // Find the employee name based on ID
    const employee = mockEmployees.find(emp => emp.id === data.employeeId);
    
    // Create a new health record
    const newRecord: EmployeeHealth = {
      id: `health-${healthRecords.length + 1}`.padStart(9, '0'),
      employeeId: data.employeeId,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee",
      recordDate: format(new Date(), 'yyyy-MM-dd'),
      recordType: data.recordType as HealthRecordType,
      healthStatus: data.healthStatus as HealthStatus,
      medicalNotes: data.medicalNotes,
      restrictions: data.restrictions,
      followUpDate: data.followUpDate ? format(data.followUpDate, 'yyyy-MM-dd') : undefined,
      recordedBy: "emp-004", // Lisa Washington (HR)
      confidential: data.confidential,
    };
    
    // Add the new record
    setHealthRecords([newRecord, ...healthRecords]);
    
    // Close dialog and show success message
    setIsDialogOpen(false);
    form.reset();
    
    toast.success("Health record added successfully");
  };
  
  // Helper function to get badge color based on health status
  const getStatusBadgeColor = (status: HealthStatus) => {
    switch(status) {
      case 'fit_for_duty': return 'bg-green-500';
      case 'restricted_duty': return 'bg-yellow-500';
      case 'not_fit_for_duty': return 'bg-red-500';
      case 'pending_evaluation': return 'bg-blue-500';
      default: return '';
    }
  };
  
  // Helper function to get formatted status label
  const formatStatus = (status: HealthStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Helper function to get formatted record type label
  const formatRecordType = (type: HealthRecordType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employee Health</h2>
          <p className="text-muted-foreground">
            Securely manage employee health records and wellness programs
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Health Record</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>
                  Create a new employee health record. This information is confidential.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockEmployees.map(employee => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recordType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Record Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select record type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="routine_check">Routine Check</SelectItem>
                            <SelectItem value="injury_assessment">Injury Assessment</SelectItem>
                            <SelectItem value="return_to_work">Return to Work</SelectItem>
                            <SelectItem value="wellness_program">Wellness Program</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="healthStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select health status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fit_for_duty">Fit for Duty</SelectItem>
                            <SelectItem value="restricted_duty">Restricted Duty</SelectItem>
                            <SelectItem value="not_fit_for_duty">Not Fit for Duty</SelectItem>
                            <SelectItem value="pending_evaluation">Pending Evaluation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="medicalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter detailed medical notes" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="restrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restrictions (if any)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any work restrictions" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Follow-up Date (if needed)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confidential"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Confidential Record</FormLabel>
                          <FormDescription>
                            This record will only be visible to authorized HR personnel
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Save Record</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{healthRecords.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              From {new Set(healthRecords.map(r => r.employeeId)).size} employees
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Fit for Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{recordsByStatus.fit}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((recordsByStatus.fit / healthRecords.length) * 100)}% of workforce
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Restricted Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{recordsByStatus.restricted}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {recordsByStatus.restricted} employee{recordsByStatus.restricted !== 1 ? 's' : ''} with restrictions
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{recordsNeedingAttention.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Follow-ups or pending evaluations
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="records" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="records">All Records</TabsTrigger>
          <TabsTrigger value="attention">
            Needs Attention
            {recordsNeedingAttention.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-red-500 text-white">
                {recordsNeedingAttention.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="wellness">Wellness Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle>Employee Health Records</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative max-w-[200px]">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search records..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 max-w-[200px]"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="fit_for_duty">Fit for Duty</SelectItem>
                      <SelectItem value="restricted_duty">Restricted Duty</SelectItem>
                      <SelectItem value="not_fit_for_duty">Not Fit for Duty</SelectItem>
                      <SelectItem value="pending_evaluation">Pending Evaluation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead className="hidden md:table-cell">Record Date</TableHead>
                      <TableHead className="hidden md:table-cell">Record Type</TableHead>
                      <TableHead>Status</TableHead>
                      {!isMobile && <TableHead>Notes</TableHead>}
                      <TableHead className="text-right">Follow-up</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-4 text-muted-foreground">
                          No health records found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map(record => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.employeeName}</TableCell>
                          <TableCell className="hidden md:table-cell">{record.recordDate}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatRecordType(record.recordType)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(record.healthStatus)}>
                              {formatStatus(record.healthStatus)}
                            </Badge>
                          </TableCell>
                          {!isMobile && (
                            <TableCell className="max-w-[200px] truncate">
                              {record.confidential ? (
                                <div className="flex items-center">
                                  <span className="truncate">{record.medicalNotes}</span>
                                  {record.confidential && (
                                    <span className="ml-2 text-muted-foreground text-xs">(Confidential)</span>
                                  )}
                                </div>
                              ) : (
                                record.medicalNotes
                              )}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            {record.followUpDate ? (
                              <div className="flex items-center justify-end gap-1">
                                <CalendarCheck className="h-4 w-4" />
                                <span>{record.followUpDate}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attention">
          <Card>
            <CardHeader>
              <CardTitle>Records Needing Attention</CardTitle>
              <CardDescription>
                Follow-ups required or evaluations pending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead className="hidden md:table-cell">Record Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recordsNeedingAttention.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No records currently need attention
                        </TableCell>
                      </TableRow>
                    ) : (
                      recordsNeedingAttention.map(record => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.employeeName}</TableCell>
                          <TableCell>
                            {record.healthStatus === 'pending_evaluation' ? (
                              <div className="flex items-center text-blue-500 gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Pending Evaluation</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-amber-500 gap-1">
                                <CalendarCheck className="h-4 w-4" />
                                <span>Follow-up Due</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatRecordType(record.recordType)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(record.healthStatus)}>
                              {formatStatus(record.healthStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" className="gap-1">
                              <FileSymlink className="h-4 w-4" />
                              {record.healthStatus === 'pending_evaluation' ? 'Update Status' : 'Record Follow-up'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wellness">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Programs</CardTitle>
              <CardDescription>
                Active employee wellness initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead className="hidden md:table-cell">Start Date</TableHead>
                      <TableHead className="hidden md:table-cell">End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthRecords.filter(r => r.wellnessPrograms && r.wellnessPrograms.length > 0).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No active wellness programs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      healthRecords
                        .filter(r => r.wellnessPrograms && r.wellnessPrograms.length > 0)
                        .flatMap(record => 
                          record.wellnessPrograms!.map(program => (
                            <TableRow key={`${record.id}-${program.programId}`}>
                              <TableCell className="font-medium">{record.employeeName}</TableCell>
                              <TableCell>{program.programName}</TableCell>
                              <TableCell className="hidden md:table-cell">{program.startDate}</TableCell>
                              <TableCell className="hidden md:table-cell">{program.endDate || 'Ongoing'}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    program.status === 'active' ? 'bg-blue-500' : 
                                    program.status === 'completed' ? 'bg-green-500' : 
                                    'bg-yellow-500'
                                  }
                                >
                                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeHealth;
