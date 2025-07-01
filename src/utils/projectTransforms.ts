
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
    clientName: dbProject.client_name || 'TBD',
    projectManager: dbProject.project_manager || 'TBD',
    completedTasks: dbProject.completed_tasks || 0,
    totalTasks: dbProject.total_tasks || 0,
    rfiCount: dbProject.rfi_count || 0,
    delayDays: dbProject.delay_days || 0,
    budgetAllocated: dbProject.budget_allocated,
    budgetSpent: dbProject.budget_spent || 0,
    progressPercentage: dbProject.progress_percentage || 0
  };
};

// Transform Project interface to database format for creation/updates
export const transformProjectToDatabase = (project: any) => {
  return {
    name: project.name,
    project_id: project.project_id,
    description: project.description,
    status: project.status,
    location: project.location,
    contract_value: project.contract_value,
    start_date: project.start_date,
    end_date: project.end_date,
    client_name: project.client_name,
    project_manager: project.project_manager,
    completed_tasks: project.completed_tasks || 0,
    total_tasks: project.total_tasks || 0,
    rfi_count: project.rfi_count || 0,
    delay_days: project.delay_days || 0,
    budget_allocated: project.budget_allocated || project.contract_value,
    budget_spent: project.budget_spent || 0,
    progress_percentage: project.progress_percentage || 0
  };
};
