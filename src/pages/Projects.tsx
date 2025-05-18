
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { ProjectList } from '@/components/projects/ProjectList';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import ProjectHeader from '@/components/projects/ProjectHeader';
import { 
  CalendarDays, 
  BarChart2, 
  FileText, 
  Users, 
  MessageCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Calendar,
  HelpCircle,
  FileSymlink,
  ListChecks,
  Receipt,
  FileSpreadsheet,
  FileEdit,
  FileMinus,
  Archive
} from "lucide-react";
import { generateMockProjects } from '@/data/mockProjects';
import { formatCurrency } from '@/lib/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

const Projects = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [activeProjectTab, setActiveProjectTab] = useState("overview");
  const navigate = useNavigate();
  const projects = generateMockProjects();
  const isMobile = useIsMobile();
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  
  const notificationCount = 4; // Mock value for unread notifications
  
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
        </div>
      </div>

      {/* Project Dashboard Section - Direct copy of the tab system from ProjectDetails.tsx */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Project Dashboard</h2>
          <Button variant="outline" onClick={() => navigate('/projects/details')}>
            View All Details
          </Button>
        </div>

        {/* Tab system copied directly from ProjectDetails.tsx */}
        <Tabs 
          defaultValue="overview" 
          value={activeProjectTab} 
          onValueChange={setActiveProjectTab} 
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
            <TabsTrigger value="recentUpdates">Recent Updates</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Project Description</h3>
                    <p className="text-sm">Development of major highway infrastructure including lane expansion, bridge repairs, and drainage improvements.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Contract Value:</span>
                        <span className="font-medium">{formatCurrency(12500000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Change Orders:</span>
                        <span className="font-medium">{formatCurrency(35000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Contract:</span>
                        <span className="font-medium">{formatCurrency(12535000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Billed to Date:</span>
                        <span className="font-medium">{formatCurrency(5625000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Remaining:</span>
                        <span className="font-medium">{formatCurrency(6910000)}</span>
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
                        <p className="text-xs text-muted-foreground">2 days ago by John Smith</p>
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
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Site Meeting Follow-up</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Need to confirm utility locations with Georgia Power before excavation starts.
                      </p>
                      <p className="text-xs text-muted-foreground">Today - Maria Rodriguez</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Design Review</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Updated drawings received for foundation details.
                      </p>
                      <p className="text-xs text-muted-foreground">Yesterday - James Williams</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scopeWip">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Foundation Work</p>
                        <span className="text-xs">75%</span>
                      </div>
                      <Progress value={75} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Utility Relocation</p>
                        <span className="text-xs">45%</span>
                      </div>
                      <Progress value={45} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Road Grading</p>
                        <span className="text-xs">30%</span>
                      </div>
                      <Progress value={30} className="h-2 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progressSchedule">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Planned Progress</p>
                        <p className="text-xs text-muted-foreground">Based on schedule</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">70%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Actual Progress</p>
                        <p className="text-xs text-muted-foreground">Current status</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">67%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Next Milestone</p>
                        <p className="text-xs text-muted-foreground">Foundation completion</p>
                      </div>
                      <span className="text-xs">5 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="costCompletion">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">{formatCurrency(12500000)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Forecast</p>
                        <p className="font-medium">{formatCurrency(12200000)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Spent to Date</p>
                        <p className="font-medium">{formatCurrency(8375000)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Variance</p>
                        <p className="font-medium text-green-600">+2.4%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="utilityMeetings">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Georgia Power Coordination</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">May 30, 2023 - 10:00 AM</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">AT&T Line Relocation</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">June 2, 2023 - 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">RFI Response Required</p>
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Urgent</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Due today</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Change Order Review</p>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">High</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="aiaBilling">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Pay App #4</p>
                        <p className="text-xs text-muted-foreground">Due June 15, 2023</p>
                      </div>
                      <Badge>Draft</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Pay App #3</p>
                        <p className="text-xs text-muted-foreground">Submitted May 15, 2023</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="changeOrders">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">CO #5 - Sound Barrier</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(125000)}</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Pending</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">CO #4 - Foundation Adj.</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(87500)}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="submittals">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Concrete Mix Design</p>
                      <Badge>In Review</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Road Rebar Shop Drawings</p>
                      <Badge variant="outline">Approved</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Guardrail Specs</p>
                      <Badge variant="destructive">Rejected</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rfis">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">RFI #23 - Drainage Design</p>
                        <p className="text-xs text-muted-foreground">Submitted 3 days ago</p>
                      </div>
                      <Badge>Open</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">RFI #22 - Utility Conflict</p>
                        <p className="text-xs text-muted-foreground">Submitted 5 days ago</p>
                      </div>
                      <Badge>Open</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Foundation Phase</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">May 15 - June 10</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Utility Relocation</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">May 20 - June 15</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Road Paving</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">June 15 - July 20</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Construction Drawings Rev 3</p>
                        <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Material Quantity Takeoff</p>
                        <p className="text-xs text-muted-foreground">Updated 5 days ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Site Survey Report</p>
                        <p className="text-xs text-muted-foreground">Updated 1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* NEW: Recent Updates Tab */}
            <TabsContent value="recentUpdates">
              <Card>
                <CardContent className="p-6">
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
            </TabsContent>
          </div>
        </Tabs>
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
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'accountant', 'field_worker'])(Projects);

