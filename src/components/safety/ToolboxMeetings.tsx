
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToolboxMeetingData } from "@/types/safety";
import { Calendar, Clock, MapPin, User, Pencil, Plus, Users, FileCheck } from "lucide-react";
import { mockToolboxMeetings, mockToolboxMeetingTemplates } from "@/data/mockSafetyData";
import { format, isAfter, isPast, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolboxMeetingForm } from "./forms/ToolboxMeetingForm";

export function ToolboxMeetings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [meetings, setMeetings] = useState<ToolboxMeetingData[]>(mockToolboxMeetings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<ToolboxMeetingData | null>(null);
  const isMobile = useIsMobile();

  // Filter meetings by tab selection
  const getMeetingsByTab = (meetings: ToolboxMeetingData[], tab: string) => {
    const now = new Date();
    switch (tab) {
      case "upcoming":
        return meetings.filter(meeting => 
          meeting.status === "scheduled" && 
          !isPast(new Date(`${meeting.date}T${meeting.endTime}`))
        );
      case "past":
        return meetings.filter(meeting => 
          meeting.status === "completed" || 
          (meeting.status === "scheduled" && isPast(new Date(`${meeting.date}T${meeting.endTime}`)))
        );
      case "templates":
        return meetings;
      default:
        return meetings;
    }
  };

  // Further filter by search and dropdown selections
  const filteredMeetings = getMeetingsByTab(meetings, activeTab).filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      meeting.safetyFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || meeting.status === selectedStatus;
    const matchesProject = selectedProject === "all" || meeting.projectId === selectedProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleCreateMeeting = () => {
    setEditingMeeting(null);
    setShowMeetingForm(true);
  };

  const handleEditMeeting = (meeting: ToolboxMeetingData) => {
    setEditingMeeting(meeting);
    setShowMeetingForm(true);
  };

  const handleSaveMeeting = (meetingData: ToolboxMeetingData) => {
    if (editingMeeting) {
      // Update existing meeting
      setMeetings(prevMeetings => prevMeetings.map(m => m.id === meetingData.id ? meetingData : m));
    } else {
      // Add new meeting
      setMeetings(prevMeetings => [...prevMeetings, meetingData]);
    }
    setShowMeetingForm(false);
    setEditingMeeting(null);
  };

  const getStatusBadge = (meeting: ToolboxMeetingData) => {
    const meetingEndTime = new Date(`${meeting.date}T${meeting.endTime}`);
    const isPastMeeting = isPast(meetingEndTime);
    
    switch (meeting.status) {
      case "scheduled":
        return isPastMeeting ? 
          <Badge className="bg-amber-100 text-amber-800">Overdue</Badge> :
          <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{meeting.status}</Badge>;
    }
  };

  // Get unique project IDs for filtering
  const projectOptions = Array.from(
    new Set(meetings.map(meeting => meeting.projectId))
  ).map(projectId => {
    const project = meetings.find(meeting => meeting.projectId === projectId);
    return {
      id: projectId,
      name: project?.projectName || projectId
    };
  });

  if (showMeetingForm) {
    return (
      <ToolboxMeetingForm 
        meetingData={editingMeeting} 
        templates={mockToolboxMeetingTemplates}
        onSave={handleSaveMeeting} 
        onCancel={() => {
          setShowMeetingForm(false);
          setEditingMeeting(null);
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="past">Past Meetings</TabsTrigger>
          <TabsTrigger value="templates">Meeting Templates</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab === "templates" ? "templates" : "meetings"} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-1/2">
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {activeTab !== "templates" && (
                <>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filter by Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projectOptions.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <Button variant="default" onClick={handleCreateMeeting}>
                <Plus className="h-4 w-4 mr-1" /> {activeTab === "templates" ? "Create Template" : "Schedule Meeting"}
              </Button>
            </div>
          </div>

          {activeTab !== "templates" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => (
                  <Card key={meeting.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(meeting.date), "EEEE, MMM d, yyyy")}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {getStatusBadge(meeting)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {meeting.startTime} - {meeting.endTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span className="truncate">{meeting.location}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <span>Conducted by: {meeting.conductor}</span>
                        </div>
                        <div className="flex items-center">
                          <FileCheck className="h-3.5 w-3.5 mr-1" />
                          <span>Project: {meeting.projectName}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {meeting.attendees.filter(a => a.status === "present").length} / {meeting.attendees.length} attended
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-medium">Safety Focus:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {meeting.safetyFocus}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditMeeting(meeting)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" /> {meeting.status === "completed" ? "View Details" : "Edit Meeting"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    {activeTab === "upcoming" 
                      ? "No upcoming meetings match your search criteria. Schedule a new meeting?" 
                      : "No past meetings match your search criteria."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Templates tab content
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {mockToolboxMeetingTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{template.description}</p>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1">Topics:</h4>
                      <ul className="text-sm list-disc pl-5">
                        {template.topics.map((topic, index) => (
                          <li key={index} className="text-muted-foreground">{topic}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Duration: {template.suggestedDuration} minutes</span>
                      </div>
                      <div className="flex items-center">
                        <FileCheck className="h-3.5 w-3.5 mr-1" />
                        <span>Safety Focus: {template.safetyFocus}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-3.5 w-3.5 mr-1" /> Use Template
                      </Button>
                      <Button variant="ghost" size="sm" className="w-auto">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
