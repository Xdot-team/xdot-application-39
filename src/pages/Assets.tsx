import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/ui/page-header';
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
import { 
  BarChart, 
  Truck, 
  Wrench, 
  Package, 
  Smartphone, 
  Activity, 
  MapPin, 
  Settings, 
  Building2 
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vehicle Management</h2>
      <p>Comprehensive vehicle tracking and management system</p>
      <VehicleForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSave={() => {}} 
      />
    </div>
  );
}