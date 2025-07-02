import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users, 
  Briefcase,
  GraduationCap,
  Key,
  Package,
  Play,
  Pause
} from 'lucide-react';

interface OnboardingWorkflow {
  id: string;
  employee_id: string;
  workflow_template: string;
  current_step: number;
  total_steps: number;
  status: string;
  started_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  assigned_buddy_id?: string;
  assigned_hr_rep?: string;
  completion_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface OnboardingStep {
  id: string;
  workflow_id: string;
  step_number: number;
  step_title: string;
  step_description?: string;
  step_type: string;
  required_documents?: string[];
  assigned_to?: string;
  due_date?: string;
  completed_date?: string;
  status: string;
  completion_notes?: string;
  attachments?: string[];
  estimated_duration_hours?: number;
  actual_duration_hours?: number;
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
  hire_date: string;
}

export function OnboardingWorkflowManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workflows, setWorkflows] = useState<OnboardingWorkflow[]>([]);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<OnboardingWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newWorkflow, setNewWorkflow] = useState({
    employee_id: '',
    workflow_template: 'new_hire',
    expected_completion_date: '',
    assigned_hr_rep: '',
    notes: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchWorkflows();
    fetchSteps();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('id, first_name, last_name, employee_id, department, job_title, hire_date')
        .eq('status', 'active')
        .order('hire_date', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('onboarding_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSteps = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .order('step_number');

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Error fetching steps:', error);
    }
  };

  const createWorkflow = async () => {
    try {
      // Create workflow
      const { data: workflowData, error: workflowError } = await supabase
        .from('onboarding_workflows')
        .insert([{
          ...newWorkflow,
          current_step: 1,
          total_steps: getTemplateSteps(newWorkflow.workflow_template).length,
          status: 'not_started',
          completion_percentage: 0
        }])
        .select()
        .single();

      if (workflowError) throw workflowError;

      // Create steps based on template
      const templateSteps = getTemplateSteps(newWorkflow.workflow_template);
      const stepsToCreate = templateSteps.map((step, index) => ({
        workflow_id: workflowData.id,
        step_number: index + 1,
        step_title: step.title,
        step_description: step.description,
        step_type: step.type,
        required_documents: [],
        assigned_to: step.assigned_to || newWorkflow.assigned_hr_rep,
        status: 'pending',
        estimated_duration_hours: step.estimated_duration_hours || 1
      }));

      const { error: stepsError } = await supabase
        .from('onboarding_steps')
        .insert(stepsToCreate);

      if (stepsError) throw stepsError;

      toast({
        title: "Success",
        description: "Onboarding workflow created successfully",
      });

      setNewWorkflow({
        employee_id: '',
        workflow_template: 'new_hire',
        expected_completion_date: '',
        assigned_hr_rep: '',
        notes: ''
      });
      setIsCreateDialogOpen(false);
      fetchWorkflows();
      fetchSteps();
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive",
      });
    }
  };

  const completeStep = async (stepId: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({
          status: 'completed',
          completed_date: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;

      // Update workflow progress
      const step = steps.find(s => s.id === stepId);
      if (step) {
        const workflowSteps = steps.filter(s => s.workflow_id === step.workflow_id);
        const completedSteps = workflowSteps.filter(s => s.status === 'completed').length + 1;
        const completionPercentage = Math.round((completedSteps / workflowSteps.length) * 100);

        await supabase
          .from('onboarding_workflows')
          .update({
            current_step: step.step_number + 1,
            completion_percentage: completionPercentage,
            status: completionPercentage === 100 ? 'completed' : 'in_progress',
            actual_completion_date: completionPercentage === 100 ? new Date().toISOString() : null
          })
          .eq('id', step.workflow_id);
      }

      toast({
        title: "Success",
        description: "Step completed successfully",
      });

      fetchWorkflows();
      fetchSteps();
    } catch (error) {
      console.error('Error completing step:', error);
      toast({
        title: "Error",
        description: "Failed to complete step",
        variant: "destructive",
      });
    }
  };

  const getTemplateSteps = (template: string) => {
    const templates = {
      new_hire: [
        {
          title: 'Welcome & Paperwork',
          description: 'Complete initial HR paperwork and tax forms',
          type: 'document',
          required_documents: ['I-9 Form', 'W-4 Form', 'Direct Deposit Form'],
          assigned_to: 'HR',
          estimated_duration_hours: 2
        },
        {
          title: 'IT Setup',
          description: 'Setup computer, email, and system access',
          type: 'system_access',
          assigned_to: 'IT',
          estimated_duration_hours: 1
        },
        {
          title: 'Safety Training',
          description: 'Complete mandatory safety training',
          type: 'training',
          assigned_to: 'Safety Coordinator',
          estimated_duration_hours: 4
        },
        {
          title: 'Department Orientation',
          description: 'Meet team and review department procedures',
          type: 'meeting',
          assigned_to: 'Department Manager',
          estimated_duration_hours: 2
        },
        {
          title: 'Equipment Assignment',
          description: 'Receive and setup work equipment',
          type: 'equipment',
          assigned_to: 'Facilities',
          estimated_duration_hours: 1
        }
      ],
      contractor: [
        {
          title: 'Contractor Agreement',
          description: 'Review and sign contractor agreement',
          type: 'document',
          required_documents: ['Contractor Agreement', 'Insurance Certificate'],
          assigned_to: 'HR',
          estimated_duration_hours: 1
        },
        {
          title: 'Site Safety Briefing',
          description: 'Complete site-specific safety briefing',
          type: 'training',
          assigned_to: 'Safety Coordinator',
          estimated_duration_hours: 2
        },
        {
          title: 'Access Badge',
          description: 'Issue temporary access badge',
          type: 'system_access',
          assigned_to: 'Security',
          estimated_duration_hours: 0.5
        }
      ],
      intern: [
        {
          title: 'Program Overview',
          description: 'Introduction to internship program',
          type: 'meeting',
          assigned_to: 'HR',
          estimated_duration_hours: 1
        },
        {
          title: 'Mentor Assignment',
          description: 'Introduce to assigned mentor',
          type: 'meeting',
          assigned_to: 'Department Manager',
          estimated_duration_hours: 0.5
        },
        {
          title: 'Learning Plan',
          description: 'Develop learning objectives and plan',
          type: 'document',
          assigned_to: 'Mentor',
          estimated_duration_hours: 1
        }
      ]
    };

    return templates[template as keyof typeof templates] || templates.new_hire;
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'training': return <GraduationCap className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'system_access': return <Key className="h-4 w-4" />;
      case 'equipment': return <Package className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'not_started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getWorkflowSteps = (workflowId: string) => {
    return steps.filter(step => step.workflow_id === workflowId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Workflow Manager</h1>
          <p className="text-muted-foreground">
            Streamline and track employee onboarding processes
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Onboarding Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee *</Label>
                <Select
                  value={newWorkflow.employee_id}
                  onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, employee_id: value }))}
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
                <Label htmlFor="workflow_template">Workflow Template *</Label>
                <Select
                  value={newWorkflow.workflow_template}
                  onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, workflow_template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_hire">New Hire</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="transfer">Department Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_completion_date">Expected Completion Date</Label>
                <Input
                  id="expected_completion_date"
                  type="date"
                  value={newWorkflow.expected_completion_date}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, expected_completion_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_hr_rep">Assigned HR Representative</Label>
                <Input
                  id="assigned_hr_rep"
                  value={newWorkflow.assigned_hr_rep}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, assigned_hr_rep: e.target.value }))}
                  placeholder="HR representative name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newWorkflow.notes}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createWorkflow}>
                  Create Workflow
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
            <CardTitle className="text-lg">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workflows.length}</div>
            <div className="text-xs text-muted-foreground">
              All onboarding workflows
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {workflows.filter(w => w.status === 'in_progress').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Currently active
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {workflows.filter(w => w.status === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Successfully finished
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workflows.length > 0 ? 
                Math.round(workflows.reduce((sum, w) => sum + w.completion_percentage, 0) / workflows.length) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              Average progress
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="details">Workflow Details</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Onboarding Workflows</CardTitle>
              <CardDescription>
                {workflows.filter(w => w.status !== 'completed').length} active workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.filter(w => w.status !== 'completed').map((workflow) => {
                  const employee = employees.find(e => e.id === workflow.employee_id);
                  const workflowSteps = getWorkflowSteps(workflow.id);
                  
                  return (
                    <div key={workflow.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium">
                            {employee?.first_name} {employee?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.workflow_template.replace('_', ' ').toUpperCase()} • {employee?.department}
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(workflow.status)} text-white`}>
                          {workflow.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{workflow.completion_percentage}%</span>
                        </div>
                        <Progress value={workflow.completion_percentage} className="h-2" />
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Step:</span>
                          <span>{workflow.current_step} of {workflow.total_steps}</span>
                        </div>
                        {workflow.assigned_hr_rep && (
                          <div className="flex justify-between">
                            <span>HR Rep:</span>
                            <span>{workflow.assigned_hr_rep}</span>
                          </div>
                        )}
                        {workflow.expected_completion_date && (
                          <div className="flex justify-between">
                            <span>Due:</span>
                            <span>{new Date(workflow.expected_completion_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => setSelectedWorkflow(workflow)}
                      >
                        View Steps
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Workflows</CardTitle>
              <CardDescription>
                {workflows.filter(w => w.status === 'completed').length} completed workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>HR Rep</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.filter(w => w.status === 'completed').map((workflow) => {
                    const employee = employees.find(e => e.id === workflow.employee_id);
                    const duration = workflow.started_date && workflow.actual_completion_date ?
                      Math.ceil((new Date(workflow.actual_completion_date).getTime() - new Date(workflow.started_date).getTime()) / (1000 * 60 * 60 * 24)) :
                      null;
                    
                    return (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div className="font-medium">
                            {employee?.first_name} {employee?.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {employee?.employee_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          {workflow.workflow_template.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          {workflow.started_date ? 
                            new Date(workflow.started_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {workflow.actual_completion_date ? 
                            new Date(workflow.actual_completion_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {duration ? `${duration} days` : '-'}
                        </TableCell>
                        <TableCell>{workflow.assigned_hr_rep || '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedWorkflow?.id || ''}
                  onValueChange={(value) => {
                    const workflow = workflows.find(w => w.id === value);
                    setSelectedWorkflow(workflow || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workflow to view details" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows.map((workflow) => {
                      const employee = employees.find(e => e.id === workflow.employee_id);
                      return (
                        <SelectItem key={workflow.id} value={workflow.id}>
                          {employee?.first_name} {employee?.last_name} - {workflow.workflow_template}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedWorkflow && (
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Steps</CardTitle>
                  <CardDescription>
                    {getWorkflowSteps(selectedWorkflow.id).length} steps in this workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getWorkflowSteps(selectedWorkflow.id).map((step) => (
                      <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-500 text-white' :
                            step.status === 'in_progress' ? 'bg-blue-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs">{step.step_number}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                {getStepIcon(step.step_type)}
                                <span className="font-medium">{step.step_title}</span>
                              </div>
                              {step.step_description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {step.step_description}
                                </p>
                              )}
                            </div>
                            <Badge className={`${getStatusColor(step.status)} text-white`}>
                              {step.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-2 text-xs mt-2">
                            {step.assigned_to && (
                              <div>
                                <span className="font-medium">Assigned to:</span> {step.assigned_to}
                              </div>
                            )}
                            {step.due_date && (
                              <div>
                                <span className="font-medium">Due:</span> {new Date(step.due_date).toLocaleDateString()}
                              </div>
                            )}
                            {step.completed_date && (
                              <div>
                                <span className="font-medium">Completed:</span> {new Date(step.completed_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {step.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => completeStep(step.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete Step
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}