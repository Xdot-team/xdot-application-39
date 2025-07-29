import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UtilityConflict, UtilityMeeting } from '@/types/field';
import { Project } from '@/types/projects';
import UtilityConflictsTab from '@/components/utility/UtilityConflictsTab';
import UtilityMeetingsTab from '@/components/utility/UtilityMeetingsTab';
import { AlertTriangle, Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface UtilityProjectDrilldownProps {
  project: Project;
  conflicts: UtilityConflict[];
  meetings: UtilityMeeting[];
}

const UtilityProjectDrilldown = ({ 
  project, 
  conflicts, 
  meetings 
}: UtilityProjectDrilldownProps) => {
  const activeConflicts = conflicts.filter(c => c.status === 'active');
  const resolvedConflicts = conflicts.filter(c => c.status === 'resolved');
  const upcomingMeetings = meetings.filter(m => 
    m.status === 'scheduled' && new Date(m.date) > new Date()
  );
  const completedMeetings = meetings.filter(m => m.status === 'completed');
  
  const totalCostImpact = conflicts.reduce((sum, c) => sum + (c.cost_impact || 0), 0);
  const criticalConflicts = conflicts.filter(c => c.priority === 'critical');

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      on_hold: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
            {getStatusBadge(project.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium">Start Date:</span>
              <p className="text-sm text-muted-foreground">
                {project.startDate ? 
                  new Date(project.startDate).toLocaleDateString() : 
                  'Not set'
                }
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">End Date:</span>
              <p className="text-sm text-muted-foreground">
                {project.endDate ? 
                  new Date(project.endDate).toLocaleDateString() : 
                  'Not set'
                }
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Location:</span>
              <p className="text-sm text-muted-foreground">
                {project.location || 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conflicts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeConflicts.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalConflicts.length}</div>
            <p className="text-xs text-muted-foreground">
              need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetings.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingMeetings.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCostImpact.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              total impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conflicts.length > 0 ? Math.round((resolvedConflicts.length / conflicts.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {resolvedConflicts.length} resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="conflicts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conflicts">
            Utility Conflicts ({conflicts.length})
          </TabsTrigger>
          <TabsTrigger value="meetings">
            Utility Meetings ({meetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conflicts">
          <UtilityConflictsTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <UtilityMeetingsTab projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityProjectDrilldown;