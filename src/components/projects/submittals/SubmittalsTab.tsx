
import { useState } from 'react';
import { useSubmittals, useCreateSubmittal, useUpdateSubmittal } from '@/hooks/useSubmittals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileCheck, Calendar, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface SubmittalsTabProps {
  projectId: string;
}

const SubmittalsTab = ({ projectId }: SubmittalsTabProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { data: submittals = [], isLoading, error } = useSubmittals(projectId);
  const createSubmittal = useCreateSubmittal();
  const updateSubmittal = useUpdateSubmittal();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      await createSubmittal.mutateAsync({
        project_id: projectId,
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate || null,
        status: 'pending'
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsCreateOpen(false);
      
      toast.success('Submittal created successfully');
    } catch (error) {
      console.error('Create submittal error:', error);
      toast.error('Failed to create submittal');
    }
  };

  const handleStatusChange = async (submittalId: string, newStatus: string) => {
    try {
      await updateSubmittal.mutateAsync({
        id: submittalId,
        updates: { status: newStatus }
      });
    } catch (error) {
      console.error('Update submittal error:', error);
      toast.error('Failed to update submittal status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'submitted':
        return 'bg-blue-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">Loading submittals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Error loading submittals: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Submittals</h3>
          <p className="text-sm text-muted-foreground">
            Track project submittals and their approval status
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Submittal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Submittal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter submittal title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed description"
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreate} 
                  disabled={createSubmittal.isPending}
                  className="flex-1"
                >
                  {createSubmittal.isPending ? 'Creating...' : 'Create Submittal'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Submittals List */}
      {submittals.length > 0 ? (
        <div className="space-y-4">
          {submittals.map((submittal) => (
            <Card key={submittal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{submittal.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(submittal.status)}>
                        {submittal.status}
                      </Badge>
                      {submittal.due_date && (
                        <div className={`flex items-center gap-1 text-sm ${
                          isOverdue(submittal.due_date) ? 'text-red-600' : 'text-muted-foreground'
                        }`}>
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(submittal.due_date).toLocaleDateString()}
                          {isOverdue(submittal.due_date) && (
                            <span className="text-red-600 font-medium ml-1">(Overdue)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {submittal.description && (
                  <p className="text-sm text-muted-foreground">{submittal.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(submittal.created_at).toLocaleDateString()}
                    {submittal.updated_at !== submittal.created_at && (
                      <span className="ml-2">
                        Updated: {new Date(submittal.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <Select
                    value={submittal.status}
                    onValueChange={(value) => handleStatusChange(submittal.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No submittals found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first submittal to start tracking project submissions
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmittalsTab;
