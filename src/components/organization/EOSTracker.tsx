
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ChevronRight, Clock, Edit, UserRound } from 'lucide-react';
import { getOrganizationData, getStatusColor } from '@/data/mockOrganizationData';

export function EOSTracker() {
  const { eosGoals } = getOrganizationData();
  
  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      revenue: "bg-blue-100 text-blue-800",
      profit: "bg-green-100 text-green-800",
      projects: "bg-purple-100 text-purple-800",
      expansion: "bg-yellow-100 text-yellow-800",
      safety: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  
  const getMilestoneProgress = (goal: typeof eosGoals[0]) => {
    const completed = goal.milestones.filter(m => m.completed).length;
    const total = goal.milestones.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">EOS Goals Tracker</h2>
          <p className="text-muted-foreground">Strategic organizational goals and progress tracking</p>
        </div>
        
        <Button>
          <Edit className="h-4 w-4 mr-2" /> Edit Goals
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {eosGoals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal.current, goal.target);
          const milestonesPercentage = getMilestoneProgress(goal);
          
          return (
            <Card key={goal.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className={getCategoryBadgeColor(goal.category)}>
                    {goal.category.replace('_', ' ')}
                  </Badge>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-2">{goal.name}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-right text-muted-foreground">
                    {progressPercentage}% complete
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Key Milestones</span>
                    <span>
                      {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length}
                    </span>
                  </div>
                  <Progress value={milestonesPercentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex justify-between items-center py-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={milestone.completed} />
                        <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                          {milestone.name}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="py-3 flex justify-between text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">{goal.owner}</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
