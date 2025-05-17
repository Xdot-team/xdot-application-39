
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMockProjects } from "@/data/mockProjects";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";
import { Project, ProjectStatus } from "@/types/projects";

interface ProjectListProps {
  status: ProjectStatus;
}

export const ProjectList = ({ status }: ProjectListProps) => {
  const projects = generateMockProjects().filter(project => project.status === status);
  
  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No {status} projects found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusColors = {
    active: "bg-green-500/10 hover:bg-green-500/15 border-green-500/20",
    completed: "bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20",
    upcoming: "bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20",
  };

  const percentComplete = Math.round((project.completedTasks / project.totalTasks) * 100);
  
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className={`cursor-pointer transition-all ${statusColors[project.status]}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <StatusBadge status={project.status} />
          </div>
          <CardDescription className="line-clamp-1">
            {project.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Project ID</p>
              <p className="font-medium">{project.projectId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Contract Value</p>
              <p className="font-medium">{formatCurrency(project.contractValue)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2 mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{percentComplete}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-construction-primary rounded-full" 
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const statusConfig = {
    active: {
      label: 'Active',
      variant: 'success' as const
    },
    completed: {
      label: 'Completed',
      variant: 'default' as const
    },
    upcoming: {
      label: 'Upcoming',
      variant: 'warning' as const
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>{config.label}</Badge>
  );
};
