
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
import { RiskDashboard } from "@/components/safety/RiskDashboard";
import { RiskMitigation } from "@/components/safety/RiskMitigation";
import { MobileRiskViewer } from "@/components/safety/MobileRiskViewer";
import { JobSafetyAnalysis } from "@/components/safety/JobSafetyAnalysis";
import { ToolboxMeetings } from "@/components/safety/ToolboxMeetings";
import { DriverTrends } from "@/components/safety/DriverTrends";
import { MobileDriverView } from "@/components/safety/MobileDriverView";
import { RiskDriverIntegration } from "@/components/safety/RiskDriverIntegration";
import { 
  AlertTriangle, 
  Clipboard, 
  FileCheck, 
  ShieldCheck, 
  Award, 
  ShieldAlert, 
  Sparkles, 
  Bell, 
  ClipboardList, 
  Users,
  Car,
  BarChart,
  Smartphone
} from "lucide-react";

export default function Safety() {
  const [activeTab, setActiveTab] = useState("incidents");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Safety & Risk Management"
        subheading="Manage safety incidents, hazards, risks, compliance, certifications, and safety meetings"
      />
      
      <div className="relative">
        <Tabs
          defaultValue="incidents"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-8 grid grid-cols-2 md:grid-cols-4 xl:flex xl:flex-wrap">
            <TabsTrigger value="incidents" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>{isMobile ? "Incidents" : "Incident Reports"}</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-1">
              <ShieldAlert className="h-4 w-4" />
              <span>{isMobile ? "Risks" : "Risk Management"}</span>
            </TabsTrigger>
            <TabsTrigger value="mitigation" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>{isMobile ? "Mitigate" : "Risk Mitigation"}</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{isMobile ? "Drivers" : "Driver Trends"}</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>{isMobile ? "AI Risk" : "Risk & Driver Integration"}</span>
            </TabsTrigger>
            <TabsTrigger value="jsa" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span>{isMobile ? "JSA" : "Job Safety Analysis"}</span>
            </TabsTrigger>
            <TabsTrigger value="toolbox" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{isMobile ? "Meetings" : "Toolbox Meetings"}</span>
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
            <TabsTrigger value="mobile-risk" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>{isMobile ? "Mobile Risk" : "Mobile Risk View"}</span>
            </TabsTrigger>
            <TabsTrigger value="mobile-driver" className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              <span>{isMobile ? "Mobile Driver" : "Mobile Driver View"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <IncidentDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <RiskDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mitigation" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <RiskMitigation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drivers" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <DriverTrends />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <RiskDriverIntegration />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jsa" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <JobSafetyAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toolbox" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ToolboxMeetings />
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

          <TabsContent value="mobile-risk" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="max-w-md mx-auto">
                  <div className="border-4 border-gray-300 rounded-3xl overflow-hidden">
                    <div className="bg-gray-200 py-2 text-center text-sm font-medium border-b border-gray-300">
                      Mobile Risk Viewer
                    </div>
                    <div className="bg-background h-[600px] overflow-y-auto">
                      <MobileRiskViewer />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mobile-driver" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="max-w-md mx-auto">
                  <div className="border-4 border-gray-300 rounded-3xl overflow-hidden">
                    <div className="bg-gray-200 py-2 text-center text-sm font-medium border-b border-gray-300">
                      Mobile Driver Trends Viewer
                    </div>
                    <div className="bg-background h-[600px] overflow-y-auto">
                      <MobileDriverView />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="py-4 text-sm text-center text-muted-foreground border-t mt-8">
        <p></p>
      </footer>
    </div>
  );
}
