
import { Project } from '@/types/projects';

// Transform database project to Project interface
export const transformDatabaseProject = (dbProject: any): Project => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    projectId: dbProject.project_id || dbProject.id,
    description: dbProject.description || '',
    status: dbProject.status,
    location: dbProject.location || '',
    contractValue: dbProject.contract_value || 0,
    startDate: dbProject.start_date || '',
    endDate: dbProject.end_date || '',
    clientName: 'Sample Client', // Default value since not in database
    projectManager: 'Project Manager', // Default value since not in database
    completedTasks: dbProject.completed_tasks || 0,
    totalTasks: dbProject.total_tasks || 0,
    rfiCount: 0, // Default value since not in database
    delayDays: 0 // Default value since not in database
  };
};
