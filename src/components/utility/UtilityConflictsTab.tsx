import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Phone, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter } from 'lucide-react';
import { useUtilityConflicts } from '@/hooks/useUtilityConflicts';
import { UtilityConflictsList } from './UtilityConflictsList';
import { UtilityConflictForm } from './UtilityConflictForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface UtilityConflictsTabProps {
  projectId?: string;
}

const UtilityConflictsTab = ({ projectId }: UtilityConflictsTabProps) => {
  const { conflicts, loading, createConflict, updateConflict, deleteConflict, resolveConflict } = useUtilityConflicts(projectId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [utilityFilter, setUtilityFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter conflicts based on search and filters
  const filteredConflicts = conflicts.filter(conflict => {
    const matchesSearch = conflict.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conflict.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conflict.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conflict.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conflict.priority === priorityFilter;
    const matchesUtility = utilityFilter === 'all' || conflict.utility_type === utilityFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesUtility;
  });

  // Get statistics
  const stats = {
    total: conflicts.length,
    active: conflicts.filter(c => c.status === 'active').length,
    resolved: conflicts.filter(c => c.status === 'resolved').length,
    pending: conflicts.filter(c => c.status === 'pending').length,
    critical: conflicts.filter(c => c.priority === 'critical').length,
  };

  const handleNewConflict = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateConflict = async (conflictData: any) => {
    try {
      await createConflict({
        ...conflictData,
        project_id: projectId || null,
        created_by: 'Current User', // Replace with actual user
      });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Utility conflict created successfully",
      });
    } catch (error) {
      console.error('Error creating conflict:', error);
      toast({
        title: "Error",
        description: "Failed to create utility conflict",
        variant: "destructive",
      });
    }
  };

  const handleScheduleAdjustment = (conflictId: string) => {
    toast({
      title: "Schedule Adjustment",
      description: "Opening schedule adjustment dialog...",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Utility Conflicts</h2>
          <p className="text-muted-foreground">Manage utility scheduling conflicts and coordination</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewConflict}>
              <Plus className="h-4 w-4 mr-2" />
              New Conflict
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Utility Conflict</DialogTitle>
            </DialogHeader>
            <UtilityConflictForm
              onSubmit={handleCreateConflict}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Conflicts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-orange-500">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-500">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conflicts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={utilityFilter} onValueChange={setUtilityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Utility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Utilities</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="telecom">Telecom</SelectItem>
                <SelectItem value="sewer">Sewer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts List */}
      <UtilityConflictsList
        conflicts={filteredConflicts}
        onScheduleAdjustment={handleScheduleAdjustment}
        onEdit={updateConflict}
        onDelete={deleteConflict}
        onResolve={resolveConflict}
      />
    </div>
  );
};

export default UtilityConflictsTab;