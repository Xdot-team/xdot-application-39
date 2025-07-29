import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UtilityMeeting } from '@/types/field';

interface UtilityMeetingFormProps {
  onSubmit: (meetingData: Omit<UtilityMeeting, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Partial<UtilityMeeting>;
  defaultProjectId?: string | null;
}

const UtilityMeetingForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  defaultProjectId 
}: UtilityMeetingFormProps) => {
  const [formData, setFormData] = useState({
    project_id: defaultProjectId || initialData?.project_id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    utility_type: initialData?.utility_type || 'water',
    meeting_type: initialData?.meeting_type || 'coordination',
    date: initialData?.date || '',
    start_time: initialData?.start_time || '',
    end_time: initialData?.end_time || '',
    location: initialData?.location || '',
    is_virtual: initialData?.is_virtual || false,
    meeting_link: initialData?.meeting_link || '',
    organizer_name: initialData?.organizer_name || '',
    organizer_email: initialData?.organizer_email || '',
    status: initialData?.status || 'scheduled',
    follow_up_required: initialData?.follow_up_required || false,
    follow_up_date: initialData?.follow_up_date || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meetingData = {
      ...formData,
      created_by: 'Current User' // This should come from auth context
    };

    onSubmit(meetingData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Meeting title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utility_type">Utility Type *</Label>
          <Select value={formData.utility_type} onValueChange={(value) => handleInputChange('utility_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select utility type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="telecom">Telecom</SelectItem>
              <SelectItem value="sewer">Sewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meeting_type">Meeting Type *</Label>
          <Select value={formData.meeting_type} onValueChange={(value) => handleInputChange('meeting_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select meeting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coordination">Coordination</SelectItem>
              <SelectItem value="site_visit">Site Visit</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time *</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => handleInputChange('start_time', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => handleInputChange('end_time', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer_name">Organizer Name *</Label>
          <Input
            id="organizer_name"
            value={formData.organizer_name}
            onChange={(e) => handleInputChange('organizer_name', e.target.value)}
            placeholder="Meeting organizer"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer_email">Organizer Email</Label>
          <Input
            id="organizer_email"
            type="email"
            value={formData.organizer_email}
            onChange={(e) => handleInputChange('organizer_email', e.target.value)}
            placeholder="Email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="postponed">Postponed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_virtual"
            checked={formData.is_virtual}
            onCheckedChange={(checked) => handleInputChange('is_virtual', checked)}
          />
          <Label htmlFor="is_virtual">Virtual Meeting</Label>
        </div>

        {formData.is_virtual && (
          <div className="space-y-2">
            <Label htmlFor="meeting_link">Meeting Link</Label>
            <Input
              id="meeting_link"
              value={formData.meeting_link}
              onChange={(e) => handleInputChange('meeting_link', e.target.value)}
              placeholder="Virtual meeting URL"
            />
          </div>
        )}

        {!formData.is_virtual && (
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Meeting location"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="follow_up_required"
            checked={formData.follow_up_required}
            onCheckedChange={(checked) => handleInputChange('follow_up_required', checked)}
          />
          <Label htmlFor="follow_up_required">Follow-up Required</Label>
        </div>

        {formData.follow_up_required && (
          <div className="space-y-2">
            <Label htmlFor="follow_up_date">Follow-up Date</Label>
            <Input
              id="follow_up_date"
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Meeting description or agenda..."
          rows={3}
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Meeting
        </Button>
      </div>
    </form>
  );
};

export default UtilityMeetingForm;