
import { useState } from "react";
import { mockMeetings } from "@/data/mockScheduleData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Plus, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function MeetingList() {
  const [meetings] = useState(mockMeetings);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {meeting.description}
                  </CardDescription>
                </div>
                <Badge variant={meeting.virtual ? "outline" : "default"}>
                  {meeting.virtual ? "Virtual" : "In-Person"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {format(new Date(meeting.date), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {meeting.startTime} - {meeting.endTime}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {meeting.attendees.length} attendees
                    {meeting.attendees.some((a) => !a.confirmed) &&
                      " (some pending)"}
                  </span>
                </div>

                {meeting.agenda && meeting.agenda.length > 0 && (
                  <div className="flex items-start text-sm">
                    <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium mb-1">Agenda</div>
                      <ul className="list-disc list-inside text-xs pl-1 space-y-0.5">
                        {meeting.agenda.slice(0, 2).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                        {meeting.agenda.length > 2 && (
                          <li>+ {meeting.agenda.length - 2} more items</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-4 pt-2 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {meeting.organizer && (
                    <div className="text-xs text-muted-foreground pt-1">
                      Organized by: {meeting.organizer}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
