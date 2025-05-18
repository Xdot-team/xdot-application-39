import { useState } from "react";
import { requireAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BellRing, 
  CalendarDays, 
  CheckCircle, 
  ClipboardCheck, 
  Clock, 
  DollarSign, 
  FileText, 
  HardHat, 
  Package, 
  Settings, 
  TrendingUp, 
  Users,
  FolderOpen,
  BarChart,
  MapPin,
  UserRound,
  Satellite,
  LineChart,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for the dashboard
const projectStats = {
  activeProjects: 7,
  completedProjects: 32,
  upcomingProjects: 4,
  bidProposals: 12,
};

const financialOverview = {
  totalRevenue: "$2.4M",
  pendingInvoices: "$480K",
  projectBudgetUtilization: "78%",
  profitMargin: "24%",
};

const recentProjects = [
  { id: 1, name: "I-85 North Resurfacing", client: "Georgia DOT", status: "In Progress", dueDate: "2023-11-15" },
  { id: 2, name: "Highway 400 Bridge Repair", client: "Atlanta Public Works", status: "Planning", dueDate: "2023-12-10" },
  { id: 3, name: "Peachtree Street Extension", client: "City of Atlanta", status: "Completed", dueDate: "2023-10-05" },
];

const upcomingTasks = [
  { id: 1, title: "Submit I-85 progress report", dueDate: "2023-10-25", priority: "High" },
  { id: 2, title: "Order concrete for Highway 400", dueDate: "2023-10-28", priority: "Medium" },
  { id: 3, title: "Site inspection at Peachtree St", dueDate: "2023-10-30", priority: "Low" },
];

const Dashboard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  // Demo notification trigger
  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  // Module navigation handler
  const handleModuleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground italic"></p>
        </div>
        <Button onClick={triggerNotification}>
          <BellRing className="mr-2" />
          Test Notification
        </Button>
      </div>

      {showNotification && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4 rounded shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <BellRing className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This is a demo notification. In production, notifications would be pushed from the server.
              </p>
            </div>
            <button
              className="ml-auto pl-3"
              onClick={() => setShowNotification(false)}
            >
              <span className="text-blue-500 hover:text-blue-800">&times;</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialOverview.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialOverview.profitMargin}</div>
            <p className="text-xs text-muted-foreground">
              +2% from previous year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Module Navigation</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/projects')}
          >
            <ClipboardCheck className="h-8 w-8 mb-2" />
            Projects
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/documents')}
          >
            <FolderOpen className="h-8 w-8 mb-2" />
            Documents
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/estimating')}
          >
            <BarChart className="h-8 w-8 mb-2" />
            Estimating
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/field')}
          >
            <MapPin className="h-8 w-8 mb-2" />
            Field
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/finance')}
          >
            <DollarSign className="h-8 w-8 mb-2" />
            Finance
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/assets')}
          >
            <Package className="h-8 w-8 mb-2" />
            Assets
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/workforce')}
          >
            <UserRound className="h-8 w-8 mb-2" />
            Workforce
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/safety')}
          >
            <ShieldAlert className="h-8 w-8 mb-2" />
            Safety
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/schedule')}
          >
            <CalendarDays className="h-8 w-8 mb-2" />
            Schedule
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/survey')}
          >
            <Satellite className="h-8 w-8 mb-2" />
            Survey
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/organization')}
          >
            <LineChart className="h-8 w-8 mb-2" />
            Organization
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={() => handleModuleNavigation('/reports')}
          >
            <TrendingUp className="h-8 w-8 mb-2" />
            Reports
          </Button>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Overview of your latest construction projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Project Name</th>
                    <th className="text-left p-3 font-medium">Client</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{project.name}</td>
                      <td className="p-3">{project.client}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            project.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : project.status === "In Progress" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="p-3">{new Date(project.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => handleModuleNavigation('/projects')}>View All Projects</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default requireAuth()(Dashboard);
