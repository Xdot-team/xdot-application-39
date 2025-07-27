
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, Users, Clock, FileText, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import UtilityMeetingList from "./UtilityMeetingList";
import { useToast } from "@/hooks/use-toast";
import UtilityMeetingForm from "../../utility/UtilityMeetingForm";
import { useUtilityMeetings } from "@/hooks/useUtilityMeetings";

interface UtilityMeetingsTabProps {
  projectId: string;
}

const UtilityMeetingsTab = ({ projectId }: UtilityMeetingsTabProps) => {
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { meetings, createMeeting, loading } = useUtilityMeetings(projectId);

  const handleNewMeeting = () => {
    setShowNewMeetingDialog(true);
  };

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await createMeeting(meetingData);
      setShowNewMeetingDialog(false);
      toast({
        title: "Success",
        description: "Utility meeting created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Utility Meetings</h2>
          <p className="text-muted-foreground">
            Schedule and manage utility coordination meetings
          </p>
        </div>
        <Button onClick={handleNewMeeting} className="md:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> New Meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meetings Overview</CardTitle>
          <CardDescription>
            Utility coordination meetings for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "upcoming" | "past")}
            className="w-full"
          >
            <TabsList className={isMobile ? "w-full" : ""}>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="pt-4">
              <UtilityMeetingList projectId={projectId} isPast={false} />
            </TabsContent>
            <TabsContent value="past" className="pt-4">
              <UtilityMeetingList projectId={projectId} isPast={true} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meeting Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                  <p className="font-medium">3</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="font-medium">12</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <p className="font-medium">45 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Contact Georgia Power</p>
                  <p className="text-xs text-muted-foreground">Due in 3 days</p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Submit utility map revisions</p>
                  <p className="text-xs text-muted-foreground">Due tomorrow</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Review telecom conflict resolution</p>
                  <p className="text-xs text-muted-foreground">Due in 5 days</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Utility Conflict Matrix</p>
                  <p className="text-xs text-muted-foreground">Updated 3 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Utility Contact List</p>
                  <p className="text-xs text-muted-foreground">Updated 1 week ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Meeting Minutes Template</p>
                  <p className="text-xs text-muted-foreground">Updated 2 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showNewMeetingDialog} onOpenChange={setShowNewMeetingDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Utility Meeting</DialogTitle>
          </DialogHeader>
          <UtilityMeetingForm
            onSubmit={handleCreateMeeting}
            onCancel={() => setShowNewMeetingDialog(false)}
            initialData={{ project_id: projectId }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UtilityMeetingsTab;
