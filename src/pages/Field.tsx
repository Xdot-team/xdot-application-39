
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Wrench, Clock, AlertTriangle, Camera, FileText, Calendar, Truck, HardHat } from "lucide-react";

const Field = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field Operations</h1>
          <p className="text-muted-foreground">
            Manage on-site activities, crews, equipment, and daily operations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crews">Crews</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="daily-logs">Daily Logs</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Crews</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  32 workers on site
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipment Status</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15/18</div>
                <p className="text-xs text-muted-foreground">
                  3 under maintenance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Safety Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">256</div>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Foundation excavation - 85% complete</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Concrete delivery scheduled for 2 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Steel reinforcement inspection pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weather & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Temperature:</span>
                    <span className="text-sm font-medium">72°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Conditions:</span>
                    <span className="text-sm font-medium">Partly Cloudy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Wind:</span>
                    <span className="text-sm font-medium">5 mph</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rain Probability:</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Crews</CardTitle>
              <CardDescription>
                Manage crew assignments and track workforce allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Excavation Team A", members: 4, supervisor: "John Smith", status: "active", location: "Zone 1" },
                  { name: "Concrete Team B", members: 6, supervisor: "Sarah Johnson", status: "active", location: "Zone 2" },
                  { name: "Steel Team C", members: 5, supervisor: "Mike Wilson", status: "break", location: "Zone 3" },
                  { name: "Electrical Team D", members: 3, supervisor: "Lisa Brown", status: "active", location: "Zone 4" }
                ].map((crew, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{crew.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {crew.members} members • Supervisor: {crew.supervisor}
                      </p>
                      <p className="text-sm text-muted-foreground">Location: {crew.location}</p>
                    </div>
                    <Badge variant={crew.status === 'active' ? 'default' : 'secondary'}>
                      {crew.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>
                Monitor equipment location, status, and maintenance schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Excavator CAT 320", id: "EX-001", status: "active", location: "Zone 1", operator: "John Doe", hours: "1,245" },
                  { name: "Bulldozer D6T", id: "BD-002", status: "maintenance", location: "Shop", operator: "-", hours: "2,156" },
                  { name: "Concrete Mixer", id: "CM-003", status: "active", location: "Zone 2", operator: "Jane Smith", hours: "856" },
                  { name: "Crane 50T", id: "CR-004", status: "active", location: "Zone 3", operator: "Bob Johnson", hours: "3,421" }
                ].map((equipment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{equipment.name} ({equipment.id})</h4>
                      <p className="text-sm text-muted-foreground">
                        Operator: {equipment.operator} • Hours: {equipment.hours}
                      </p>
                      <p className="text-sm text-muted-foreground">Location: {equipment.location}</p>
                    </div>
                    <Badge variant={equipment.status === 'active' ? 'default' : equipment.status === 'maintenance' ? 'destructive' : 'secondary'}>
                      {equipment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily-logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Field Reports</CardTitle>
              <CardDescription>
                Track daily activities, progress, and field observations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full md:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Today's Report
                </Button>
                
                <div className="space-y-3">
                  {[
                    { date: "2023-10-23", weather: "Sunny", crews: 8, progress: "Foundation work 85% complete", issues: "None" },
                    { date: "2023-10-22", weather: "Cloudy", crews: 7, progress: "Excavation completed in Zone 1", issues: "Equipment delay" },
                    { date: "2023-10-21", weather: "Rainy", crews: 5, progress: "Limited work due to weather", issues: "Weather delay" }
                  ].map((log, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{log.date}</h4>
                        <Badge variant="outline">{log.weather}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Crews: {log.crews} • Progress: {log.progress}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Issues: {log.issues}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Management</CardTitle>
              <CardDescription>
                Monitor safety compliance and incident reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Safety Checklist</h3>
                  {[
                    { item: "Daily safety briefing completed", status: "complete" },
                    { item: "PPE inspection conducted", status: "complete" },
                    { item: "Equipment safety checks", status: "pending" },
                    { item: "Site hazard assessment", status: "complete" }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{check.item}</span>
                      <Badge variant={check.status === 'complete' ? 'default' : 'secondary'}>
                        {check.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Recent Safety Reports</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-800">No incidents reported</p>
                      <p className="text-xs text-green-600">Last 30 days</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-medium text-blue-800">Safety training completed</p>
                      <p className="text-xs text-blue-600">All crew members certified</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Management</CardTitle>
              <CardDescription>
                Track material deliveries, inventory, and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Concrete</h4>
                    <p className="text-2xl font-bold">150 yd³</p>
                    <p className="text-sm text-muted-foreground">Delivered today</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Rebar</h4>
                    <p className="text-2xl font-bold">5 tons</p>
                    <p className="text-sm text-muted-foreground">In stock</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Lumber</h4>
                    <p className="text-2xl font-bold">2,400 bf</p>
                    <p className="text-sm text-muted-foreground">Arriving tomorrow</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Upcoming Deliveries</h3>
                  <div className="space-y-3">
                    {[
                      { material: "Steel Beams", quantity: "12 pieces", date: "2023-10-24", supplier: "Steel Co." },
                      { material: "Concrete Mix", quantity: "200 yd³", date: "2023-10-25", supplier: "Ready Mix Inc." },
                      { material: "Electrical Conduit", quantity: "500 ft", date: "2023-10-26", supplier: "Electric Supply" }
                    ].map((delivery, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{delivery.material}</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.quantity} • {delivery.supplier}
                          </p>
                        </div>
                        <Badge variant="outline">{delivery.date}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Field;
