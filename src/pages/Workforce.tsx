
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-mobile";
import { EmployeeDashboard } from "@/components/workforce/EmployeeDashboard";
import { TimeCardManagement } from "@/components/workforce/TimeCardManagement";
import { SubcontractorManagement } from "@/components/workforce/SubcontractorManagement";
import { OnboardingWorkflow } from "@/components/workforce/OnboardingWorkflow";
import { AppreciationHub } from "@/components/workforce/AppreciationHub";
import { UserRound, Clock, Award, FileCheck, Users } from "lucide-react";

export default function Workforce() {
  const [activeTab, setActiveTab] = useState("employees");
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Workforce Management"
        subheading="Manage employees, time cards, onboarding, and subcontractors"
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
          <p className="text-6xl font-bold uppercase whitespace-nowrap transform -rotate-12">Construct for Centuries</p>
        </div>
        
        <Tabs
          defaultValue="employees"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-8">
            <TabsTrigger value="employees" className="flex items-center gap-1">
              <UserRound className="h-4 w-4" />
              <span>{isMobile ? "Profiles" : "Employee Profiles"}</span>
            </TabsTrigger>
            <TabsTrigger value="timecards" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{isMobile ? "Time" : "Time Cards"}</span>
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span>{isMobile ? "Onboard" : "Onboarding"}</span>
            </TabsTrigger>
            <TabsTrigger value="appreciation" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{isMobile ? "Kudos" : "Appreciation"}</span>
            </TabsTrigger>
            <TabsTrigger value="subcontractors" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{isMobile ? "Subs" : "Subcontractors"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <EmployeeDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timecards" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <TimeCardManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <OnboardingWorkflow />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appreciation" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <AppreciationHub />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subcontractors" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <SubcontractorManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
