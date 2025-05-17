
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart2, 
  Users, 
  Truck, 
  HardHat, 
  Calendar, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

// Mock dashboard data
const projectStats = {
  active: 8,
  completed: 23,
  upcoming: 5,
  delayed: 2,
  employeesOnSite: 32,
};

const equipmentStats = {
  total: 48,
  inUse: 29,
  maintenance: 5,
  available: 14,
};

const safetyStats = {
  daysWithoutIncident: 124,
  safetyCompliance: 97,
  openHazards: 3,
  recentInspections: 8,
};

const recentProjects = [
  {
    id: 'p1',
    name: 'I-85 Expansion Phase 2',
    progress: 75,
    status: 'On Track',
    dueDate: '2024-08-15',
  },
  {
    id: 'p2',
    name: 'SR-400 Bridge Maintenance',
    progress: 90,
    status: 'On Track',
    dueDate: '2024-06-30',
  },
  {
    id: 'p3',
    name: 'County Road 23 Resurfacing',
    progress: 45,
    status: 'Delayed',
    dueDate: '2024-07-20',
  },
  {
    id: 'p4',
    name: 'Downtown Sidewalk Renovation',
    progress: 60,
    status: 'On Track',
    dueDate: '2024-09-05',
  },
];

const upcomingTasks = [
  {
    id: 't1',
    title: 'Weekly Safety Meeting',
    date: '2024-05-20',
    type: 'meeting',
    priority: 'high',
  },
  {
    id: 't2',
    title: 'Equipment Inspection - Excavators',
    date: '2024-05-21',
    type: 'inspection',
    priority: 'medium',
  },
  {
    id: 't3',
    title: 'Submit I-85 Progress Report',
    date: '2024-05-22',
    type: 'report',
    priority: 'high',
  },
  {
    id: 't4',
    title: 'Concrete Delivery - SR-400 Site',
    date: '2024-05-23',
    type: 'delivery',
    priority: 'high',
  },
];

export default function Dashboard() {
  const { authState } = useAuth();
  const userRole = authState.user?.role;

  useEffect(() => {
    // Demo notification
    const timer = setTimeout(() => {
      toast.info('New inspection report available', {
        description: 'SR-400 Bridge site inspection report has been uploaded.',
        action: {
          label: 'View',
          onClick: () => console.log('Viewing report'),
        },
      });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Different stat cards based on user role
  const getStatCards = () => {
    switch (userRole) {
      case 'accountant':
        return (
          <>
            {/* Financial stats would go here */}
            <StatCard 
              title="Invoices" 
              value="14" 
              description="Open invoices" 
              icon={FileText} 
              trend="up" 
              trendValue="3"
            />
            <StatCard 
              title="Budget" 
              value="92%" 
              description="Projects within budget" 
              icon={BarChart2} 
              trend="up" 
              trendValue="2%"
            />
            <StatCard 
              title="Payments" 
              value="$437K" 
              description="Pending payments" 
              icon={FileText} 
              trend="up" 
              trendValue="$45K"
            />
          </>
        );
      case 'hr':
        return (
          <>
            <StatCard 
              title="Employees" 
              value={projectStats.employeesOnSite.toString()} 
              description="On site today" 
              icon={Users} 
              trend="up" 
              trendValue="5"
            />
            <StatCard 
              title="Safety" 
              value={safetyStats.daysWithoutIncident.toString()} 
              description="Days without incident" 
              icon={HardHat} 
              trend="up" 
              trendValue="12"
            />
            <StatCard 
              title="Certifications" 
              value="8" 
              description="Expiring soon" 
              icon={FileText} 
              trend="down" 
              trendValue="2"
            />
          </>
        );
      case 'field_worker':
        return (
          <>
            <StatCard 
              title="Tasks" 
              value="6" 
              description="Assigned today" 
              icon={CheckCircle2} 
              trend="up" 
              trendValue="2"
            />
            <StatCard 
              title="Equipment" 
              value={`${equipmentStats.maintenance}`} 
              description="Need maintenance" 
              icon={Truck} 
              trend="down" 
              trendValue="1"
            />
            <StatCard 
              title="Safety" 
              value={safetyStats.openHazards.toString()} 
              description="Open hazards" 
              icon={AlertTriangle} 
              trend="down" 
              trendValue="2"
            />
          </>
        );
      default: // admin and project_manager
        return (
          <>
            <StatCard 
              title="Projects" 
              value={projectStats.active.toString()} 
              description="Active projects" 
              icon={FileText} 
              trend="up" 
              trendValue="2"
            />
            <StatCard 
              title="Employees" 
              value={projectStats.employeesOnSite.toString()} 
              description="On site today" 
              icon={Users} 
              trend="up" 
              trendValue="5"
            />
            <StatCard 
              title="Equipment" 
              value={`${equipmentStats.inUse}/${equipmentStats.total}`} 
              description="In use / Total" 
              icon={Truck} 
              trend="up" 
              trendValue="3"
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground italic">"Construct for Centuries"</p>
        </div>
        {userRole === 'field_worker' && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="mr-1 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
            Offline Mode Available
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {getStatCards()}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects">
        <TabsList className="mb-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {recentProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Monthly Safety Review</p>
                      <p className="text-sm text-muted-foreground">Generated on May 10, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Equipment Status Report</p>
                      <p className="text-sm text-muted-foreground">Generated on May 12, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Project Progress Summary</p>
                      <p className="text-sm text-muted-foreground">Generated on May 15, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
}

function StatCard({ title, value, description, icon: Icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold">{value}</h3>
              <p className={`ml-2 text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    progress: number;
    status: string;
    dueDate: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  // Format due date
  const formattedDate = new Date(project.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'On Track' ? 'bg-green-100 text-green-800' : 
            project.status === 'Delayed' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {project.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Due {formattedDate}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    date: string;
    type: string;
    priority: string;
  };
}

function TaskItem({ task }: TaskItemProps) {
  // Format task date
  const formattedDate = new Date(task.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex items-center">
        {/* Task type icon */}
        <div className={`p-2 rounded-full mr-3 ${
          task.type === 'meeting' ? 'bg-blue-100' : 
          task.type === 'inspection' ? 'bg-purple-100' : 
          task.type === 'report' ? 'bg-green-100' : 
          'bg-orange-100'
        }`}>
          {task.type === 'meeting' && <Users className="h-4 w-4 text-blue-600" />}
          {task.type === 'inspection' && <HardHat className="h-4 w-4 text-purple-600" />}
          {task.type === 'report' && <FileText className="h-4 w-4 text-green-600" />}
          {task.type === 'delivery' && <Truck className="h-4 w-4 text-orange-600" />}
        </div>
        
        <div>
          <p className="font-medium">{task.title}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      {/* Priority badge */}
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        task.priority === 'high' ? 'bg-red-100 text-red-800' : 
        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
        'bg-green-100 text-green-800'
      }`}>
        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </div>
    </div>
  );
}
