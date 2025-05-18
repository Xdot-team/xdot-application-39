
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExpandedChangeOrder } from '@/types/projects';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClipboardCheck, ClipboardEdit, Eye, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockChangeOrders } from '@/data/mockProjects';

interface ChangeOrderListProps {
  projectId: string;
}

function ChangeOrderStatusBadge({ status }: { status: ExpandedChangeOrder['status'] }) {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'submitted':
      return <Badge variant="warning">Submitted</Badge>;
    case 'pending_approval':
      return <Badge variant="warning">Pending Approval</Badge>;
    default:
      return <Badge variant="secondary">Draft</Badge>;
  }
}

const ChangeOrderList = ({ projectId }: ChangeOrderListProps) => {
  const [changeOrders, setChangeOrders] = useState<ExpandedChangeOrder[]>([]);
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  
  useEffect(() => {
    // Get change orders for this project
    const projectChangeOrders = mockChangeOrders.filter(co => co.projectId === projectId);
    setChangeOrders(projectChangeOrders);
  }, [projectId]);

  if (changeOrders.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium">No change orders yet</h3>
        <p className="text-muted-foreground mt-1">
          Create your first change order to add scope, time or cost changes
        </p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="divide-y">
        {changeOrders.map((co) => (
          <div key={co.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{co.title}</h4>
                <p className="text-sm text-muted-foreground">
                  CO#{co.changeOrderNumber} • {new Date(co.requestDate).toLocaleDateString()}
                </p>
              </div>
              <ChangeOrderStatusBadge status={co.status} />
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm mt-2">
              <span className="text-muted-foreground">Cost Impact:</span>
              <span className="font-medium">{formatCurrency(co.costImpact)}</span>
              <span className="text-muted-foreground">Schedule Impact:</span>
              <span>{co.timeImpact} days</span>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              {canEdit && co.status !== 'approved' && co.status !== 'rejected' && (
                <Button size="sm">
                  <ClipboardEdit className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
              {canEdit && co.status === 'pending_approval' && (
                <Button size="sm" variant="success">
                  <ClipboardCheck className="h-4 w-4 mr-1" /> Approve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CO#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Cost Impact</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changeOrders.map((co) => (
            <TableRow key={co.id}>
              <TableCell>{co.changeOrderNumber}</TableCell>
              <TableCell className="font-medium">{co.title}</TableCell>
              <TableCell>{new Date(co.requestDate).toLocaleDateString()}</TableCell>
              <TableCell>{formatCurrency(co.costImpact)}</TableCell>
              <TableCell>{co.timeImpact} days</TableCell>
              <TableCell>
                <ChangeOrderStatusBadge status={co.status} />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                {canEdit && co.status !== 'approved' && co.status !== 'rejected' && (
                  <Button size="sm">
                    <ClipboardEdit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
                {canEdit && co.status === 'pending_approval' && (
                  <Button size="sm" variant="success">
                    <ClipboardCheck className="h-4 w-4 mr-1" /> Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChangeOrderList;
