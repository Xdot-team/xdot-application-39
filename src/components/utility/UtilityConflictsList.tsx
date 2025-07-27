import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, MapPin, Phone, MoreHorizontal, Settings, Edit, Trash2, CheckCircle } from 'lucide-react';
import { UtilityConflict } from '@/types/field';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface UtilityConflictsListProps {
  conflicts: UtilityConflict[];
  onScheduleAdjustment: (conflictId: string) => void;
  onEdit: (conflictId: string, updates: Partial<UtilityConflict>) => void;
  onDelete: (conflictId: string) => void;
  onResolve: (conflictId: string, resolutionNotes: string, resolvedBy: string) => void;
}

export const UtilityConflictsList = ({
  conflicts,
  onScheduleAdjustment,
  onEdit,
  onDelete,
  onResolve,
}: UtilityConflictsListProps) => {
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<UtilityConflict | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'destructive',
      resolved: 'default',
      pending: 'secondary',
      cancelled: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    } as const;

    return (
      <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getUtilityColor = (utility: string) => {
    const colors = {
      water: 'text-blue-600',
      gas: 'text-yellow-600',
      electric: 'text-red-600',
      telecom: 'text-purple-600',
      sewer: 'text-green-600',
      other: 'text-gray-600',
    } as const;

    return colors[utility as keyof typeof colors] || 'text-gray-600';
  };

  const handleResolve = (conflict: UtilityConflict) => {
    setSelectedConflict(conflict);
    setResolveDialogOpen(true);
  };

  const handleResolveSubmit = () => {
    if (selectedConflict) {
      onResolve(selectedConflict.id, resolutionNotes, 'Current User');
      setResolveDialogOpen(false);
      setResolutionNotes('');
      setSelectedConflict(null);
    }
  };

  if (conflicts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-medium">No Utility Conflicts</h3>
            <p className="text-muted-foreground">
              Great! There are no utility conflicts to resolve at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Utility Name</TableHead>
                <TableHead>Utility Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Point of Contact</TableHead>
                <TableHead>Duration (Days)</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conflicts.map((conflict) => (
                <TableRow key={conflict.id}>
                  <TableCell className="font-mono text-sm">
                    {conflict.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{conflict.project_id || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="font-medium">{conflict.utility_name || 'Not specified'}</div>
                  </TableCell>
                  <TableCell>
                    <span className={getUtilityColor(conflict.utility_type)}>
                      {conflict.utility_type.charAt(0).toUpperCase() + conflict.utility_type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {conflict.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{conflict.contact_name}</div>
                      {conflict.contact_phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {conflict.contact_phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {conflict.utility_project_duration ? `${conflict.utility_project_duration} days` : 'Not specified'}
                  </TableCell>
                  <TableCell>{getPriorityBadge(conflict.priority)}</TableCell>
                  <TableCell>{getStatusBadge(conflict.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScheduleAdjustment(conflict.id)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Schedule Adjustment
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleResolve(conflict)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Conflict
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => onDelete(conflict.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Utility Conflict</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Describe how this conflict was resolved..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveSubmit}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};