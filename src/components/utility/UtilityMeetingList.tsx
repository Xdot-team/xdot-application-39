import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, Clock } from "lucide-react";
import { UtilityMeeting } from "@/types/field";
import { useToast } from "@/hooks/use-toast";
import { useUtilityMeetings } from "@/hooks/useUtilityMeetings";
import { format } from "date-fns";

interface UtilityMeetingListProps {
  projectId?: string;
  isPast: boolean;
}

const UtilityMeetingList = ({ projectId, isPast }: UtilityMeetingListProps) => {
  const { toast } = useToast();
  const { meetings: allMeetings, loading } = useUtilityMeetings(projectId);
  
  // Filter meetings based on isPast
  const meetings = allMeetings.filter(meeting => {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    return isPast ? meetingDate < now : meetingDate >= now;
  });

  const handleViewMeeting = (meetingId: string) => {
    toast({
      title: "View Meeting",
      description: `Viewing details for meeting ${meetingId}`,
    });
  };

  const handleEditMeeting = (meetingId: string) => {
    toast({
      title: "Edit Meeting",
      description: `Editing meeting ${meetingId}`,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Loading meetings...</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No {isPast ? "past" : "upcoming"} meetings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map(meeting => (
        <Card key={meeting.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{meeting.title}</h3>
                    <Badge className={
                      meeting.utility_type === 'water' ? 'bg-blue-500' :
                      meeting.utility_type === 'gas' ? 'bg-yellow-500' :
                      meeting.utility_type === 'electric' ? 'bg-amber-500' :
                      meeting.utility_type === 'telecom' ? 'bg-purple-500' :
                      meeting.utility_type === 'sewer' ? 'bg-green-500' : 'bg-gray-500'
                    }>
                      {meeting.utility_type.charAt(0).toUpperCase() + meeting.utility_type.slice(1)}
                    </Badge>
                    <Badge className={
                      meeting.status === 'scheduled' ? 'bg-blue-500' :
                      meeting.status === 'in_progress' ? 'bg-amber-500' :
                      meeting.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(meeting.date), 'MMM dd, yyyy')} at {meeting.start_time || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.location}</span>
                    </div>
                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{meeting.attendees[0]?.company || 'Attendees: ' + meeting.attendees.length}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{isPast ? "Completed" : "Upcoming"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-auto">
                  <Button size="sm" variant="outline" onClick={() => handleViewMeeting(meeting.id)}>
                    View
                  </Button>
                  <Button size="sm" onClick={() => handleEditMeeting(meeting.id)}>
                    {isPast ? "Minutes" : "Edit"}
                  </Button>
                </div>
              </div>
              
              {meeting.agenda && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Agenda</h4>
                  <p className="text-sm text-muted-foreground">{meeting.agenda}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UtilityMeetingList;