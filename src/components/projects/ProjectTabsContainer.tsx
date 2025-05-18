
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Import full-featured tab components instead of simplified versions
import ProjectOverviewTab from "./project-tabs/ProjectOverviewTab";
import ProjectNotesTab from "./notes/ProjectNotesTab";
import ScopeWipTab from "./scope-wip/ScopeWipTab";
import ProgressScheduleTab from "./progress-schedule/ProgressScheduleTab";
import CostCompletionTab from "./cost-completion/CostCompletionTab";
import UtilityMeetingsTab from "./utility-meetings/UtilityMeetingsTab";
import NotificationsTab from "./notifications/NotificationsTab";
import AIABillingTab from "./aia-billing/AIABillingTab";
import ChangeOrdersTab from "./change-orders/ChangeOrdersTab";
import SubmittalsTab from "./project-tabs/SubmittalsTab";
import RFIsTab from "./project-tabs/RFIsTab";
import ScheduleTab from "./project-tabs/ScheduleTab";
import DocumentsTab from "./project-tabs/DocumentsTab";
import RecentUpdatesTab from "./project-tabs/RecentUpdatesTab";

interface ProjectTabsContainerProps {
  projectId: string;
}

const ProjectTabsContainer = ({ projectId }: ProjectTabsContainerProps) => {
  const [activeProjectTab, setActiveProjectTab] = useState("overview");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const notificationCount = 4; // Mock value for unread notifications

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1"></div> {/* Empty div for spacing */}
        <Button variant="outline" onClick={() => navigate(`/projects/${projectId}`)}>
          View All Details
        </Button>
      </div>

      <Tabs 
        defaultValue="overview" 
        value={activeProjectTab} 
        onValueChange={setActiveProjectTab} 
        className="w-full"
      >
        <TabsList className={`${isMobile ? 'flex w-full overflow-x-auto' : ''}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="scopeWip">Scope WIP</TabsTrigger>
          <TabsTrigger value="progressSchedule">Progress Schedule</TabsTrigger>
          <TabsTrigger value="costCompletion">Cost to Completion</TabsTrigger>
          <TabsTrigger value="utilityMeetings">Utility Meetings</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {notificationCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="aiaBilling">AIA Billing</TabsTrigger>
          <TabsTrigger value="changeOrders">Change Orders</TabsTrigger>
          <TabsTrigger value="submittals">Submittals</TabsTrigger>
          <TabsTrigger value="rfis">RFIs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="recentUpdates">Recent Updates</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview">
            <ProjectOverviewTab />
          </TabsContent>
          
          <TabsContent value="notes">
            <ProjectNotesTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="scopeWip">
            <ScopeWipTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="progressSchedule">
            <ProgressScheduleTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="costCompletion">
            <CostCompletionTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="utilityMeetings">
            <UtilityMeetingsTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="aiaBilling">
            <AIABillingTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="changeOrders">
            <ChangeOrdersTab projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="submittals">
            <SubmittalsTab />
          </TabsContent>
          
          <TabsContent value="rfis">
            <RFIsTab />
          </TabsContent>
          
          <TabsContent value="schedule">
            <ScheduleTab />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
          
          <TabsContent value="recentUpdates">
            <RecentUpdatesTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectTabsContainer;
