
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileSymlink,
  ListChecks,
  Receipt,
  FileSpreadsheet,
  HelpCircle,
  Calendar,
  FileEdit,
  FileMinus,
  Archive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/lib/formatters';

export function ProjectsTab() {
  // Mock data for recent projects
  const recentProjects = [
    { id: 1, name: "I-85 North Resurfacing", client: "Georgia DOT", status: "In Progress", dueDate: "2023-11-15" },
    { id: 2, name: "Highway 400 Bridge Repair", client: "Atlanta Public Works", status: "Planning", dueDate: "2023-12-10" },
    { id: 3, name: "Peachtree Street Extension", client: "City of Atlanta", status: "Completed", dueDate: "2023-10-05" },
    { id: 4, name: "GA-400 Expansion", client: "State Highway Authority", status: "In Progress", dueDate: "2023-12-20" },
    { id: 5, name: "I-75 Bridge Repair", client: "Georgia DOT", status: "Planning", dueDate: "2024-01-15" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>Overview of active construction projects</CardDescription>
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
        </CardContent>
      </Card>

      {/* Project Dashboard Section with Tabs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Project Dashboard</h2>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full overflow-x-auto overflow-y-hidden flex-wrap">
            <TabsTrigger value="overview" className="whitespace-nowrap">
              <BarChart2 className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="notifications" className="whitespace-nowrap">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="notes" className="whitespace-nowrap">
              <FileEdit className="h-4 w-4 mr-2" /> Notes
            </TabsTrigger>
            <TabsTrigger value="scopeWip" className="whitespace-nowrap">
              <ListChecks className="h-4 w-4 mr-2" /> Scope WIP
            </TabsTrigger>
            <TabsTrigger value="progressSchedule" className="whitespace-nowrap">
              <Clock className="h-4 w-4 mr-2" /> Progress Schedule
            </TabsTrigger>
            <TabsTrigger value="costCompletion" className="whitespace-nowrap">
              <DollarSign className="h-4 w-4 mr-2" /> Cost to Completion
            </TabsTrigger>
            <TabsTrigger value="utilityMeetings" className="whitespace-nowrap">
              <CalendarDays className="h-4 w-4 mr-2" /> Utility Meetings
            </TabsTrigger>
            <TabsTrigger value="aiaBilling" className="whitespace-nowrap">
              <Receipt className="h-4 w-4 mr-2" /> AIA Billing
            </TabsTrigger>
            <TabsTrigger value="changeOrders" className="whitespace-nowrap">
              <FileMinus className="h-4 w-4 mr-2" /> Change Orders
            </TabsTrigger>
            <TabsTrigger value="submittals" className="whitespace-nowrap">
              <FileSymlink className="h-4 w-4 mr-2" /> Submittals
            </TabsTrigger>
            <TabsTrigger value="rfis" className="whitespace-nowrap">
              <HelpCircle className="h-4 w-4 mr-2" /> RFIs
            </TabsTrigger>
            <TabsTrigger value="schedule" className="whitespace-nowrap">
              <Calendar className="h-4 w-4 mr-2" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="documents" className="whitespace-nowrap">
              <Archive className="h-4 w-4 mr-2" /> Documents
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Content */}
          <TabsContent value="overview" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Overall Progress:</span>
                  <span className="font-medium">67%</span>
                </div>
                <Progress value={67} className="h-2" />
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Projects</p>
                    <p className="font-medium">12</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="font-medium">${(76500000 / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scopeWip" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progressSchedule" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-3">
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
          
          <TabsContent value="costCompletion" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="utilityMeetings" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="aiaBilling" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="changeOrders" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="submittals" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rfis" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="pt-4">
            <Card>
              <CardContent className="p-4 space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Updates Section - Moved under the tabs */}
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
}
