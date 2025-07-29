import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUtilityConflicts } from '@/hooks/useUtilityConflicts';
import { UtilityConflict } from '@/types/field';
import { Project } from '@/types/projects';
import UtilityConflictForm from '@/components/utility/UtilityConflictForm';
import { Search, Plus, MapPin, Phone, DollarSign } from 'lucide-react';

interface GlobalUtilityConflictsProps {
  conflicts: UtilityConflict[];
  projects: Project[];
  loading: boolean;
  selectedProjectId: string | null;
}

const GlobalUtilityConflicts = ({ 
  conflicts, 
  projects, 
  loading,
  selectedProjectId 
}: GlobalUtilityConflictsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [utilityFilter, setUtilityFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { createConflict } = useUtilityConflicts();
  const { toast } = useToast();

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown Project';
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'destructive',
      pending: 'secondary',
      resolved: 'success'
    };
    
    return (
      <Badge variant={(statusColors[status as keyof typeof statusColors] as any) || 'default'}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: 'default',
      medium: 'secondary',
      high: 'default',
      critical: 'destructive'
    };
    
    return (
      <Badge variant={(priorityColors[priority as keyof typeof priorityColors] as any) || 'default'}>
        {priority}
      </Badge>
    );
  };

  const getUtilityColor = (utilityType: string) => {
    const colors = {
      water: 'text-blue-600',
      electric: 'text-amber-600',
      gas: 'text-red-600',
      telecom: 'text-purple-600',
      sewer: 'text-brown-600'
    };
    return colors[utilityType as keyof typeof colors] || 'text-gray-600';
  };

  // Filter conflicts
  const filteredConflicts = conflicts.filter(conflict => {
    const matchesSearch = 
      conflict.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conflict.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(conflict.project_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conflict.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conflict.priority === priorityFilter;
    const matchesUtility = utilityFilter === 'all' || conflict.utility_type === utilityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesUtility;
  });

  const handleCreateConflict = async (conflictData: any) => {
    try {
      await createConflict({
        ...conflictData,
        project_id: selectedProjectId || conflictData.project_id
      });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Utility conflict created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create utility conflict",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse">Loading conflicts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Utility Conflicts</h2>
          <p className="text-muted-foreground">
            {selectedProjectId ? 'Project-specific' : 'All projects'} utility conflicts
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
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
              onCancel={() => setShowCreateDialog(false)}
              defaultProjectId={selectedProjectId}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conflicts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={utilityFilter} onValueChange={setUtilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Utilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Utilities</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="telecom">Telecom</SelectItem>
                <SelectItem value="sewer">Sewer</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredConflicts.length} of {conflicts.length} conflicts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredConflicts.map(conflict => (
          <Card key={conflict.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{conflict.location}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getProjectName(conflict.project_id)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(conflict.status)}
                  {getPriorityBadge(conflict.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Utility Type:</span>
                  <p className={`text-sm capitalize ${getUtilityColor(conflict.utility_type)}`}>
                    {conflict.utility_type}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Company:</span>
                  <p className="text-sm">{conflict.contact_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{conflict.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{conflict.contact_phone}</span>
                </div>
                {conflict.cost_impact && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>${conflict.cost_impact.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm font-medium">Duration:</span>
                <p className="text-sm text-muted-foreground">
                  Duration: {conflict.expected_duration_days} days
                </p>
              </div>

              {conflict.description && (
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm text-muted-foreground">{conflict.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConflicts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No utility conflicts found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalUtilityConflicts;