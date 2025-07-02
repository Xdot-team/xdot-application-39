
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Map, 
  MapPin, 
  Truck, 
  Filter, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  ChartBar 
} from "lucide-react";
import { useFleetVehicles, useFleetMetrics } from "@/hooks/useFleetManagement";
import FleetMap from "./FleetMap";
import FleetMetrics from "./FleetMetrics";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import FleetAlerts from "./FleetAlerts";

const FleetDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  
  // Use real database hooks
  const { vehicles, loading: vehiclesLoading } = useFleetVehicles();
  const { metrics, loading: metricsLoading } = useFleetMetrics();

  // Filter vehicles based on selected filters
  const filteredVehicles = vehicles.filter(vehicle => {
    const statusMatch = statusFilter === "all" || vehicle.status === statusFilter;
    const locationMatch = locationFilter === "all" || 
      (vehicle.current_project_id && vehicle.current_project_id.includes(locationFilter));
    
    return statusMatch && locationMatch;
  });

  // Count vehicles by status
  const vehiclesByStatus = {
    inUse: vehicles.filter(v => v.status === 'in_use').length,
    available: vehicles.filter(v => v.status === 'available').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    offline: vehicles.filter(v => v.status === 'offline').length
  };

  // Find vehicles with overdue maintenance
  const currentDate = new Date();
  const overdueVehicles = vehicles.filter(v => 
    v.registration_expiry && new Date(v.registration_expiry) < currentDate ||
    v.inspection_expiry && new Date(v.inspection_expiry) < currentDate
  );

  // Calculate fleet utilization using metrics
  const utilizationRate = metrics?.utilizationRate?.toFixed(1) || "0";

  return (
    <div className="space-y-4">
      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Use</span>
                  <Badge className="bg-blue-500">{vehiclesByStatus.inUse}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Available</span>
                  <Badge className="bg-green-500">{vehiclesByStatus.available}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Maintenance</span>
                  <Badge className="bg-amber-500">{vehiclesByStatus.maintenance}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Offline</span>
                  <Badge className="bg-red-500">{vehiclesByStatus.offline}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-3xl font-bold">{utilizationRate}%</div>
              <div className="text-sm text-muted-foreground">Active vehicles</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Maintenance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-2">
                {overdueVehicles.length > 0 ? (
                  <div className="flex items-center text-amber-500">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>{overdueVehicles.length} overdue</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-500">
                    <Wrench className="h-4 w-4 mr-2" />
                    <span>All maintenance current</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Next: {
                    vehicles
                      .filter(v => v.registration_expiry)
                      .sort((a, b) => new Date(a.registration_expiry!).getTime() - new Date(b.registration_expiry!).getTime())[0]?.registration_expiry || 'None scheduled'
                  }</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                <span>Schedule</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Map className="h-4 w-4 mr-2" />
                <span>Locate All</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <ChartBar className="h-4 w-4 mr-2" />
                <span>Reports</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                <span>Dispatch</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm font-medium mr-2">Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="maintenance">In Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Location:</span>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="I-85">I-85 Bridge Repair</SelectItem>
              <SelectItem value="GA-400">GA-400 Repaving</SelectItem>
              <SelectItem value="I-75">I-75 Resurfacing</SelectItem>
              <SelectItem value="I-285">I-285 Bridge Project</SelectItem>
              <SelectItem value="Yard">Main Yard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Button variant="outline" size="sm" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Refresh Locations</span>
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            <span>Map View</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <ChartBar className="h-4 w-4" />
            <span>Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-1">
            <Wrench className="h-4 w-4" />
            <span>Maintenance</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Alerts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Overview</CardTitle>
              <CardDescription>
                View and manage your entire fleet from a single dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Vehicle</th>
                      <th className="p-2 text-left font-medium">Type</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Location</th>
                      <th className="p-2 text-left font-medium">Last Update</th>
                      <th className="p-2 text-left font-medium">Next Maintenance</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b">
                        <td className="p-2">
                          <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                          <div className="text-xs text-muted-foreground">{vehicle.vehicle_number}</div>
                        </td>
                        <td className="p-2">{vehicle.vehicle_type}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 ${
                              vehicle.status === 'in_use' ? 'bg-blue-500' :
                              vehicle.status === 'available' ? 'bg-green-500' :
                              vehicle.status === 'maintenance' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`} />
                            <span className="capitalize">{vehicle.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="p-2">{vehicle.current_project_id || 'Not assigned'}</td>
                        <td className="p-2">
                          {vehicle.last_gps_update ? 
                            new Date(vehicle.last_gps_update).toLocaleString() : 
                            'Unknown'}
                        </td>
                        <td className="p-2">
                          <span className={
                            vehicle.registration_expiry && new Date(vehicle.registration_expiry) < new Date() 
                              ? 'text-red-500 font-medium' 
                              : ''
                          }>
                            {vehicle.registration_expiry || 'Not scheduled'}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" title="Locate">
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Maintenance">
                              <Wrench className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Map</CardTitle>
              <CardDescription>Real-time location of all vehicles</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[500px]">
              <FleetMap vehicles={filteredVehicles} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Metrics</CardTitle>
              <CardDescription>Performance and utilization analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <FleetMetrics vehicles={filteredVehicles} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming and overdue maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceSchedule vehicles={filteredVehicles} tools={[]} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Alerts</CardTitle>
              <CardDescription>Important notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <FleetAlerts vehicles={filteredVehicles} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetDashboard;
