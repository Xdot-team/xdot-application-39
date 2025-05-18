
import { useNavigate } from 'react-router-dom';
import { requireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { generateMockProjects } from '@/data/mockProjects';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectStatusOverview from '@/components/projects/ProjectStatusOverview';
import ProjectTabsContainer from '@/components/projects/ProjectTabsContainer';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

const Projects = () => {
  const navigate = useNavigate();
  const projects = generateMockProjects();
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  
  // Use the first project ID as a sample for the ProjectTabsContainer
  const sampleProjectId = activeProjects.length > 0 ? activeProjects[0].id : 'sample-project-1';
  
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
      <div className="mt-6">
        <ProjectTabsContainer projectId={sampleProjectId} />
      </div>
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'accountant', 'field_worker'])(Projects);
