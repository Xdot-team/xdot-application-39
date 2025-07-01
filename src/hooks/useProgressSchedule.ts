
import { useQuery } from '@tanstack/react-query';
import { useProject } from './useProjects';
import { useProjectMilestones } from './useProjectMilestones';

export interface ProgressScheduleData {
  date: string;
  plannedProgress: number;
  actualProgress: number;
  plannedCost: number;
  actualCost: number;
  milestones: any[];
}

export const useProgressScheduleData = (projectId: string) => {
  const { data: project } = useProject(projectId);
  const { data: milestones = [] } = useProjectMilestones(projectId);
  
  return useQuery({
    queryKey: ['progress-schedule', projectId],
    queryFn: async () => {
      if (!project) return [];
      
      const startDate = project.start_date ? new Date(project.start_date) : new Date();
      const endDate = project.end_date ? new Date(project.end_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const currentDate = new Date();
      
      const totalDuration = endDate.getTime() - startDate.getTime();
      const budget = project.budget_allocated || project.contractValue || 0;
      const currentProgress = project.progress_percentage || 0;
      const budgetSpent = project.budget_spent || 0;
      
      // Generate weekly data points
      const data: ProgressScheduleData[] = [];
      const weeksTotal = Math.ceil(totalDuration / (7 * 24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= weeksTotal; i++) {
        const date = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        const weekProgress = Math.min((i / weeksTotal) * 100, 100);
        
        let actualProgress = 0;
        let actualCost = 0;
        
        if (date <= currentDate) {
          // Calculate actual progress using S-curve
          const timeProgress = Math.min(i / weeksTotal, 1);
          actualProgress = Math.min(
            (3 * Math.pow(timeProgress, 2) - 2 * Math.pow(timeProgress, 3)) * currentProgress,
            currentProgress
          );
          actualCost = (actualProgress / 100) * budget;
          
          // Use actual spent amount for current week
          if (i === Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))) {
            actualCost = budgetSpent;
          }
        }
        
        // Find milestones for this week
        const weekStart = new Date(date);
        const weekEnd = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        const weekMilestones = milestones.filter(milestone => {
          if (!milestone.due_date) return false;
          const milestoneDate = new Date(milestone.due_date);
          return milestoneDate >= weekStart && milestoneDate < weekEnd;
        });
        
        data.push({
          date: date.toISOString().split('T')[0],
          plannedProgress: weekProgress,
          actualProgress: date <= currentDate ? actualProgress : 0,
          plannedCost: (weekProgress / 100) * budget,
          actualCost: date <= currentDate ? actualCost : 0,
          milestones: weekMilestones
        });
      }
      
      return data;
    },
    enabled: !!project,
  });
};
