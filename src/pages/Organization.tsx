
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LiveDashboard } from '@/components/organization/LiveDashboard';
import { ReportsList } from '@/components/organization/ReportsList';
import { KPIOverview } from '@/components/organization/KPIOverview';
import { EOSTracker } from '@/components/organization/EOSTracker';
import { ProjectionCharts } from '@/components/organization/ProjectionCharts';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Organization() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();

  const handleExport = (format: string) => {
    toast({
      title: "Export initiated",
      description: `Exporting data in ${format.toUpperCase()} format`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">
            Data-driven insights and strategic planning tools
          </p>
        </div>
        <div className="py-2 px-4 bg-slate-100 rounded-md text-sm text-slate-600 font-medium">
          
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px] mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="eos">EOS Goals</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <LiveDashboard handleExport={handleExport} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsList />
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <KPIOverview />
        </TabsContent>

        <TabsContent value="eos" className="space-y-4">
          <EOSTracker />
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <ProjectionCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
