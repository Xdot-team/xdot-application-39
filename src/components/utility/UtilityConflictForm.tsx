import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { UtilityConflict } from '@/types/field';

interface UtilityConflictFormProps {
  onSubmit: (conflictData: Omit<UtilityConflict, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Partial<UtilityConflict>;
  defaultProjectId?: string | null;
}

const UtilityConflictForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  defaultProjectId 
}: UtilityConflictFormProps) => {
  const [formData, setFormData] = useState({
    project_id: defaultProjectId || initialData?.project_id || '',
    utility_type: initialData?.utility_type || 'water',
    location: initialData?.location || '',
    description: initialData?.description || '',
    contact_name: initialData?.contact_name || '',
    contact_phone: initialData?.contact_phone || '',
    contact_email: initialData?.contact_email || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'active',
    cost_impact: initialData?.cost_impact || 0,
    estimated_duration_hours: initialData?.estimated_duration_hours || 8,
    resolution_notes: initialData?.resolution_notes || '',
    resolved_by: initialData?.resolved_by || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const conflictData = {
      ...formData,
      cost_impact: Number(formData.cost_impact),
      estimated_duration_hours: Number(formData.estimated_duration_hours),
      scheduled_date: new Date().toISOString().split('T')[0],
      created_by: 'Current User' // This should come from auth context
    };

    onSubmit(conflictData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Conflict location"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name *</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => handleInputChange('contact_name', e.target.value)}
            placeholder="Utility company contact"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
            placeholder="Email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost_impact">Cost Impact ($)</Label>
          <Input
            id="cost_impact"
            type="number"
            value={formData.cost_impact}
            onChange={(e) => handleInputChange('cost_impact', e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_duration_hours">Expected Duration (hours)</Label>
          <Input
            id="estimated_duration_hours"
            type="number"
            value={formData.estimated_duration_hours}
            onChange={(e) => handleInputChange('estimated_duration_hours', e.target.value)}
            placeholder="8"
            min="1"
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

      <div className="flex gap-4 justify-end">
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

// Export as default
export default UtilityConflictForm;