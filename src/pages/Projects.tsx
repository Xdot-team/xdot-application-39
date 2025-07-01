
import { useNavigate } from 'react-router-dom';
import { requireAuth } from '@/contexts/AuthContext';
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
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error loading projects</h2>
          <p className="text-sm">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const upcomingProjects = projects.filter((p) => p.status === 'upcoming');
  
  // Use the first project ID as a sample for the ProjectTabsContainer
  const sampleProjectId = activeProjects.length > 0 ? activeProjects[0].id : (projects.length > 0 ? projects[0].id : 'sample-project-1');
  
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
      {projects.length > 0 && (
        <div className="mt-6">
          <ProjectTabsContainer projectId={sampleProjectId} />
        </div>
      )}

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Create your first project to get started.</p>
        </div>
      )}
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'accountant', 'field_worker'])(Projects);
