
import { requireAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BarChart2, FileText, Users, MessageCircle, Clock, PlusCircle } from "lucide-react";

const ProjectHub = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Hub</h1>
          <p className="text-muted-foreground">
            Manage and track all your roadway construction projects
          </p>
        </div>
        
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Project Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
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
            <div className="text-2xl font-bold">32</div>
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
      </div>

      {/* Projects Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Card 1 */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-green-500 hover:bg-green-600">Active</Badge>
                <CardTitle className="text-xl">I-85 North Resurfacing</CardTitle>
                <CardDescription>Georgia DOT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">$5.4M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-muted">
                    <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Oct 12, 2023</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Details</Button>
                <Button variant="outline" size="sm">Schedule</Button>
                <Button size="sm">Dashboard</Button>
              </CardFooter>
            </Card>
            
            {/* Project Card 2 */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-green-500 hover:bg-green-600">Active</Badge>
                <CardTitle className="text-xl">Highway 400 Bridge Repair</CardTitle>
                <CardDescription>Atlanta Public Works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">$2.8M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-muted">
                    <div className="h-full bg-green-500" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Aug 5, 2023</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>18</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Details</Button>
                <Button variant="outline" size="sm">Schedule</Button>
                <Button size="sm">Dashboard</Button>
              </CardFooter>
            </Card>
            
            {/* Project Card 3 */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-green-500 hover:bg-green-600">Active</Badge>
                <CardTitle className="text-xl">South Ridge Connector</CardTitle>
                <CardDescription>County Transportation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">$3.2M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-muted">
                    <div className="h-full bg-green-500" style={{ width: '23%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Dec 3, 2023</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>31</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Details</Button>
                <Button variant="outline" size="sm">Schedule</Button>
                <Button size="sm">Dashboard</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Completed Project Card */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-500 hover:bg-blue-600">Completed</Badge>
                <CardTitle className="text-xl">Peachtree Street Extension</CardTitle>
                <CardDescription>City of Atlanta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">$4.1M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-muted">
                    <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Completed Oct 5, 2023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Details</Button>
                <Button variant="outline" size="sm">Archive</Button>
                <Button size="sm">Report</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Upcoming Project Card */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-amber-500 hover:bg-amber-600">Upcoming</Badge>
                <CardTitle className="text-xl">East-West Connector</CardTitle>
                <CardDescription>State Transportation Dept.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">$7.2M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">18 months</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm">Setup</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Updates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest activities across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-blue-100 p-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">New RFI submitted for I-85 North Resurfacing</p>
                <p className="text-sm text-muted-foreground">Regarding drainage specifications at mile marker 112</p>
                <p className="text-xs text-muted-foreground">2 hours ago by James Williams</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-green-100 p-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Submittal approved for Highway 400 Bridge Repair</p>
                <p className="text-sm text-muted-foreground">Concrete mix design for pier foundations</p>
                <p className="text-xs text-muted-foreground">Yesterday by Robert Chen</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-amber-100 p-2">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Schedule updated for South Ridge Connector</p>
                <p className="text-sm text-muted-foreground">Phase 2 completion delayed by 2 weeks due to weather</p>
                <p className="text-xs text-muted-foreground">3 days ago by Sarah Johnson</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default requireAuth()(ProjectHub);
