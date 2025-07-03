
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, FileText, Clipboard, CheckCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useKickoffMeetings, KickoffMeeting } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const KickoffMeetings = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { meetings, loading, createMeeting } = useKickoffMeetings();

  const upcomingMeetings = meetings.filter(
    meeting => meeting.status === 'scheduled' || meeting.status === 'postponed'
  );
  
  const pastMeetings = meetings.filter(
    meeting => meeting.status === 'completed' || meeting.status === 'cancelled'
  );

  const handleNewMeeting = () => {
    toast({
      title: 'Create Meeting',
      description: 'Meeting creation form will be shown here',
    });
  };

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'postponed':
        return <Badge className="bg-yellow-500">Postponed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const renderMeetingCard = (meeting: KickoffMeeting) => {
    const meetingDate = new Date(meeting.date);
    return (
      <Card key={meeting.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">{meeting.title}</CardTitle>
              <CardDescription>
                Project: {meeting.project_name}
              </CardDescription>
            </div>
            <div className="mt-2 md:mt-0">
              {getMeetingStatusBadge(meeting.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{format(meetingDate, 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{meeting.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Attendees</p>
                <p className="font-medium">{meeting.attendees?.length || 0} participants</p>
              </div>
            </div>
          </div>

          {meeting.status === 'completed' && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-1">Key Action Items:</p>
              <div className="space-y-2">
                {(meeting.action_items || []).slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`h-4 w-4 ${item.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`} />
                      <span>{item.description}</span>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
                {(meeting.action_items || []).length > 2 && (
                  <p className="text-sm text-muted-foreground">+{(meeting.action_items || []).length - 2} more action items</p>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" className="text-blue-600">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pre-construction Meetings</h2>
          <p className="text-muted-foreground">
            Schedule and manage project kickoff and pre-construction meetings
          </p>
        </div>
        <Button onClick={handleNewMeeting} className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> New Meeting
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Kickoff Meetings</CardTitle>
          <CardDescription>Project pre-construction and kickoff meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')}
            className="w-full"
          >
            <TabsList className={isMobile ? "w-full" : ""}>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="pt-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading meetings...</div>
              ) : upcomingMeetings.length > 0 ? (
                upcomingMeetings.map(renderMeetingCard)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming meetings scheduled
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="pt-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading meetings...</div>
              ) : pastMeetings.length > 0 ? (
                pastMeetings.map(renderMeetingCard)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No past meetings found
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Meeting Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                  <p className="font-medium">{upcomingMeetings.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed Meetings</p>
                  <p className="font-medium">{meetings.filter(m => m.status === 'completed').length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clipboard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Action Items</p>
                  <p className="font-medium">{meetings.reduce((acc, meeting) => acc + (meeting.action_items?.length || 0), 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Documents</p>
                  <p className="font-medium">{meetings.reduce((acc, meeting) => acc + (meeting.documents?.length || 0), 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-4">
                {meetings
                  .flatMap(meeting => 
                    (meeting.action_items || []).map(item => ({
                      ...item,
                      projectName: meeting.project_name,
                      meetingTitle: meeting.title
                    }))
                  )
                  .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())
                  .slice(0, 7)
                  .map((item, index) => (
                    <div key={item.id}>
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">{item.description}</span>
                          <Badge variant={item.status === 'completed' ? 'secondary' : 'outline'} className="ml-2">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Assigned to: {item.assigned_to}</span>
                          <span>Due: {format(new Date(item.due_date), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.projectName}: {item.meetingTitle}
                        </p>
                      </div>
                      {index < 6 && <Separator className="my-2" />}
                    </div>
                  ))
                }
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KickoffMeetings;
