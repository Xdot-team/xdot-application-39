import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UtilityConflict, UtilityMeeting } from '@/types/field';
import { Project } from '@/types/projects';
import { Calendar, AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';

interface UtilityOverviewProps {
  projects: Project[];
  conflicts: UtilityConflict[];
  meetings: UtilityMeeting[];
  selectedProjectId: string | null;
}

const UtilityOverview = ({ projects, conflicts, meetings, selectedProjectId }: UtilityOverviewProps) => {
  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown Project';
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'destructive',
      pending: 'secondary',
      resolved: 'success',
      scheduled: 'default',
      completed: 'success',
      cancelled: 'secondary'
    };
    
    return (
      <Badge variant={(statusColors[status as keyof typeof statusColors] as any) || 'default'}>
        {status}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600', 
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getUtilityTypeColor = (utilityType: string) => {
    const colors = {
      water: 'text-blue-600',
      electric: 'text-amber-600',
      gas: 'text-red-600',
      telecom: 'text-purple-600',
      sewer: 'text-brown-600'
    };
    return colors[utilityType as keyof typeof colors] || 'text-gray-600';
  };

  // Calculate statistics
  const activeConflicts = conflicts.filter(c => c.status === 'active');
  const upcomingMeetings = meetings.filter(m => 
    m.status === 'scheduled' && new Date(m.date) > new Date()
  );
  const totalCostImpact = conflicts.reduce((sum, c) => sum + (c.cost_impact || 0), 0);
  
  // Group conflicts by project
  const conflictsByProject = conflicts.reduce((acc, conflict) => {
    const projectName = getProjectName(conflict.project_id);
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(conflict);
    return acc;
  }, {} as Record<string, UtilityConflict[]>);

  // Group meetings by project
  const meetingsByProject = meetings.reduce((acc, meeting) => {
    const projectName = getProjectName(meeting.project_id);
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(meeting);
    return acc;
  }, {} as Record<string, UtilityMeeting[]>);

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['critical', 'high', 'medium', 'low'].map(priority => {
              const count = conflicts.filter(c => c.priority === priority).length;
              const percentage = conflicts.length > 0 ? (count / conflicts.length) * 100 : 0;
              
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={`capitalize ${getPriorityColor(priority)}`}>
                      {priority}
                    </span>
                    <span>{count}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Utility Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Utility Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['water', 'electric', 'gas', 'telecom', 'sewer'].map(type => {
              const count = conflicts.filter(c => c.utility_type === type).length;
              
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className={`capitalize ${getUtilityTypeColor(type)}`}>
                    {type}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Timeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Conflicts</span>
              <Badge variant="destructive">{activeConflicts.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Upcoming Meetings</span>
              <Badge variant="default">{upcomingMeetings.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Cost Impact</span>
              <Badge variant="outline">${totalCostImpact.toLocaleString()}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conflicts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.slice(0, 5).map(conflict => (
                <div key={conflict.id} className="flex items-center justify-between border-l-4 border-l-orange-500 pl-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{conflict.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {getProjectName(conflict.project_id)} • {conflict.utility_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(conflict.status)}
                    <Badge variant="outline" className={getPriorityColor(conflict.priority)}>
                      {conflict.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMeetings.slice(0, 5).map(meeting => (
                <div key={meeting.id} className="flex items-center justify-between border-l-4 border-l-blue-500 pl-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {getProjectName(meeting.project_id)} • {new Date(meeting.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(meeting.status)}
                    <Badge variant="outline" className={getUtilityTypeColor(meeting.utility_type)}>
                      {meeting.utility_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Breakdown */}
      {!selectedProjectId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(conflictsByProject).map(([projectName, projectConflicts]) => {
                const projectMeetings = meetingsByProject[projectName] || [];
                const activeProjectConflicts = projectConflicts.filter(c => c.status === 'active');
                
                return (
                  <div key={projectName} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">{projectName}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Conflicts:</span>
                        <Badge variant="outline">{projectConflicts.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Active:</span>
                        <Badge variant="destructive">{activeProjectConflicts.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Meetings:</span>
                        <Badge variant="outline">{projectMeetings.length}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UtilityOverview;