
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ToolboxMeetingData, ToolboxMeetingTemplate, MeetingAttendee } from "@/types/safety";
import { 
  ArrowLeft, 
  Clock, 
  Plus, 
  Trash, 
  Calendar, 
  Users, 
  FileCheck, 
  CheckCircle, 
  AlertTriangle,
  Search,
  User,
  UserPlus,
  CheckSquare,
  XSquare
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ToolboxMeetingFormProps {
  meetingData: ToolboxMeetingData | null;
  templates: ToolboxMeetingTemplate[];
  onSave: (meetingData: ToolboxMeetingData) => void;
  onCancel: () => void;
}

export function ToolboxMeetingForm({ meetingData, templates, onSave, onCancel }: ToolboxMeetingFormProps) {
  // Sample Project IDs for demo
  const sampleProjects = [
    { id: "P-1001", name: "I-85 Bridge Repair" },
    { id: "P-1002", name: "GA-400 Repaving" },
    { id: "P-1003", name: "I-75 Resurfacing" },
    { id: "P-1004", name: "I-285 Bridge Project" },
    { id: "P-1005", name: "Main Yard Expansion" }
  ];

  // Sample Employees for demo
  const sampleEmployees = [
    { id: "EMP-1234", name: "Mark Johnson", role: "Equipment Operator" },
    { id: "EMP-2345", name: "Sarah Williams", role: "Laborer" },
    { id: "EMP-3456", name: "Robert Davis", role: "Supervisor" },
    { id: "EMP-4567", name: "Jennifer Lopez", role: "Safety Officer" },
    { id: "EMP-5678", name: "Michael Brown", role: "Equipment Operator" },
    { id: "EMP-6789", name: "David Wilson", role: "Equipment Operator" },
    { id: "EMP-7890", name: "Thomas Wright", role: "Foreman" },
    { id: "EMP-8901", name: "Lisa Martinez", role: "Traffic Control" },
    { id: "EMP-9012", name: "Kevin Taylor", role: "Laborer" },
    { id: "EMP-0123", name: "Christopher Moore", role: "Equipment Operator" }
  ];

  const [activeTab, setActiveTab] = useState("basics");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ToolboxMeetingTemplate | null>(null);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  const today = new Date().toISOString().split('T')[0];
  const defaultTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  const [formData, setFormData] = useState<ToolboxMeetingData>({
    id: meetingData?.id || `tbm-${Date.now()}`,
    title: meetingData?.title || "",
    projectId: meetingData?.projectId || "",
    projectName: meetingData?.projectName || "",
    location: meetingData?.location || "",
    date: meetingData?.date || today,
    startTime: meetingData?.startTime || defaultTime,
    endTime: meetingData?.endTime || "",
    conductor: meetingData?.conductor || "Current User", // In a real app, this would be the logged-in user
    topics: meetingData?.topics || [],
    safetyFocus: meetingData?.safetyFocus || "",
    status: meetingData?.status || "scheduled",
    attendees: meetingData?.attendees || [],
    notes: meetingData?.notes || "",
    attachments: meetingData?.attachments || [],
    createdBy: meetingData?.createdBy || "Current User", // In a real app, this would be the logged-in user
    createdDate: meetingData?.createdDate || today,
    lastUpdated: today,
    weatherConditions: meetingData?.weatherConditions || "",
    questionsAsked: meetingData?.questionsAsked || [],
    followUpActions: meetingData?.followUpActions || []
  });

  const [newTopic, setNewTopic] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newFollowUpAction, setNewFollowUpAction] = useState({
    description: "",
    assignedTo: "",
    dueDate: ""
  });

  // Generic text field change handler
  const handleTextChange = (field: keyof ToolboxMeetingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle project selection 
  const handleProjectChange = (projectId: string) => {
    const selectedProject = sampleProjects.find(p => p.id === projectId);
    setFormData(prev => ({ 
      ...prev, 
      projectId, 
      projectName: selectedProject?.name || ""
    }));
  };

  // Calculate meeting duration
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return "";
    
    try {
      const [startHour, startMinute] = formData.startTime.split(":").map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);
      
      let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight meetings
      
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      return hours > 0 
        ? `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min${minutes !== 1 ? 's' : ''}` : ''}`
        : `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } catch (e) {
      return "";
    }
  };

  // Topics handling
  const addTopic = () => {
    if (newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  // Questions handling
  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData(prev => ({
        ...prev,
        questionsAsked: [...(prev.questionsAsked || []), newQuestion.trim()]
      }));
      setNewQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questionsAsked: (prev.questionsAsked || []).filter((_, i) => i !== index)
    }));
  };

  // Follow-up actions handling
  const addFollowUpAction = () => {
    if (
      newFollowUpAction.description.trim() && 
      newFollowUpAction.assignedTo && 
      newFollowUpAction.dueDate
    ) {
      setFormData(prev => ({
        ...prev,
        followUpActions: [
          ...(prev.followUpActions || []), 
          {
            id: `follow-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            description: newFollowUpAction.description.trim(),
            assignedTo: newFollowUpAction.assignedTo,
            dueDate: newFollowUpAction.dueDate,
            status: 'pending' as const
          }
        ]
      }));
      setNewFollowUpAction({
        description: "",
        assignedTo: "",
        dueDate: ""
      });
    }
  };

  const removeFollowUpAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      followUpActions: (prev.followUpActions || []).filter((_, i) => i !== index)
    }));
  };

  // Attendees handling
  const isEmployeeAdded = (employeeId: string) => {
    return formData.attendees.some(attendee => attendee.employeeId === employeeId);
  };

  const addAttendee = (employee: typeof sampleEmployees[0]) => {
    if (isEmployeeAdded(employee.id)) {
      removeAttendee(employee.id);
      return;
    }

    setFormData(prev => ({
      ...prev,
      attendees: [
        ...prev.attendees,
        {
          id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          meetingId: prev.id,
          employeeId: employee.id,
          employeeName: employee.name,
          role: employee.role,
          status: 'pending' as const
        }
      ]
    }));
  };

  const removeAttendee = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a.employeeId !== employeeId)
    }));
  };

  const updateAttendeeStatus = (employeeId: string, status: 'present' | 'absent' | 'excused' | 'pending') => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.map(a => 
        a.employeeId === employeeId ? { ...a, status } : a
      )
    }));
  };

  // Filter employees for dialog
  const filteredEmployees = sampleEmployees.filter(employee => 
    employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the meeting");
      return;
    }
    
    if (!formData.projectId) {
      toast.error("Please select a project");
      return;
    }
    
    if (!formData.date) {
      toast.error("Please select a meeting date");
      return;
    }

    if (!formData.startTime) {
      toast.error("Please select a start time");
      return;
    }

    if (!formData.endTime) {
      toast.error("Please select an end time");
      return;
    }

    if (!formData.conductor.trim()) {
      toast.error("Please enter a meeting conductor");
      return;
    }

    if (formData.topics.length === 0) {
      toast.error("Please add at least one topic");
      return;
    }

    if (!formData.safetyFocus.trim()) {
      toast.error("Please enter a safety focus");
      return;
    }
    
    // Save the meeting data
    onSave(formData);
    toast.success("Meeting saved successfully");
  };

  const applyTemplate = (template: ToolboxMeetingTemplate) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      topics: [...template.topics],
      safetyFocus: template.safetyFocus
    }));
    setTemplateDialogOpen(false);
    toast.success("Template applied successfully");
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onCancel} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold">{meetingData ? "Edit" : "Schedule"} Toolbox Meeting</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="basics" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="attendees" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Attendees</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <FileCheck className="h-4 w-4" />
            <span>Notes & Follow-ups</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
              <CardDescription>Enter the basic details for this toolbox meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTextChange("title", e.target.value)}
                      placeholder="Enter meeting title"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setTemplateDialogOpen(true)}
                    >
                      <FileCheck className="h-4 w-4 mr-1" /> Template
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select 
                    value={formData.projectId} 
                    onValueChange={handleProjectChange}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Meeting Date *</Label>
                  <Input 
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleTextChange("date", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleTextChange("location", e.target.value)}
                    placeholder="Enter meeting location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input 
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleTextChange("startTime", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input 
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleTextChange("endTime", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {calculateDuration() || "Set start and end times"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conductor">Conducted By *</Label>
                <Input 
                  id="conductor"
                  value={formData.conductor}
                  onChange={(e) => handleTextChange("conductor", e.target.value)}
                  placeholder="Enter name of the person conducting the meeting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safetyFocus">Safety Focus *</Label>
                <Textarea 
                  id="safetyFocus"
                  value={formData.safetyFocus}
                  onChange={(e) => handleTextChange("safetyFocus", e.target.value)}
                  placeholder="Enter the main safety focus for this meeting"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Meeting Topics *</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add topic"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTopic}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {topic}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTopic(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weatherConditions">Weather Conditions</Label>
                <Input 
                  id="weatherConditions"
                  value={formData.weatherConditions || ""}
                  onChange={(e) => handleTextChange("weatherConditions", e.target.value)}
                  placeholder="Enter weather conditions (optional)"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <div className="space-x-2">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("attendees")}
                  variant="default"
                >
                  Next: Attendees
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Attendees</CardTitle>
              <CardDescription>Add employees who will attend this safety meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Attendees ({formData.attendees.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEmployeeDialogOpen(true)}
                  className="flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-1" /> Add Attendees
                </Button>
              </div>

              {formData.attendees.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2 text-sm font-medium">Name</th>
                        <th className="text-left p-2 text-sm font-medium">Role</th>
                        <th className="text-left p-2 text-sm font-medium">Status</th>
                        <th className="text-right p-2 text-sm font-medium w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.attendees.map((attendee) => (
                        <tr key={attendee.id} className="border-t">
                          <td className="p-2 text-sm">{attendee.employeeName}</td>
                          <td className="p-2 text-sm text-muted-foreground">{attendee.role}</td>
                          <td className="p-2">
                            <Select 
                              value={attendee.status} 
                              onValueChange={(value: any) => updateAttendeeStatus(attendee.employeeId, value)}
                            >
                              <SelectTrigger className="h-8 w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="excused">Excused</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                              onClick={() => removeAttendee(attendee.employeeId)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">No attendees added yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmployeeDialogOpen(true)}
                    className="mt-2"
                  >
                    <UserPlus className="h-4 w-4 mr-1" /> Add Attendees
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basics")}>
                Back
              </Button>
              <Button variant="default" onClick={() => setActiveTab("notes")}>
                Next: Notes & Follow-ups
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notes & Follow-ups</CardTitle>
              <CardDescription>Add notes and action items for this safety meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea 
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleTextChange("notes", e.target.value)}
                  placeholder="Enter any notes about the meeting"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Questions Asked</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add question that was asked"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addQuestion}>Add</Button>
                </div>
                <div className="mt-2 space-y-2">
                  {(formData.questionsAsked || []).map((question, index) => (
                    <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                      <span className="text-sm flex-1">{question}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Follow-up Actions</Label>
                <div className="space-y-2 border rounded-md p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="actionDescription" className="text-xs">Description</Label>
                      <Input 
                        id="actionDescription"
                        value={newFollowUpAction.description}
                        onChange={(e) => setNewFollowUpAction({...newFollowUpAction, description: e.target.value})}
                        placeholder="Action description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actionAssignee" className="text-xs">Assigned To</Label>
                      <Select 
                        value={newFollowUpAction.assignedTo}
                        onValueChange={(value) => setNewFollowUpAction({...newFollowUpAction, assignedTo: value})}
                      >
                        <SelectTrigger id="actionAssignee">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.attendees.map((attendee) => (
                            <SelectItem key={attendee.employeeId} value={attendee.employeeName}>
                              {attendee.employeeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label htmlFor="actionDueDate" className="text-xs">Due Date</Label>
                        <Input 
                          id="actionDueDate"
                          type="date"
                          value={newFollowUpAction.dueDate}
                          onChange={(e) => setNewFollowUpAction({...newFollowUpAction, dueDate: e.target.value})}
                        />
                      </div>
                      <Button 
                        type="button" 
                        size="sm"
                        className="mb-0.5"
                        onClick={addFollowUpAction}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  {(formData.followUpActions || []).length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2 text-sm font-medium">Action</th>
                            <th className="text-left p-2 text-sm font-medium">Assigned To</th>
                            <th className="text-left p-2 text-sm font-medium">Due Date</th>
                            <th className="text-right p-2 text-sm font-medium w-20">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(formData.followUpActions || []).map((action, index) => (
                            <tr key={action.id} className="border-t">
                              <td className="p-2 text-sm">{action.description}</td>
                              <td className="p-2 text-sm">{action.assignedTo}</td>
                              <td className="p-2 text-sm">
                                {action.dueDate}
                              </td>
                              <td className="p-2 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                                  onClick={() => removeFollowUpAction(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No follow-up actions added yet.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("attendees")}>
                Back
              </Button>
              <Button variant="default" onClick={handleSubmit}>
                {meetingData ? "Update Meeting" : "Schedule Meeting"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Meeting Template</DialogTitle>
            <DialogDescription>
              Choose a template to pre-fill the meeting with common topics and materials
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto py-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="line-clamp-2">{template.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Topics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.topics.slice(0, 2).map((topic, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {template.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.topics.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Duration: {template.suggestedDuration} minutes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setTemplateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={() => selectedTemplate && applyTemplate(selectedTemplate)}
              disabled={!selectedTemplate}
            >
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Attendees</DialogTitle>
            <DialogDescription>
              Select employees to add to this meeting
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="w-8 p-2"></th>
                    <th className="text-left p-2 text-sm font-medium">Name</th>
                    <th className="text-left p-2 text-sm font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => {
                    const isAdded = isEmployeeAdded(employee.id);
                    return (
                      <tr 
                        key={employee.id} 
                        className={`border-t cursor-pointer hover:bg-muted/50 ${isAdded ? 'bg-muted/20' : ''}`}
                        onClick={() => addAttendee(employee)}
                      >
                        <td className="p-2 text-center">
                          {isAdded ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="h-4 w-4 rounded border border-input" />
                          )}
                        </td>
                        <td className="p-2 text-sm">{employee.name}</td>
                        <td className="p-2 text-sm text-muted-foreground">{employee.role}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="default" 
              onClick={() => setEmployeeDialogOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
