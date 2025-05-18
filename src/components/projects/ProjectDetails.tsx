import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CalendarDays, Users, MapPin, DollarSign, Bell } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import AIABillingTab from './aia-billing/AIABillingTab';
import ChangeOrdersTab from './change-orders/ChangeOrdersTab';
import ProjectNotesTab from './notes/ProjectNotesTab';
import ScopeWipTab from './scope-wip/ScopeWipTab';
import ProgressScheduleTab from './progress-schedule/ProgressScheduleTab';
import CostCompletionTab from './cost-completion/CostCompletionTab';
import UtilityMeetingsTab from './utility-meetings/UtilityMeetingsTab';
import NotificationsTab from './notifications/NotificationsTab';
import { Project } from '@/types/projects';
import { generateMockProjects } from '@/data/mockProjects';
import { formatCurrency } from '@/lib/formatters';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Fetch project details
    if (projectId) {
      const projects = generateMockProjects();
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      }
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button 
          className="mt-4"
          onClick={() => navigate('/projects')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  const notificationCount = 4; // Mock value for unread notification count

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate('/projects')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
              <Badge className={
                project.status === 'active' ? 'bg-green-500' :
                project.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'
              }>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {project.projectId}
            </p>
          </div>
        </div>
        
        {/* Add notification indicator button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="relative"
          onClick={() => setActiveTab('notifications')}
        >
          <Bell className="h-4 w-4 mr-1" /> Notifications
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
      </div>
      
      {/* Project summary card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p className="font-medium">{project.clientName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Contract Value</h3>
              <p className="font-medium">{formatCurrency(project.contractValue)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Project Manager</h3>
              <p className="font-medium">{project.projectManager}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p className="font-medium">{project.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span>{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">RFIs</p>
                <p className="font-medium">{project.rfiCount} open</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs */}
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className={`${isMobile ? 'flex w-full overflow-x-auto' : ''}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="scopeWip">Scope WIP</TabsTrigger>
          <TabsTrigger value="progressSchedule">Progress Schedule</TabsTrigger>
          <TabsTrigger value="costCompletion">Cost to Completion</TabsTrigger>
          <TabsTrigger value="utilityMeetings">Utility Meetings</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {notificationCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="aiaBilling">AIA Billing</TabsTrigger>
          <TabsTrigger value="changeOrders">Change Orders</TabsTrigger>
          <TabsTrigger value="submittals">Submittals</TabsTrigger>
          <TabsTrigger value="rfis">RFIs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Project Description</h3>
                  <p className="text-sm">{project.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Contract Value:</span>
                      <span className="font-medium">{formatCurrency(project.contractValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Change Orders:</span>
                      <span className="font-medium">{formatCurrency(35000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Contract:</span>
                      <span className="font-medium">{formatCurrency(project.contractValue + 35000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Billed to Date:</span>
                      <span className="font-medium">{formatCurrency(project.contractValue * 0.45)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Remaining:</span>
                      <span className="font-medium">{formatCurrency(project.contractValue * 0.55 + 35000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Change Order Submitted</p>
                      <p className="text-xs text-muted-foreground">2 days ago by {project.projectManager}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pay Application #3 Approved</p>
                      <p className="text-xs text-muted-foreground">1 week ago by Sarah Johnson</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">RFI #8 Responded</p>
                      <p className="text-xs text-muted-foreground">1 week ago by Michael Chen</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weekly Progress Meeting</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <ProjectNotesTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="scopeWip">
            <ScopeWipTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="progressSchedule">
            <ProgressScheduleTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="costCompletion">
            <CostCompletionTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="utilityMeetings">
            <UtilityMeetingsTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="aiaBilling">
            <AIABillingTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="changeOrders">
            <ChangeOrdersTab projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="submittals">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium">Submittals Module</h2>
              <p className="text-muted-foreground mt-1">
                View and manage project submittals
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="rfis">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium">RFIs Module</h2>
              <p className="text-muted-foreground mt-1">
                View and manage Request for Information documents
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium">Project Schedule</h2>
              <p className="text-muted-foreground mt-1">
                View and manage the project schedule and timeline
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium">Project Documents</h2>
              <p className="text-muted-foreground mt-1">
                Access and manage all project related documents
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
