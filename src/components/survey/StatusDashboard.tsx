import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, CheckCircle2, AlertTriangle, XCircle, Plus } from "lucide-react";
import { useSurveyProjects } from "@/hooks/useSurveyData";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function StatusDashboard() {
  const { projects, loading, error, createProject } = useSurveyProjects();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    project_id: '',
    survey_type: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    assigned_surveyor: '',
    start_date: '',
    end_date: '',
    progress_percentage: 0,
    equipment_required: [] as string[],
    notes: ''
  });

  const handleCreateProject = async () => {
    try {
      await createProject(newProject);
      setIsCreateDialogOpen(false);
      setNewProject({
        project_id: '',
        survey_type: '',
        status: 'planning',
        priority: 'medium',
        assigned_surveyor: '',
        start_date: '',
        end_date: '',
        progress_percentage: 0,
        equipment_required: [],
        notes: ''
      });
      toast({
        title: "Survey Project Created",
        description: "New survey project has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create survey project",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="text-center py-8">Loading survey projects...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  // Calculate summary statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const inProgressProjects = projects.filter(p => p.status === "in_progress").length;
  const planningProjects = projects.filter(p => p.status === "planning").length;

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Survey Status Dashboard</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Survey Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Survey Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="survey_type">Survey Type</Label>
                <Select onValueChange={(value) => setNewProject({ ...newProject, survey_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select survey type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="topographic">Topographic</SelectItem>
                    <SelectItem value="boundary">Boundary</SelectItem>
                    <SelectItem value="as_built">As-Built</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="site">Site Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assigned_surveyor">Assigned Surveyor</Label>
                <Input
                  id="assigned_surveyor"
                  value={newProject.assigned_surveyor}
                  onChange={(e) => setNewProject({ ...newProject, assigned_surveyor: e.target.value })}
                  placeholder="Surveyor name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => setNewProject({ ...newProject, priority: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newProject.notes}
                  onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>
              <Button onClick={handleCreateProject} className="w-full">
                Create Survey Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planningProjects}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No survey projects found. Create your first project to get started.
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.survey_type} Survey</h3>
                    <Badge 
                      variant={
                        project.status === "completed" ? "outline" :
                        project.status === "in_progress" ? "secondary" :
                        project.status === "on_hold" ? "destructive" : "default"
                      }
                    >
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-1 text-sm text-muted-foreground">
                    <span>Priority: {project.priority}</span>
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{project.assigned_surveyor || 'Unassigned'}</span>
                      <span className="text-sm font-medium">{project.progress_percentage}%</span>
                    </div>
                    <Progress value={project.progress_percentage} className="h-2" />
                  </div>
                  
                  {project.notes && (
                    <div className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium">Notes:</span> {project.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}