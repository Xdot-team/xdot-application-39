import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requireAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { useProjects } from '@/hooks/useProjects';
import { useUtilityConflicts } from '@/hooks/useUtilityConflicts';
import { useUtilityMeetings } from '@/hooks/useUtilityMeetings';
import UtilityOverview from '@/components/utility/UtilityOverview';
import UtilityProjectFilter from '@/components/utility/UtilityProjectFilter';
import GlobalUtilityConflicts from '@/components/utility/GlobalUtilityConflicts';
import GlobalUtilityMeetings from '@/components/utility/GlobalUtilityMeetings';
import UtilityProjectDrilldown from '@/components/utility/UtilityProjectDrilldown';
import UtilityConflictsTab from '@/components/utility/UtilityConflictsTab';
import UtilityMeetingsTab from '@/components/utility/UtilityMeetingsTab';
import { Zap, AlertTriangle, Calendar } from 'lucide-react';

const Utility = () => {
  const [searchParams] = useSearchParams();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Check for project parameter in URL
  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam) {
      setSelectedProjectId(projectParam);
      setActiveTab('project-drilldown');
    }
  }, [searchParams]);
  
  const { data: projects = [] } = useProjects();
  const { conflicts: allConflicts, loading: conflictsLoading } = useUtilityConflicts();
  const { meetings: allMeetings, loading: meetingsLoading } = useUtilityMeetings();

  // Filter data based on selected project
  const filteredConflicts = selectedProjectId 
    ? allConflicts.filter(c => c.project_id === selectedProjectId)
    : allConflicts;
  
  const filteredMeetings = selectedProjectId 
    ? allMeetings.filter(m => m.project_id === selectedProjectId)
    : allMeetings;

  const activeConflicts = filteredConflicts.filter(c => c.status === 'active');
  const upcomingMeetings = filteredMeetings.filter(m => 
    m.status === 'scheduled' && new Date(m.date) > new Date()
  );

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Utility Management"
        subheading="Manage utility conflicts and coordination meetings across all projects"
      />

      {/* Project Filter */}
      <UtilityProjectFilter
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredConflicts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeConflicts.length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMeetings.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingMeetings.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredConflicts.filter(c => c.priority === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Impact</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredConflicts.reduce((sum, c) => sum + (c.cost_impact || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              total impact
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conflicts">All Conflicts</TabsTrigger>
            <TabsTrigger value="meetings">All Meetings</TabsTrigger>
            <TabsTrigger value="project-conflicts" disabled={!selectedProjectId}>
              Project Conflicts
            </TabsTrigger>
            <TabsTrigger value="project-meetings" disabled={!selectedProjectId}>
              Project Meetings
            </TabsTrigger>
            <TabsTrigger value="project-drilldown" disabled={!selectedProjectId}>
              Project Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <UtilityOverview 
              projects={projects}
              conflicts={filteredConflicts}
              meetings={filteredMeetings}
              selectedProjectId={selectedProjectId}
            />
          </TabsContent>

          <TabsContent value="conflicts">
            <GlobalUtilityConflicts 
              conflicts={filteredConflicts}
              projects={projects}
              loading={conflictsLoading}
              selectedProjectId={selectedProjectId}
            />
          </TabsContent>

          <TabsContent value="meetings">
            <GlobalUtilityMeetings 
              meetings={filteredMeetings}
              projects={projects}
              loading={meetingsLoading}
              selectedProjectId={selectedProjectId}
            />
          </TabsContent>

          <TabsContent value="project-conflicts">
            {selectedProjectId && (
              <UtilityConflictsTab projectId={selectedProjectId} />
            )}
          </TabsContent>

          <TabsContent value="project-meetings">
            {selectedProjectId && (
              <UtilityMeetingsTab projectId={selectedProjectId} showProjectNavigation={false} />
            )}
          </TabsContent>

          <TabsContent value="project-drilldown">
            {selectedProjectId && selectedProject && (
              <UtilityProjectDrilldown 
                project={selectedProject}
                conflicts={filteredConflicts}
                meetings={filteredMeetings}
              />
            )}
          </TabsContent>
      </Tabs>
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'field_worker'])(Utility);