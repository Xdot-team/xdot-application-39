
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockEmployees, mockSubcontractors, mockTimeCards } from '@/data/mockWorkforceData';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EmployeeProfile, TimeCard, Subcontractor } from '@/types/workforce';

// Workforce metrics data generation
const generateWorkforceMetrics = () => {
  const projects = ['Atlanta Highway Expansion', 'Marietta Bridge Repair', 'Decatur Office Complex', 'Downtown Revitalization', 'Suburban Mall Construction'];
  
  return mockEmployees.map(employee => ({
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.role,
    department: employee.department,
    hoursWorked: Math.floor(Math.random() * 40) + 20,
    productivity: (Math.random() * 30 + 70).toFixed(1),
    projectId: `proj-00${Math.floor(Math.random() * 5) + 1}`,
    projectName: projects[Math.floor(Math.random() * projects.length)],
    certificationCount: employee.certifications.length,
    activeTaskCount: Math.floor(Math.random() * 5) + 1,
    availability: Math.random() > 0.2 ? 'available' : 'unavailable',
  }));
};

const workforceMetrics = generateWorkforceMetrics();

// Chart data preparation
const projectHoursData = () => {
  const projects: Record<string, number> = {};
  
  workforceMetrics.forEach(metric => {
    if (projects[metric.projectName]) {
      projects[metric.projectName] += metric.hoursWorked;
    } else {
      projects[metric.projectName] = metric.hoursWorked;
    }
  });
  
  return Object.keys(projects).map(name => ({
    name,
    hours: projects[name]
  }));
};

const roleDistributionData = () => {
  const roles: Record<string, number> = {};
  
  workforceMetrics.forEach(metric => {
    if (roles[metric.role]) {
      roles[metric.role]++;
    } else {
      roles[metric.role] = 1;
    }
  });
  
  return Object.keys(roles).map(role => ({
    name: role.replace('_', ' '),
    value: roles[role]
  }));
};

const productivityTrendData = [
  { week: 'Week 1', productivity: 72 },
  { week: 'Week 2', productivity: 75 },
  { week: 'Week 3', productivity: 78 },
  { week: 'Week 4', productivity: 74 },
  { week: 'Week 5', productivity: 80 },
  { week: 'Week 6', productivity: 83 },
  { week: 'Week 7', productivity: 81 },
  { week: 'Week 8', productivity: 85 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

export const WorkforceDashboard: React.FC = () => {
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isMobile = useIsMobile();
  
  // Filter employees based on selected filters and search term
  const filteredEmployees = workforceMetrics.filter(employee => {
    const roleMatch = filterRole === 'all' || employee.role === filterRole;
    const projectMatch = filterProject === 'all' || employee.projectName.includes(filterProject);
    const searchMatch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && projectMatch && searchMatch;
  });
  
  // Get unique roles and projects for filters
  const uniqueRoles = Array.from(new Set(workforceMetrics.map(e => e.role)));
  const uniqueProjects = Array.from(new Set(workforceMetrics.map(e => e.projectName)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workforce Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of workforce metrics, productivity, and resource allocation
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative max-w-[200px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search employees..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 max-w-[200px]"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map(project => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Workforce</CardTitle>
            <CardDescription>Active employees and contractors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockEmployees.length + mockSubcontractors.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {mockEmployees.length} employees, {mockSubcontractors.length} subcontractors
            </div>
            <div className="mt-4 flex gap-3">
              <Badge className="bg-blue-500">
                {mockEmployees.filter(e => e.status === 'active').length} Active
              </Badge>
              <Badge variant="outline">
                {mockEmployees.filter(e => e.status !== 'active').length} Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Hours This Week</CardTitle>
            <CardDescription>Total tracked hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workforceMetrics.reduce((sum, e) => sum + e.hoursWorked, 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Across {uniqueProjects.length} active projects
            </div>
            <div className="mt-4 flex gap-3">
              <Badge className="bg-green-500">
                {workforceMetrics.reduce((sum, e) => sum + (e.hoursWorked > 35 ? 1 : 0), 0)} Full-time
              </Badge>
              <Badge className="bg-yellow-500">
                {workforceMetrics.reduce((sum, e) => sum + (e.hoursWorked <= 35 ? 1 : 0), 0)} Part-time
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Avg Productivity</CardTitle>
            <CardDescription>Based on task completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(workforceMetrics.reduce((sum, e) => sum + parseFloat(e.productivity), 0) / workforceMetrics.length).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +3.2% from last month
            </div>
            <div className="mt-4 flex gap-3">
              <Badge className="bg-blue-500">
                {workforceMetrics.filter(e => parseFloat(e.productivity) > 80).length} High performers
              </Badge>
              <Badge variant="outline" className="text-yellow-500">
                {workforceMetrics.filter(e => parseFloat(e.productivity) < 70).length} Need attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
          <TabsTrigger value="employees">Employee Roster</TabsTrigger>
          <TabsTrigger value="contractors">Subcontractors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hours by Project</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectHoursData()} layout={isMobile ? "vertical" : "horizontal"}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={isMobile ? "hours" : "name"} type={isMobile ? "number" : "category"} />
                    <YAxis dataKey={isMobile ? "name" : "hours"} type={isMobile ? "category" : "number"} />
                    <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                    <Legend />
                    <Bar dataKey="hours" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Productivity Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Productivity']} />
                    <Legend />
                    <Line type="monotone" dataKey="productivity" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roleDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roleDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="grid gap-2">
                      {roleDistributionData().map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="text-sm">{entry.name}</div>
                          <div className="text-sm font-medium ml-auto">{entry.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Roster</CardTitle>
              <CardDescription>
                {filteredEmployees.length} employees showing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Productivity</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.role.replace('_', ' ')}</TableCell>
                        <TableCell>{employee.projectName}</TableCell>
                        <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                        <TableCell className="text-right">{employee.hoursWorked}h</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{employee.productivity}%</TableCell>
                        <TableCell className="text-right">
                          <Badge className={employee.availability === 'available' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {employee.availability}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contractors">
          <Card>
            <CardHeader>
              <CardTitle>Subcontractor Details</CardTitle>
              <CardDescription>
                {mockSubcontractors.length} subcontractors currently engaged
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Specialties</TableHead>
                      <TableHead className="text-right">Projects</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubcontractors.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.companyName}</TableCell>
                        <TableCell>{sub.contactName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {sub.specialties.slice(0, 2).join(", ")}
                          {sub.specialties.length > 2 && "..."}
                        </TableCell>
                        <TableCell className="text-right">{sub.currentProjects.length}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            sub.performance.rating >= 4.5 ? 'bg-green-500' : 
                            sub.performance.rating >= 4.0 ? 'bg-blue-500' : 'bg-yellow-500'
                          }>
                            {sub.performance.rating}/5
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforceDashboard;
