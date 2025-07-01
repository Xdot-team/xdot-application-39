
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Calendar, User } from 'lucide-react';
import { useScopeWipItems, useUpdateScopeWipProgress } from '@/hooks/useScopeWip';
import { useAuth } from '@/contexts/AuthContext';

interface ScopeWipListProps {
  projectId: string;
}

const ScopeWipList = ({ projectId }: ScopeWipListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'completed' | 'on_hold'>('not_started');

  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  
  const { data: scopeItems = [], isLoading, error } = useScopeWipItems(projectId);
  const updateProgress = useUpdateScopeWipProgress();

  const filteredItems = searchTerm 
    ? scopeItems.filter(item => 
        item.scope_description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : scopeItems;

  const handleUpdateClick = (item: any) => {
    setSelectedItem(item);
    setProgress(item.progress_percentage);
    setStatus(item.status);
    setIsUpdateOpen(true);
  };

  const handleUpdateProgress = async () => {
    if (!selectedItem) return;
    
    try {
      await updateProgress.mutateAsync({
        id: selectedItem.id,
        progress,
        status
      });
      
      setIsUpdateOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Update progress error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'on_hold':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'on_hold':
        return 'On Hold';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading scope WIP...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-12">Error loading scope WIP: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scope items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scope WIP Items */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base line-clamp-2">{item.scope_description}</CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{item.progress_percentage}%</span>
                  </div>
                  <Progress value={item.progress_percentage} className="h-2" />
                </div>

                {item.estimated_end_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due: {new Date(item.estimated_end_date).toLocaleDateString()}
                  </div>
                )}

                {item.assigned_to && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {item.assigned_to}
                  </div>
                )}

                {item.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.notes}</p>
                )}

                {canEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateClick(item)}
                    className="w-full"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Update Progress
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">No scope items found</h3>
            <p>
              {searchTerm ? "Try adjusting your search term" : "Scope items will appear here when milestones are created"}
            </p>
          </div>
        </div>
      )}

      {/* Update Progress Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="progress">Progress Percentage</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                placeholder="Enter progress percentage"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleUpdateProgress} 
                disabled={updateProgress.isPending}
                className="flex-1"
              >
                {updateProgress.isPending ? 'Updating...' : 'Update Progress'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsUpdateOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScopeWipList;
