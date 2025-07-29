import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, Users, Clock, FileText, Plus, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import UtilityMeetingList from "./UtilityMeetingList";
import { useToast } from "@/hooks/use-toast";
import UtilityMeetingForm from "./UtilityMeetingForm";
import { useUtilityMeetings } from "@/hooks/useUtilityMeetings";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

interface UtilityMeetingsTabProps {
  projectId?: string;
  showProjectNavigation?: boolean;
}

const UtilityMeetingsTab = ({ projectId, showProjectNavigation = false }: UtilityMeetingsTabProps) => {
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { meetings, createMeeting, loading } = useUtilityMeetings(projectId);
  const { data: projects } = useProjects();

  const getProjectName = (projectId: string) => {
    const project = projects?.find(p => p.id === projectId);
    return project?.name || `Project ${projectId}`;
  };

  const upcomingMeetings = meetings.filter(meeting => {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    return meetingDate >= now;
  });

  const pastMeetings = meetings.filter(meeting => {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    return meetingDate < now;
  });

  const completedMeetings = pastMeetings.filter(m => m.status === 'completed');
  const totalAttendees = meetings.reduce((sum, m) => sum + (m.attendees?.length || 0), 0);

  const handleNewMeeting = () => {
    setShowNewMeetingDialog(true);
  };

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await createMeeting({
        ...meetingData,
        project_id: projectId || null,
      });
      setShowNewMeetingDialog(false);
      toast({
        title: "Success",
        description: "Utility meeting created successfully.",
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigateToProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {projectId ? `Utility Meetings - ${getProjectName(projectId)}` : 'All Utility Meetings'}
          </h2>
          <p className="text-muted-foreground">
            {projectId 
              ? "Schedule and manage utility coordination meetings for this project"
              : "Schedule and manage utility coordination meetings across all projects"
            }
          </p>
        </div>
        <div className="flex gap-2">
          {!projectId && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/utility')}
              className="md:w-auto w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Utility Module
            </Button>
          )}
          <Button onClick={handleNewMeeting} className="md:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> New Meeting
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meetings Overview</CardTitle>
          <CardDescription>
            {projectId 
              ? "Utility coordination meetings for this project"
              : "All utility coordination meetings across projects"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "upcoming" | "past")}
            className="w-full"
          >
            <TabsList className={isMobile ? "w-full" : ""}>
              <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastMeetings.length})</TabsTrigger>
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
                  <p className="font-medium">{upcomingMeetings.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="font-medium">{totalAttendees}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="font-medium">
                    {pastMeetings.length > 0 ? Math.round((completedMeetings.length / pastMeetings.length) * 100) : 0}%
                  </p>
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
              {meetings.slice(0, 3).map((meeting, index) => (
                <div key={meeting.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Follow up: {meeting.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {showProjectNavigation && meeting.project_id && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => handleNavigateToProject(meeting.project_id!)}
                        >
                          {getProjectName(meeting.project_id)}
                        </Button>
                      )}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {meeting.status === 'completed' ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
              ))}
              {meetings.length === 0 && (
                <p className="text-sm text-muted-foreground">No action items yet</p>
              )}
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
                  <p className="text-sm font-medium">Utility Coordination Plan</p>
                  <p className="text-xs text-muted-foreground">Updated 3 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Meeting Minutes Template</p>
                  <p className="text-xs text-muted-foreground">Standard template</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Utility Contact Directory</p>
                  <p className="text-xs text-muted-foreground">Updated weekly</p>
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