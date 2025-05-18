
import { requireAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cube, MapPin, Satellite, Construction, Link2 } from "lucide-react";
import { useState } from "react";
import { StatusDashboard } from "@/components/survey/StatusDashboard";
import { VisualizationView } from "@/components/survey/VisualizationView";
import { GpsModelView } from "@/components/survey/GpsModelView";
import { RoverDataView } from "@/components/survey/RoverDataView";
import { ConstructionLayoutView } from "@/components/survey/ConstructionLayoutView";
import { HardwareSync } from "@/components/survey/HardwareSync";

const Survey = () => {
  const [activeTab, setActiveTab] = useState("status");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Survey</h1>
          <p className="text-muted-foreground">
            Manage project surveying, mapping, and site visualization tools
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="status" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Status Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-1">
            <Cube className="h-4 w-4" />
            <span>3D Visualization</span>
          </TabsTrigger>
          <TabsTrigger value="gps" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>GPS Model</span>
          </TabsTrigger>
          <TabsTrigger value="rover" className="flex items-center gap-1">
            <Satellite className="h-4 w-4" />
            <span>Rover Data</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-1">
            <Construction className="h-4 w-4" />
            <span>Construction Layout</span>
          </TabsTrigger>
          <TabsTrigger value="hardware" className="flex items-center gap-1">
            <Link2 className="h-4 w-4" />
            <span>Hardware Sync</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6">
          <StatusDashboard />
        </TabsContent>
        
        <TabsContent value="visualization" className="mt-6">
          <VisualizationView />
        </TabsContent>
        
        <TabsContent value="gps" className="mt-6">
          <GpsModelView />
        </TabsContent>
        
        <TabsContent value="rover" className="mt-6">
          <RoverDataView />
        </TabsContent>
        
        <TabsContent value="layout" className="mt-6">
          <ConstructionLayoutView />
        </TabsContent>
        
        <TabsContent value="hardware" className="mt-6">
          <HardwareSync />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default requireAuth()(Survey);
