
import { useState } from 'react';
import { useRFIs, useCreateRFI, useUpdateRFI } from '@/hooks/useRFIs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileQuestion, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface RFIsTabProps {
  projectId: string;
}

const RFIsTab = ({ projectId }: RFIsTabProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const { data: rfis = [], isLoading, error } = useRFIs(projectId);
  const createRFI = useCreateRFI();
  const updateRFI = useUpdateRFI();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      await createRFI.mutateAsync({
        project_id: projectId,
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'open'
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setIsCreateOpen(false);
      
      toast.success('RFI created successfully');
    } catch (error) {
      console.error('Create RFI error:', error);
      toast.error('Failed to create RFI');
    }
  };

  const handleStatusChange = async (rfiId: string, newStatus: string) => {
    try {
      await updateRFI.mutateAsync({
        id: rfiId,
        updates: { status: newStatus }
      });
    } catch (error) {
      console.error('Update RFI error:', error);
      toast.error('Failed to update RFI status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">Loading RFIs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Error loading RFIs: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Request for Information (RFI)</h3>
          <p className="text-sm text-muted-foreground">
            Manage project RFIs and track their status
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create RFI
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New RFI</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter RFI title"
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
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreate} 
                  disabled={createRFI.isPending}
                  className="flex-1"
                >
                  {createRFI.isPending ? 'Creating...' : 'Create RFI'}
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

      {/* RFIs List */}
      {rfis.length > 0 ? (
        <div className="space-y-4">
          {rfis.map((rfi) => (
            <Card key={rfi.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{rfi.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(rfi.status)}>
                        {rfi.status}
                      </Badge>
                      <div className={`flex items-center gap-1 ${getPriorityColor(rfi.priority)}`}>
                        {getPriorityIcon(rfi.priority)}
                        <span className="text-sm capitalize">{rfi.priority} Priority</span>
                      </div>
                    </div>
                  </div>
                  <FileQuestion className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {rfi.description && (
                  <p className="text-sm text-muted-foreground">{rfi.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(rfi.created_at).toLocaleDateString()}
                    {rfi.updated_at !== rfi.created_at && (
                      <span className="ml-2">
                        Updated: {new Date(rfi.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <Select
                    value={rfi.status}
                    onValueChange={(value) => handleStatusChange(rfi.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No RFIs found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first RFI to start tracking project questions and clarifications
          </p>
        </div>
      )}
    </div>
  );
};

export default RFIsTab;
