
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

// Import full-featured tab components instead of simplified versions
import ProjectOverviewTab from "./project-tabs/ProjectOverviewTab";
import ProjectNotesTab from "./notes/ProjectNotesTab";
import ScopeWipTab from "./scope-wip/ScopeWipTab";
import ProgressScheduleTab from "./progress-schedule/ProgressScheduleTab";
import CostCompletionTab from "./cost-completion/CostCompletionTab";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const notificationCount = 4; // Mock value for unread notifications

  return (
    <div className="space-y-4">
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
          <TabsTrigger value="utility">Utility Management</TabsTrigger>
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
          
          <TabsContent value="utility">
            <div className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Utility Management</h3>
                <p className="text-muted-foreground mb-4">
                  Utility conflicts and meetings are now managed in the dedicated Utility module for better organization and cross-project visibility.
                </p>
                <Button onClick={() => navigate(`/utility?project=${projectId}`)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Utility Module
                </Button>
              </div>
            </div>
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
            <DocumentsTab projectId={projectId} />
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
