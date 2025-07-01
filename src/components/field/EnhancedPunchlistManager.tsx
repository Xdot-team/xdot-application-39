
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePunchlistItems, useFieldPhotos, useGPSLocation } from '@/hooks/useFieldOperations';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/database';
import { 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Calendar, 
  User, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

// Use the actual database type structure instead of defining our own
interface DatabasePunchlistItem {
  id: string;
  project_id: string;
  site_id: string;
  location: string;
  station_reference: string;
  description: string;
  detailed_description: string;
  category: string;
  severity: string; // This matches the database string type
  priority: string;
  assigned_to: string;
  assigned_crew: string;
  reporter_name: string;
  due_date: string;
  status: string;
  resolution_notes: string;
  resolution_date: string;
  resolved_by: string;
  photos_before: string[];
  photos_after: string[];
  gps_coordinates: any;
  cost_impact: number;
  schedule_impact_days: number;
  root_cause: string;
  corrective_action: string;
  created_at: string;
  updated_at: string;
  field_sites?: { name: string; address: string };
  projects?: { name: string };
}

interface EnhancedPunchlistManagerProps {
  projectId?: string;
}

export const EnhancedPunchlistManager = ({ projectId }: EnhancedPunchlistManagerProps) => {
  const [selectedItem, setSelectedItem] = useState<DatabasePunchlistItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { punchlistItems, isLoading, createPunchlistItem, updatePunchlistItem, deletePunchlistItem } = usePunchlistItems(projectId);
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
  });
  const { location, getCurrentLocation } = useGPSLocation();

  // Filter punchlist items
  const filteredItems = punchlistItems.filter((item: DatabasePunchlistItem) => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.assigned_to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'minor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleCreateItem = (formData: FormData) => {
    const newItem = {
      id: `PL-${Date.now()}`,
      project_id: formData.get('project_id') as string,
      location: formData.get('location') as string,
      station_reference: formData.get('station_reference') as string,
      description: formData.get('description') as string,
      detailed_description: formData.get('detailed_description') as string,
      category: formData.get('category') as string,
      severity: formData.get('severity') as string,
      priority: formData.get('priority') as string,
      assigned_to: formData.get('assigned_to') as string,
      reporter_name: formData.get('reporter_name') as string,
      due_date: formData.get('due_date') as string,
      gps_coordinates: location ? `POINT(${location.lng} ${location.lat})` : null,
      cost_impact: parseFloat(formData.get('cost_impact') as string) || 0,
      schedule_impact_days: parseInt(formData.get('schedule_impact_days') as string) || 0
    };

    createPunchlistItem(newItem);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateItem = (formData: FormData) => {
    if (!selectedItem) return;

    const updates = {
      location: formData.get('location') as string,
      station_reference: formData.get('station_reference') as string,
      description: formData.get('description') as string,
      detailed_description: formData.get('detailed_description') as string,
      category: formData.get('category') as string,
      severity: formData.get('severity') as string,
      priority: formData.get('priority') as string,
      assigned_to: formData.get('assigned_to') as string,
      cost_impact: parseFloat(formData.get('cost_impact') as string) || 0,
      schedule_impact_days: parseInt(formData.get('schedule_impact_days') as string) || 0,
      status: formData.get('status') as string,
      resolution_notes: formData.get('resolution_notes') as string,
      corrective_action: formData.get('corrective_action') as string,
      root_cause: formData.get('root_cause') as string
    };

    updatePunchlistItem({ id: selectedItem.id, updates });
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading punchlist items...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Punchlist Management</h2>
          <p className="text-muted-foreground">
            {filteredItems.length} items found
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Punchlist Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Punchlist Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateItem(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_id">Project *</Label>
                  <Select name="project_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input name="location" required placeholder="e.g., Station 14+50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="station_reference">Station Reference</Label>
                  <Input name="station_reference" placeholder="e.g., STA 10+25" />
                </div>
                <div>
                  <Label htmlFor="reporter_name">Reporter Name *</Label>
                  <Input name="reporter_name" required placeholder="Your name" />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea name="description" required placeholder="Brief description of the issue" />
              </div>

              <div>
                <Label htmlFor="detailed_description">Detailed Description</Label>
                <Textarea name="detailed_description" rows={3} placeholder="Detailed description of the issue" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defect">Defect</SelectItem>
                      <SelectItem value="omission">Omission</SelectItem>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity *</Label>
                  <Select name="severity" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assigned_to">Assigned To *</Label>
                  <Input name="assigned_to" required placeholder="Person or crew assigned" />
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input name="due_date" type="date" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost_impact">Cost Impact ($)</Label>
                  <Input name="cost_impact" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="schedule_impact_days">Schedule Impact (Days)</Label>
                  <Input name="schedule_impact_days" type="number" placeholder="0" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={getCurrentLocation}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Current Location
                </Button>
                {location && (
                  <span className="text-sm text-muted-foreground">
                    Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Punchlist Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="major">Major</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Punchlist Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item: DatabasePunchlistItem) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Badge className={`${getSeverityColor(item.severity)} text-white`}>
                    {item.severity}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">{item.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(item.status)}
                  <span className="text-sm capitalize">{item.status}</span>
                </div>
              </div>
              <CardTitle className="text-lg">{item.description}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
                {item.station_reference && (
                  <span className="text-muted-foreground">({item.station_reference})</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{item.assigned_to}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(new Date(item.due_date), 'MMM dd, yyyy')}</span>
              </div>

              {item.cost_impact > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Cost Impact:</span> ${item.cost_impact.toLocaleString()}
                </div>
              )}

              {item.schedule_impact_days > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Schedule Impact:</span> {item.schedule_impact_days} days
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this item?')) {
                        deletePunchlistItem(item.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  {item.photos_before && item.photos_before.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Camera className="h-3 w-3 mr-1" />
                      {item.photos_before.length}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No punchlist items found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterStatus !== 'all' || filterSeverity !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first punchlist item to get started'}
          </p>
        </div>
      )}

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Punchlist Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && <PunchlistItemDetails item={selectedItem} />}
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Punchlist Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateItem(new FormData(e.currentTarget));
            }} className="space-y-4">
              {/* Edit form fields similar to create form but pre-populated */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input name="location" defaultValue={selectedItem.location} required />
                </div>
                <div>
                  <Label htmlFor="station_reference">Station Reference</Label>
                  <Input name="station_reference" defaultValue={selectedItem.station_reference} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea name="description" defaultValue={selectedItem.description} required />
              </div>

              <div>
                <Label htmlFor="detailed_description">Detailed Description</Label>
                <Textarea name="detailed_description" defaultValue={selectedItem.detailed_description} rows={3} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={selectedItem.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defect">Defect</SelectItem>
                      <SelectItem value="omission">Omission</SelectItem>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity *</Label>
                  <Select name="severity" defaultValue={selectedItem.severity} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue={selectedItem.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assigned_to">Assigned To *</Label>
                  <Input name="assigned_to" defaultValue={selectedItem.assigned_to} required />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedItem.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="resolution_notes">Resolution Notes</Label>
                <Textarea name="resolution_notes" defaultValue={selectedItem.resolution_notes} rows={3} />
              </div>

              <div>
                <Label htmlFor="corrective_action">Corrective Action</Label>
                <Textarea name="corrective_action" defaultValue={selectedItem.corrective_action} rows={2} />
              </div>

              <div>
                <Label htmlFor="root_cause">Root Cause</Label>
                <Textarea name="root_cause" defaultValue={selectedItem.root_cause} rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost_impact">Cost Impact ($)</Label>
                  <Input name="cost_impact" type="number" step="0.01" defaultValue={selectedItem.cost_impact} />
                </div>
                <div>
                  <Label htmlFor="schedule_impact_days">Schedule Impact (Days)</Label>
                  <Input name="schedule_impact_days" type="number" defaultValue={selectedItem.schedule_impact_days} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Item</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Detailed view component for punchlist items
const PunchlistItemDetails = ({ item }: { item: DatabasePunchlistItem }) => {
  const { photos } = useFieldPhotos('punchlist_items', item.id);

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="resolution">Resolution</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ID</Label>
            <p className="font-mono">{item.id}</p>
          </div>
          <div>
            <Label>Status</Label>
            <p className="capitalize">{item.status}</p>
          </div>
          <div>
            <Label>Location</Label>
            <p>{item.location}</p>
          </div>
          <div>
            <Label>Station Reference</Label>
            <p>{item.station_reference || 'N/A'}</p>
          </div>
          <div>
            <Label>Severity</Label>
            <Badge className={`${getSeverityColor(item.severity)} text-white`}>
              {item.severity}
            </Badge>
          </div>
          <div>
            <Label>Priority</Label>
            <p className="capitalize">{item.priority}</p>
          </div>
          <div>
            <Label>Assigned To</Label>
            <p>{item.assigned_to}</p>
          </div>
          <div>
            <Label>Due Date</Label>
            <p>{format(new Date(item.due_date), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        
        <div>
          <Label>Description</Label>
          <p>{item.description}</p>
        </div>
        
        {item.detailed_description && (
          <div>
            <Label>Detailed Description</Label>
            <p>{item.detailed_description}</p>
          </div>
        )}
        
        {(item.cost_impact > 0 || item.schedule_impact_days > 0) && (
          <div className="grid grid-cols-2 gap-4">
            {item.cost_impact > 0 && (
              <div>
                <Label>Cost Impact</Label>
                <p>${item.cost_impact.toLocaleString()}</p>
              </div>
            )}
            {item.schedule_impact_days > 0 && (
              <div>
                <Label>Schedule Impact</Label>
                <p>{item.schedule_impact_days} days</p>
              </div>
            )}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="photos">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo: any) => (
            <div key={photo.id} className="space-y-2">
              <img 
                src={photo.file_url} 
                alt={photo.caption || 'Field photo'} 
                className="w-full h-48 object-cover rounded-lg"
              />
              {photo.caption && (
                <p className="text-sm text-muted-foreground">{photo.caption}</p>
              )}
            </div>
          ))}
          {photos.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No photos available
            </p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="resolution" className="space-y-4">
        {item.resolution_notes && (
          <div>
            <Label>Resolution Notes</Label>
            <p>{item.resolution_notes}</p>
          </div>
        )}
        
        {item.corrective_action && (
          <div>
            <Label>Corrective Action</Label>
            <p>{item.corrective_action}</p>
          </div>
        )}
        
        {item.root_cause && (
          <div>
            <Label>Root Cause</Label>
            <p>{item.root_cause}</p>
          </div>
        )}
        
        {item.resolved_by && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Resolved By</Label>
              <p>{item.resolved_by}</p>
            </div>
            <div>
              <Label>Resolution Date</Label>
              <p>{item.resolution_date ? format(new Date(item.resolution_date), 'MMM dd, yyyy') : 'N/A'}</p>
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="history">
        <div className="space-y-4">
          <div>
            <Label>Created</Label>
            <p>{format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}</p>
          </div>
          <div>
            <Label>Last Updated</Label>
            <p>{format(new Date(item.updated_at), 'MMM dd, yyyy HH:mm')}</p>
          </div>
          <div>
            <Label>Reported By</Label>
            <p>{item.reporter_name}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500';
    case 'major': return 'bg-orange-500';
    case 'minor': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};
