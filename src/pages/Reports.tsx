
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { ReportsList } from '@/components/reports/ReportsList';
import { ReportBuilder } from '@/components/reports/ReportBuilder';
import { ReportTemplates } from '@/components/reports/ReportTemplates';
import { ReportScheduling } from '@/components/reports/ReportScheduling';
import { requireAuth } from '@/contexts/AuthContext';

function Reports() {
  const [activeTab, setActiveTab] = useState('reports');

  const handleExport = (format: string) => {
    console.log(`Exporting in ${format} format`);
    // Implementation would connect to a backend service for actual export
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <PageHeader 
          heading="Reports"
          subheading="Generate and manage detailed operational reports"
        />
        <div className="py-2 px-4 bg-slate-100 rounded-md text-sm text-slate-600 font-medium">
          
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px] mb-4">
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <ReportsList handleExport={handleExport} />
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <ReportTemplates />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <ReportScheduling />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default requireAuth(['admin', 'project_manager', 'accountant'])(Reports);
