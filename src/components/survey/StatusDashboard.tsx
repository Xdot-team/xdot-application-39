
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

// Mock data for survey status
const projectSurveyStatus = [
  {
    id: "1",
    projectName: "Highway 101 Bridge",
    surveyType: "Topographic",
    completionPercent: 85,
    status: "in-progress",
    lastUpdated: "2025-05-15",
    surveyor: "Michael Johnson",
    issues: 0,
  },
  {
    id: "2",
    projectName: "Peachtree Street Extension",
    surveyType: "Boundary",
    completionPercent: 100,
    status: "completed",
    lastUpdated: "2025-05-10",
    surveyor: "Sarah Williams",
    issues: 0,
  },
  {
    id: "3",
    projectName: "I-85 North Resurfacing",
    surveyType: "As-built",
    completionPercent: 65,
    status: "in-progress",
    lastUpdated: "2025-05-17",
    surveyor: "David Thompson",
    issues: 2,
  },
  {
    id: "4",
    projectName: "Downtown Metro Station",
    surveyType: "Construction",
    completionPercent: 30,
    status: "issues",
    lastUpdated: "2025-05-16",
    surveyor: "Emily Parker",
    issues: 3,
  },
  {
    id: "5",
    projectName: "Municipal Water Treatment",
    surveyType: "Site",
    completionPercent: 0,
    status: "not-started",
    lastUpdated: "N/A",
    surveyor: "Assigned: Robert Chen",
    issues: 0,
  }
];

export function StatusDashboard() {
  // Calculate summary statistics
  const totalProjects = projectSurveyStatus.length;
  const completedProjects = projectSurveyStatus.filter(p => p.status === "completed").length;
  const inProgressProjects = projectSurveyStatus.filter(p => p.status === "in-progress").length;
  const projectsWithIssues = projectSurveyStatus.filter(p => p.issues > 0).length;

  return (
    <div className="space-y-6">
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
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsWithIssues}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectSurveyStatus.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.projectName}</h3>
                  <Badge 
                    variant={
                      project.status === "completed" ? "outline" :
                      project.status === "in-progress" ? "secondary" :
                      project.status === "issues" ? "destructive" : "default"
                    }
                  >
                    {project.status === "completed" ? "Completed" :
                      project.status === "in-progress" ? "In Progress" :
                      project.status === "issues" ? "Issues Found" : "Not Started"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mb-1 text-sm text-muted-foreground">
                  <span>Survey Type: {project.surveyType}</span>
                  <span>Last Updated: {project.lastUpdated}</span>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{project.surveyor}</span>
                    <span className="text-sm font-medium">{project.completionPercent}%</span>
                  </div>
                  <Progress value={project.completionPercent} className="h-2" />
                </div>
                
                {project.issues > 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-600 mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{project.issues} issues reported</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
