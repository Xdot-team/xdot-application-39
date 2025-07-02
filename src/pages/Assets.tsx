import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/ui/page-header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FleetDashboard from '@/components/assets/FleetDashboard';
import { DispatchManager } from '@/components/assets/DispatchManager';
import { MaintenanceSchedule } from '@/components/assets/MaintenanceSchedule';
import MobileFleetView from '@/components/assets/MobileFleetView';
import { ToolsManagement } from '@/components/assets/ToolsManagement';
import { MaterialsManagement } from '@/components/assets/MaterialsManagement';
import { LocationMap } from '@/components/assets/LocationMap';
import { SubcontractorManagement } from '@/components/subcontractors/SubcontractorManagement';
import { VehicleForm } from '@/components/assets/VehicleForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFleetVehicles } from '@/hooks/useFleetManagement';
import { 
  BarChart, 
  Truck, 
  Wrench, 
  Package, 
  Smartphone, 
  Activity, 
  MapPin, 
  Settings, 
  Building2,
  Plus
} from 'lucide-react';

export default function Assets() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Fleet & Asset Management"
        subheading="Manage vehicles, tools, materials, and equipment tracking"
      />
      
      <div className="relative">
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>{isMobile ? "Dashboard" : "Fleet Dashboard"}</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              <span>Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-1">
              <Wrench className="h-4 w-4" />
              <span>Tools</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>Materials</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="dispatch" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Dispatch</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{isMobile ? "Map" : "Location Map"}</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="subcontractors" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>Subcontractors</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <FleetDashboard />
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <VehicleManagement />
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <ToolsManagement />
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <MaterialsManagement />
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            <MobileFleetView vehicles={[]} />
          </TabsContent>

          <TabsContent value="dispatch" className="space-y-4">
            <DispatchManager vehicles={[]} tools={[]} />
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <LocationMap />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <MaintenanceSchedule vehicles={[]} tools={[]} />
          </TabsContent>

          <TabsContent value="subcontractors" className="space-y-4">
            <SubcontractorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function VehicleManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { vehicles, loading, refetch } = useFleetVehicles();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <p className="text-muted-foreground">Comprehensive vehicle tracking and management system</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading vehicles...</div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first vehicle to the fleet.</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{vehicle.vehicle_number}</h4>
                    <Badge variant={vehicle.status === 'available' ? 'secondary' : vehicle.status === 'in_use' ? 'default' : 'destructive'}>
                      {vehicle.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Type: {vehicle.vehicle_type.replace('_', ' ')}
                  </p>
                  {vehicle.current_mileage && (
                    <p className="text-sm text-muted-foreground">
                      Mileage: {vehicle.current_mileage.toLocaleString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <VehicleForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSave={() => {
          refetch();
          setIsFormOpen(false);
        }} 
      />
    </div>
  );
}