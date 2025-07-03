
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
  const [incidentStats, setIncidentStats] = useState({ total: 4, open: 2, high_severity: 1 });
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        heading="Safety & Risk Management"
        subheading={isMobile 
          ? `${incidentStats.total} incidents • ${incidentStats.open} open • ${incidentStats.high_severity} high priority`
          : `Manage safety incidents, hazards, risks, compliance, certifications, and safety meetings • ${incidentStats.total} total incidents • ${incidentStats.open} open cases • ${incidentStats.high_severity} high priority`
        }
      />
      
      <div className="relative">
        <Tabs
          defaultValue="incidents"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap gap-1 h-auto p-1">
            <TabsTrigger value="incidents" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Incident Reports</span>
              <span className="sm:hidden">Incidents</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <ShieldAlert className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Risk Management</span>
              <span className="sm:hidden">Risks</span>
            </TabsTrigger>
            <TabsTrigger value="mitigation" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Risk Mitigation</span>
              <span className="sm:hidden">Mitigate</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Car className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Driver Trends</span>
              <span className="sm:hidden">Drivers</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <BarChart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Risk & Driver Integration</span>
              <span className="lg:hidden">AI Risk</span>
            </TabsTrigger>
            <TabsTrigger value="jsa" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Job Safety Analysis</span>
              <span className="sm:hidden">JSA</span>
            </TabsTrigger>
            <TabsTrigger value="toolbox" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Toolbox Meetings</span>
              <span className="sm:hidden">Meetings</span>
            </TabsTrigger>
            <TabsTrigger value="hazards" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Clipboard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Hazard Reporting</span>
              <span className="sm:hidden">Hazards</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Compliance Checks</span>
              <span className="sm:hidden">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <FileCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Safety Training</span>
              <span className="sm:hidden">Training</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Certifications</span>
              <span className="sm:hidden">Certs</span>
            </TabsTrigger>
            <TabsTrigger value="mobile-risk" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Mobile Risk View</span>
              <span className="lg:hidden">Mobile Risk</span>
            </TabsTrigger>
            <TabsTrigger value="mobile-driver" className="flex items-center gap-1 text-xs sm:text-sm p-2 sm:p-3">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Mobile Driver View</span>
              <span className="lg:hidden">Mobile Driver</span>
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
                <div className="max-w-sm sm:max-w-md mx-auto">
                  <div className="border-2 sm:border-4 border-gray-300 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <div className="bg-gray-200 py-1 sm:py-2 text-center text-xs sm:text-sm font-medium border-b border-gray-300">
                      Mobile Risk Viewer
                    </div>
                    <div className="bg-background h-[500px] sm:h-[600px] overflow-y-auto">
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
                <div className="max-w-sm sm:max-w-md mx-auto">
                  <div className="border-2 sm:border-4 border-gray-300 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <div className="bg-gray-200 py-1 sm:py-2 text-center text-xs sm:text-sm font-medium border-b border-gray-300">
                      Mobile Driver Trends Viewer
                    </div>
                    <div className="bg-background h-[500px] sm:h-[600px] overflow-y-auto">
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
