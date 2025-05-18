
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, FileText, Clock } from "lucide-react";
import { UtilityMeeting } from "@/types/projects";
import { useToast } from "@/hooks/use-toast";

// Sample mock utility meetings data
const mockUtilityMeetings: UtilityMeeting[] = [
  {
    id: "um001",
    projectId: "1",
    title: "Water Line Relocation Coordination",
    utilityType: "water",
    date: "2025-05-28",
    time: "10:00 AM",
    location: "Project Site Office",
    agenda: "1. Review water line conflict areas\n2. Discuss relocation timeline\n3. Confirm permits status",
    attendees: [
      { id: "att1", name: "John Smith", company: "Atlanta Water", email: "jsmith@atlwater.com", role: "Utility Manager" },
      { id: "att2", name: "Maria Rodriguez", company: "xDOT Contractor", email: "mrodriguez@xdot.com", role: "Project Manager" },
      { id: "att3", name: "David Chen", company: "xDOT", email: "dchen@xdot.gov", role: "Construction Engineer" }
    ],
    status: "scheduled",
    createdBy: "Maria Rodriguez",
    createdAt: "2025-05-10T14:30:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
    followUpActions: [
      {
        id: "fa1",
        description: "Submit revised water line drawings",
        assignedTo: "John Smith",
        dueDate: "2025-06-01",
        status: "pending"
      }
    ]
  },
  {
    id: "um002",
    projectId: "1",
    title: "Georgia Power Line Clearance Meeting",
    utilityType: "electric",
    date: "2025-05-30",
    time: "2:00 PM",
    location: "Virtual - Teams Meeting",
    agenda: "1. Overhead power line clearance requirements\n2. Scheduling power outage windows\n3. Safety protocol review",
    attendees: [
      { id: "att4", name: "Sarah Johnson", company: "Georgia Power", email: "sjohnson@gapower.com", role: "Safety Coordinator" },
      { id: "att5", name: "Maria Rodriguez", company: "xDOT Contractor", email: "mrodriguez@xdot.com", role: "Project Manager" },
      { id: "att6", name: "Thomas Lee", company: "xDOT Contractor", email: "tlee@xdot.com", role: "Safety Officer" }
    ],
    status: "scheduled",
    createdBy: "Maria Rodriguez",
    createdAt: "2025-05-11T09:15:00Z",
    updatedAt: "2025-05-11T09:15:00Z"
  },
  {
    id: "um003",
    projectId: "1",
    title: "Telecom Conduit Installation Planning",
    utilityType: "telecom",
    date: "2025-05-15",
    time: "9:30 AM",
    location: "xDOT District Office",
    agenda: "1. Fiber optic relocation plan\n2. Traffic control during installation\n3. Schedule coordination with roadway work",
    minutes: "Meeting discussed conduit installation timing. AT&T will provide revised schedule by 5/20. Traffic control plan approved pending final review.",
    attendees: [
      { id: "att7", name: "Robert Williams", company: "AT&T", email: "rwilliams@att.com", role: "Field Supervisor" },
      { id: "att8", name: "Maria Rodriguez", company: "xDOT Contractor", email: "mrodriguez@xdot.com", role: "Project Manager" },
      { id: "att9", name: "Lisa Taylor", company: "Traffic Control Inc", email: "ltaylor@trafficcontrol.com", role: "Traffic Engineer" }
    ],
    status: "completed",
    createdBy: "Maria Rodriguez",
    createdAt: "2025-05-01T08:45:00Z",
    updatedAt: "2025-05-15T12:30:00Z",
    followUpActions: [
      {
        id: "fa2",
        description: "Update traffic control plan based on meeting feedback",
        assignedTo: "Lisa Taylor",
        dueDate: "2025-05-20",
        status: "completed"
      },
      {
        id: "fa3",
        description: "Submit revised fiber installation schedule",
        assignedTo: "Robert Williams",
        dueDate: "2025-05-20",
        status: "in-progress"
      }
    ]
  }
];

interface UtilityMeetingListProps {
  projectId: string;
  isPast: boolean;
}

const UtilityMeetingList = ({ projectId, isPast }: UtilityMeetingListProps) => {
  const [meetings, setMeetings] = useState<UtilityMeeting[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, we would fetch meetings from an API
    // For now, we'll filter our mock data
    const today = new Date();
    const filteredMeetings = mockUtilityMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return isPast ? meetingDate < today : meetingDate >= today;
    });
    
    setMeetings(filteredMeetings);
  }, [projectId, isPast]);

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
                      meeting.utilityType === 'water' ? 'bg-blue-500' :
                      meeting.utilityType === 'gas' ? 'bg-yellow-500' :
                      meeting.utilityType === 'electric' ? 'bg-amber-500' :
                      meeting.utilityType === 'telecom' ? 'bg-purple-500' :
                      meeting.utilityType === 'sewer' ? 'bg-green-500' : 'bg-gray-500'
                    }>
                      {meeting.utilityType.charAt(0).toUpperCase() + meeting.utilityType.slice(1)}
                    </Badge>
                    <Badge className={
                      meeting.status === 'scheduled' ? 'bg-blue-500' :
                      meeting.status === 'in-progress' ? 'bg-amber-500' :
                      meeting.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.attendees.length} Attendees</span>
                    </div>
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
              
              {meeting.followUpActions && meeting.followUpActions.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Follow-up Actions</h4>
                  <div className="space-y-2">
                    {meeting.followUpActions.map(action => (
                      <div key={action.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p>{action.description}</p>
                          <p className="text-xs text-muted-foreground">Assigned to: {action.assignedTo} • Due: {new Date(action.dueDate).toLocaleDateString()}</p>
                        </div>
                        <Badge className={
                          action.status === 'pending' ? 'bg-amber-500' :
                          action.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }>
                          {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
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
