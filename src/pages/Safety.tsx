
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { IncidentDashboard } from "@/components/safety/IncidentDashboard";
import { HazardReporting } from "@/components/safety/HazardReporting";
import { ComplianceChecklist } from "@/components/safety/ComplianceChecklist";
import { SafetyTrainingList } from "@/components/safety/SafetyTrainingList";
import { CertificationManagement } from "@/components/safety/CertificationManagement";
import { AlertTriangle, Clipboard, FileCheck, ShieldCheck, Award } from "lucide-react";

export default function Safety() {
  const [activeTab, setActiveTab] = useState("incidents");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Safety Management"
        subheading="Manage safety incidents, hazards, training, compliance, and certifications"
      />
      
      <div className="relative">
        <Tabs
          defaultValue="incidents"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-8">
            <TabsTrigger value="incidents" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>{isMobile ? "Incidents" : "Incident Reports"}</span>
            </TabsTrigger>
            <TabsTrigger value="hazards" className="flex items-center gap-1">
              <Clipboard className="h-4 w-4" />
              <span>{isMobile ? "Hazards" : "Hazard Reporting"}</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>{isMobile ? "Compliance" : "Compliance Checks"}</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span>{isMobile ? "Training" : "Safety Training"}</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{isMobile ? "Certs" : "Certifications"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <IncidentDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hazards" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <HazardReporting />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ComplianceChecklist />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <SafetyTrainingList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <CertificationManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="py-4 text-sm text-center text-muted-foreground border-t mt-8">
        <p>Construct for Centuries</p>
      </footer>
    </div>
  );
}
