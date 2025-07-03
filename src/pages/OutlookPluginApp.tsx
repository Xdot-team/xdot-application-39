import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  FolderOpen, 
  Bell, 
  Mail, 
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  DollarSign,
  Hammer,
  MessageSquare,
  Plus,
  ExternalLink,
  Settings,
  RefreshCw
} from 'lucide-react';

interface OutlookPluginAppProps {
  isOutlookContext?: boolean;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
}

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  projectId: string;
  projectName: string;
  dueDate: string;
  isRead: boolean;
}

interface ScheduleEventData {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  event_type: string;
  location?: string;
}

export default function OutlookPluginApp({ isOutlookContext = false }: OutlookPluginAppProps) {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Initialize Office.js if in Outlook context
  useEffect(() => {
    if (isOutlookContext && typeof Office !== 'undefined') {
      Office.onReady((info) => {
        if (info.host === Office.HostType.Outlook) {
          console.log('Outlook plugin initialized');
          setIsAuthenticated(true);
          loadInitialData();
        }
      });
    } else {
      // Mock data for preview
      setIsAuthenticated(true);
      loadMockData();
    }
  }, [isOutlookContext]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProjects(),
        loadNotifications(),
        loadScheduleEvents()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setProjects([
      { id: '1', name: 'I-85 North Resurfacing', status: 'active', progress: 65 },
      { id: '2', name: 'Highway 400 Bridge Repair', status: 'active', progress: 40 },
      { id: '3', name: 'Peachtree Street Extension', status: 'upcoming', progress: 10 }
    ]);

    setNotifications([
      {
        id: 'n1',
        title: 'RFI Response Required',
        message: 'RFI #45 needs your response regarding asphalt specifications',
        type: 'rfi',
        priority: 'high',
        projectId: '1',
        projectName: 'I-85 North Resurfacing',
        dueDate: '2025-07-05',
        isRead: false
      },
      {
        id: 'n2',
        title: 'Change Order Approval',
        message: 'Change Order #8 requires approval for additional structural support',
        type: 'change_order',
        priority: 'high',
        projectId: '2',
        projectName: 'Highway 400 Bridge Repair',
        dueDate: '2025-07-04',
        isRead: false
      }
    ]);

    setScheduleEvents([
      {
        id: 'e1',
        title: 'Project Kickoff Meeting',
        start_date: '2025-07-04T09:00:00',
        end_date: '2025-07-04T11:00:00',
        event_type: 'meeting',
        location: 'Conference Room A'
      },
      {
        id: 'e2',
        title: 'Site Inspection',
        start_date: '2025-07-05T14:00:00',
        end_date: '2025-07-05T16:00:00',
        event_type: 'inspection',
        location: 'I-85 Site'
      }
    ]);
  };

  const loadProjects = async () => {
    // Call the Outlook plugin API
    const response = await callPluginAPI('getProjects');
    setProjects((response as any).projects || []);
  };

  const loadNotifications = async () => {
    const response = await callPluginAPI('getNotifications');
    setNotifications((response as any).notifications || []);
  };

  const loadScheduleEvents = async () => {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await callPluginAPI('getScheduleEvents', { startDate, endDate });
    setScheduleEvents((response as any).events || []);
  };

  const callPluginAPI = async (action: string, data?: any): Promise<any> => {
    // In a real implementation, this would call the Supabase edge function
    // For now, return mock data
    console.log(`API call: ${action}`, data);
    return {};
  };

  const openInApp = (path: string) => {
    if (isOutlookContext) {
      // Open in new window/tab
      window.open(`${window.location.origin}${path}`, '_blank');
    } else {
      // Navigate within the app
      window.location.href = path;
    }
  };

  const createQuickAction = async (type: string, projectId: string) => {
    try {
      let response;
      switch (type) {
        case 'rfi':
          response = await callPluginAPI('createRFI', {
            project_id: projectId,
            title: 'Quick RFI from Outlook',
            description: 'Created from Outlook plugin',
            status: 'pending'
          });
          break;
        case 'submittal':
          response = await callPluginAPI('createSubmittal', {
            project_id: projectId,
            title: 'Quick Submittal from Outlook',
            description: 'Created from Outlook plugin',
            status: 'pending'
          });
          break;
        case 'change_order':
          response = await callPluginAPI('createChangeOrder', {
            project_id: projectId,
            title: 'Quick Change Order from Outlook',
            description: 'Created from Outlook plugin',
            amount: 0,
            status: 'pending'
          });
          break;
      }

      toast({
        title: "Success",
        description: `${type.toUpperCase()} created successfully`,
      });

      // Refresh notifications
      loadNotifications();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create ${type}`,
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'upcoming': return 'outline';
      default: return 'default';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">xDOTContractor</h2>
              <p className="text-sm text-muted-foreground">
                Please authenticate to access your construction projects
              </p>
            </div>
            <Button className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Hammer className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">xDOTContractor</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => loadInitialData()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, documents, or contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 mx-4 mt-4">
            <TabsTrigger value="projects" className="text-xs">
              <FolderOpen className="w-4 h-4 mr-1" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">
              <Bell className="w-4 h-4 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">
              <Calendar className="w-4 h-4 mr-1" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">
              <FileText className="w-4 h-4 mr-1" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              Team
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="projects" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  {projects.map((project) => (
                    <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm">{project.name}</h3>
                          <Badge variant={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{project.progress}% Complete</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openInApp(`/projects/${project.id}`)}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => createQuickAction('rfi', project.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              RFI
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => createQuickAction('submittal', project.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Submittal
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => createQuickAction('change_order', project.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              CO
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notifications" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={`cursor-pointer transition-all ${!notification.isRead ? 'border-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {notification.type === 'rfi' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                            {notification.type === 'change_order' && <DollarSign className="w-4 h-4 text-green-500" />}
                            {notification.type === 'safety' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            <h3 className="font-medium text-sm">{notification.title}</h3>
                          </div>
                          <Badge variant={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{notification.projectName}</span>
                          <span className="text-muted-foreground">Due: {new Date(notification.dueDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="schedule" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  {scheduleEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm">{event.title}</h3>
                          <Badge variant="outline">{event.event_type}</Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(event.start_date).toLocaleDateString()}</span>
                            <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-2">
                              <span>📍</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="documents" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Document access coming soon
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="contacts" className="h-full m-0">
              <ScrollArea className="h-full p-4">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Team directory coming soon
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}