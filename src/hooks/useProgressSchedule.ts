
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProgressData {
  date: string;
  plannedProgress: number;
  actualProgress: number;
  milestones: {
    id: string;
    title: string;
    due_date: string;
    completed: boolean;
  }[];
}

export function useProgressScheduleData(projectId: string) {
  const [data, setData] = useState<ProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Fetch schedule events for the project
        const { data: events, error: eventsError } = await supabase
          .from('schedule_events')
          .select('*')
          .eq('project_id', projectId)
          .order('start_date');

        if (eventsError) throw eventsError;

        // Transform events into progress data
        const progressData: ProgressData[] = [];
        const today = new Date();
        
        // Generate data for the last 30 days and next 30 days
        for (let i = -30; i <= 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];

          // Calculate planned progress (linear progression)
          const plannedProgress = Math.min(100, Math.max(0, ((i + 30) / 60) * 100));
          
          // Calculate actual progress based on completed events
          const completedEvents = events?.filter(event => 
            event.status === 'completed' && 
            new Date(event.end_date) <= date
          ).length || 0;
          
          const totalEvents = events?.length || 1;
          const actualProgress = (completedEvents / totalEvents) * 100;

          // Find milestones for this date
          const milestones = events?.filter(event => 
            event.event_type === 'milestone' &&
            new Date(event.start_date).toDateString() === date.toDateString()
          ).map(event => ({
            id: event.id,
            title: event.title,
            due_date: event.start_date,
            completed: event.status === 'completed'
          })) || [];

          progressData.push({
            date: dateStr,
            plannedProgress: Math.round(plannedProgress),
            actualProgress: Math.round(actualProgress),
            milestones
          });
        }

        setData(progressData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch progress data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProgressData();
    }
  }, [projectId, toast]);

  return { data, isLoading };
}
