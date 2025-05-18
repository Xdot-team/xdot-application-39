
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { EmployeeDashboard } from "@/components/workforce/EmployeeDashboard";
import { TimeCardManagement } from "@/components/workforce/TimeCardManagement";
import { OnboardingWorkflow } from "@/components/workforce/OnboardingWorkflow";
import { AppreciationHub } from "@/components/workforce/AppreciationHub";
import { WorkforceDashboard } from "@/components/workforce/WorkforceDashboard";
import { EmployeeHealth } from "@/components/workforce/EmployeeHealth";
import { UserRound, Clock, Award, FileCheck, BarChart, Heart } from "lucide-react";

export default function Workforce() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Workforce Management"
        subheading="Manage employees, time cards, onboarding, and recognition"
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
              <span>{isMobile ? "Metrics" : "Workforce Dashboard"}</span>
            </TabsTrigger>
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
            <TabsTrigger value="health" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{isMobile ? "Health" : "Employee Health"}</span>
            </TabsTrigger>
            <TabsTrigger value="appreciation" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{isMobile ? "Kudos" : "Appreciation"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <WorkforceDashboard />
              </CardContent>
            </Card>
          </TabsContent>

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

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <EmployeeHealth />
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
        </Tabs>
      </div>
    </div>
  );
}
