
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateProject } from '@/hooks/useProjects';

interface ProjectCreateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectCreateForm = ({ isOpen, onClose }: ProjectCreateFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    project_id: '',
    description: '',
    status: 'upcoming' as 'active' | 'completed' | 'upcoming',
    location: '',
    contract_value: '',
    start_date: '',
    end_date: '',
    client_name: '',
    project_manager: ''
  });

  const createProjectMutation = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      contract_value: formData.contract_value ? parseFloat(formData.contract_value) : 0,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      completed_tasks: 0,
      total_tasks: 0,
      rfi_count: 0,
      delay_days: 0
    };

    createProjectMutation.mutate(projectData, {
      onSuccess: () => {
        onClose();
        setFormData({
          name: '',
          project_id: '',
          description: '',
          status: 'upcoming',
          location: '',
          contract_value: '',
          start_date: '',
          end_date: '',
          client_name: '',
          project_manager: ''
        });
      }
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new construction project to your portfolio
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="project_id">Project ID *</Label>
              <Input
                id="project_id"
                value={formData.project_id}
                onChange={(e) => handleChange('project_id', e.target.value)}
                placeholder="e.g., HWY-101-2024"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleChange('client_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="project_manager">Project Manager</Label>
              <Input
                id="project_manager"
                value={formData.project_manager}
                onChange={(e) => handleChange('project_manager', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contract_value">Contract Value</Label>
            <Input
              id="contract_value"
              type="number"
              value={formData.contract_value}
              onChange={(e) => handleChange('contract_value', e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProjectMutation.isPending}>
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreateForm;
