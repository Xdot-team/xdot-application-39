import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UtilityMeeting } from "@/types/field";

interface UtilityMeetingFormProps {
  onSubmit: (meetingData: Omit<UtilityMeeting, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Partial<UtilityMeeting>;
}

const UtilityMeetingForm: React.FC<UtilityMeetingFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    utility_type: initialData?.utility_type || 'electric',
    utility_owner_company: initialData?.utility_owner_company || '',
    utility_contact_info: initialData?.utility_contact_info || '',
    meeting_type: initialData?.meeting_type || 'coordination',
    start_time: initialData?.start_time || '',
    end_time: initialData?.end_time || '',
    location: initialData?.location || '',
    is_virtual: initialData?.is_virtual || false,
    meeting_link: initialData?.meeting_link || '',
    organizer_name: initialData?.organizer_name || '',
    organizer_email: initialData?.organizer_email || '',
    status: initialData?.status || 'scheduled',
    meeting_comments: initialData?.meeting_comments || '',
    project_id: initialData?.project_id || '',
    created_by: initialData?.created_by || 'current-user'
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Please select a meeting date');
      return;
    }

    const meetingData = {
      ...formData,
      date: format(selectedDate, 'yyyy-MM-dd'),
      agenda: [],
      attendees: [],
      action_items: [],
      documents: []
    };

    onSubmit(meetingData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 col-span-full">
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            placeholder="Enter meeting title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utility_type">Utility Type</Label>
          <Select value={formData.utility_type} onValueChange={(value) => setFormData(prev => ({ ...prev, utility_type: value as any }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select utility type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="telecom">Telecom</SelectItem>
              <SelectItem value="sewer">Sewer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="utility_owner_company">Utility Owner/Company</Label>
          <Input
            id="utility_owner_company"
            placeholder="e.g., Pacific Gas & Electric, AT&T"
            value={formData.utility_owner_company}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meeting_type">Meeting Type</Label>
          <Select value={formData.meeting_type} onValueChange={(value) => setFormData(prev => ({ ...prev, meeting_type: value as any }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select meeting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coordination">Coordination</SelectItem>
              <SelectItem value="site_visit">Site Visit</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="utility_contact_info">Contact Information</Label>
          <Input
            id="utility_contact_info"
            placeholder="Phone, email, or other contact details"
            value={formData.utility_contact_info}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Meeting Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Meeting location or 'Virtual'"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer_name">Organizer Name</Label>
          <Input
            id="organizer_name"
            placeholder="Meeting organizer"
            value={formData.organizer_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer_email">Organizer Email</Label>
          <Input
            id="organizer_email"
            type="email"
            placeholder="organizer@company.com"
            value={formData.organizer_email}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meeting_link">Meeting Link (if virtual)</Label>
          <Input
            id="meeting_link"
            placeholder="https://zoom.us/j/..."
            value={formData.meeting_link}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Meeting agenda and description..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="meeting_comments">Comments</Label>
          <Textarea
            id="meeting_comments"
            placeholder="Additional comments about the meeting..."
            value={formData.meeting_comments}
            onChange={(e) => setFormData(prev => ({ ...prev, meeting_comments: e.target.value }))}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Meeting' : 'Create Meeting'}
        </Button>
      </div>
    </form>
  );
};

export default UtilityMeetingForm;