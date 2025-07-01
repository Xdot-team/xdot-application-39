
import { useNavigate } from 'react-router-dom';
import { requireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { useProjects } from '@/hooks/useProjects';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectStatusOverview from '@/components/projects/ProjectStatusOverview';
import ProjectTabsContainer from '@/components/projects/ProjectTabsContainer';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

const Projects = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading, error } = useProjects();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading projects: {error.message}</div>
      </div>
    );
  }
  
  // Cast projects to any to work around type issues
  const projectList = projects as any[];
  
  const activeProjects = projectList.filter((p: any) => p.status === 'active');
  const completedProjects = projectList.filter((p: any) => p.status === 'completed');
  const upcomingProjects = projectList.filter((p: any) => p.status === 'upcoming');
  
  // Use the first project ID as a sample for the ProjectTabsContainer
  const sampleProjectId = activeProjects.length > 0 ? activeProjects[0].id : (projectList.length > 0 ? projectList[0].id : 'sample-project-1');
  
  return (
    <div className="space-y-6">
      <ProjectHeader />

      {/* Project Status Overview */}
      <ProjectStatusOverview 
        activeProjects={activeProjects.length} 
        completedProjects={completedProjects.length} 
      />

      {/* Projects List Tabs */}
      <ProjectsGrid 
        activeProjects={activeProjects}
        completedProjects={completedProjects}
        upcomingProjects={upcomingProjects}
      />
      
      {/* Project Dashboard Section - No heading */}
      {projectList.length > 0 && (
        <div className="mt-6">
          <ProjectTabsContainer projectId={sampleProjectId} />
        </div>
      )}

      {projectList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Create your first project to get started.</p>
        </div>
      )}
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'accountant', 'field_worker'])(Projects);
