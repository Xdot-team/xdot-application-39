import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { UtilityConflict } from '@/types/field';

interface UtilityConflictFormProps {
  onSubmit: (data: Omit<UtilityConflict, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'project_id'>) => void;
  onCancel: () => void;
  initialData?: Partial<UtilityConflict>;
}

export const UtilityConflictForm = ({ onSubmit, onCancel, initialData }: UtilityConflictFormProps) => {
  const [formData, setFormData] = useState({
    utility_type: initialData?.utility_type || 'water',
    location: initialData?.location || '',
    scheduled_date: initialData?.scheduled_date || '',
    contact_name: initialData?.contact_name || '',
    contact_phone: initialData?.contact_phone || '',
    contact_email: initialData?.contact_email || '',
    status: initialData?.status || 'active',
    priority: initialData?.priority || 'medium',
    description: initialData?.description || '',
    estimated_duration_hours: initialData?.estimated_duration_hours || 0,
    cost_impact: initialData?.cost_impact || 0,
    affected_areas: initialData?.affected_areas || [],
    related_work_orders: initialData?.related_work_orders || [],
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.scheduled_date ? new Date(initialData.scheduled_date) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      scheduled_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    } as any);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="utility_type">Utility Type</Label>
          <Select
            value={formData.utility_type}
            onValueChange={(value) => handleInputChange('utility_type', value)}
          >
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
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleInputChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter conflict location"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Scheduled Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => handleInputChange('contact_name', e.target.value)}
            placeholder="Enter contact name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            placeholder="Enter contact phone"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) => handleInputChange('contact_email', e.target.value)}
          placeholder="Enter contact email"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_duration_hours">Estimated Duration (hours)</Label>
          <Input
            id="estimated_duration_hours"
            type="number"
            min="0"
            step="0.5"
            value={formData.estimated_duration_hours}
            onChange={(e) => handleInputChange('estimated_duration_hours', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost_impact">Cost Impact ($)</Label>
          <Input
            id="cost_impact"
            type="number"
            min="0"
            step="0.01"
            value={formData.cost_impact}
            onChange={(e) => handleInputChange('cost_impact', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the utility conflict..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Conflict
        </Button>
      </div>
    </form>
  );
};