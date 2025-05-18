import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { ProjectList } from '@/components/projects/ProjectList';
import ProjectHeader from '@/components/projects/ProjectHeader';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BarChart2, FileText, Users, MessageCircle, Clock, DollarSign, TrendingUp, Bell } from "lucide-react";
import { generateMockProjects } from '@/data/mockProjects';
import { formatCurrency } from '@/lib/formatters';

const Projects = () => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const projects = generateMockProjects();
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  
  return (
    <div className="space-y-6">
      <ProjectHeader />

      {/* Project Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Since January 2023
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open RFIs</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              5 require urgent attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Submittals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              7 awaiting approval
            </p>
          </CardContent>
        </Card>
        
        {/* New card for notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">12</div>
            <p className="text-xs text-muted-foreground">
              4 require attention
            </p>
          </CardContent>
        </Card>
        
        {/* New card for upcoming meetings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utility Meetings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 scheduled this week
            </p>
          </CardContent>
        </Card>
        
        {/* Cost Performance card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost Performance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+2.3%</div>
            <p className="text-xs text-muted-foreground">
              Projects under budget
            </p>
          </CardContent>
        </Card>
        
        {/* Cost Forecasts card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forecasted Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(76500000)}</div>
            <p className="text-xs text-muted-foreground">
              Total project value
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-green-500 hover:bg-green-600">Active</Badge>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription>{project.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contract Value:</span>
                      <span className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-muted">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>24</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Details
                  </Button>
                  <Button variant="outline" size="sm">Schedule</Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Dashboard
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-blue-500 hover:bg-blue-600">Completed</Badge>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription>{project.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contract Value:</span>
                      <span className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-muted">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>Completed {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Details
                  </Button>
                  <Button variant="outline" size="sm">Archive</Button>
                  <Button size="sm">Report</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingProjects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-amber-500 hover:bg-amber-600">Upcoming</Badge>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription>{project.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contract Value:</span>
                      <span className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Details
                  </Button>
                  <Button size="sm">Setup</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Updates Section - add meetings and notifications updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest activities across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* New utility meeting update */}
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-purple-100 p-2">
                <CalendarDays className="h-4 w-4 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Utility Meeting Scheduled for I-85 North Expansion</p>
                <p className="text-sm text-muted-foreground">Georgia Power coordination meeting on May 30</p>
                <p className="text-xs text-muted-foreground">Today by Maria Rodriguez</p>
              </div>
            </div>
            
            {/* New notification update */}
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-red-100 p-2">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Urgent RFI Response Required for I-85 North Expansion</p>
                <p className="text-sm text-muted-foreground">Response needed for foundation specifications</p>
                <p className="text-xs text-muted-foreground">2 hours ago by System</p>
              </div>
            </div>
            
            {/* Cost forecast update */}
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-green-100 p-2">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Cost forecast updated for I-85 North Expansion</p>
                <p className="text-sm text-muted-foreground">Project is currently 3.2% under budget</p>
                <p className="text-xs text-muted-foreground">Yesterday by Sarah Johnson</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-blue-100 p-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">New RFI submitted for I-85 North Expansion</p>
                <p className="text-sm text-muted-foreground">Regarding drainage specifications at mile marker 112</p>
                <p className="text-xs text-muted-foreground">2 hours ago by James Williams</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-amber-100 p-2">
                <MessageCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Change Order #2 submitted for I-85 North Expansion</p>
                <p className="text-sm text-muted-foreground">Modified Sound Barrier Design due to undiscovered utilities</p>
                <p className="text-xs text-muted-foreground">Yesterday by Thomas Rodriguez</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-green-100 p-2">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">AIA Pay Application #3 approved for I-85 North Expansion</p>
                <p className="text-sm text-muted-foreground">Payment of $3,607,625.00 has been approved</p>
                <p className="text-xs text-muted-foreground">3 days ago by John Doe</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'accountant', 'field_worker'])(Projects);
