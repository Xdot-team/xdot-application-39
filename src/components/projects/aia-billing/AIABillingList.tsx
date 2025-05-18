
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
import { AIABilling } from '@/types/projects';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilePenLine, FileCheck, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAIABillings } from '@/data/mockProjects';

interface AIABillingListProps {
  projectId: string;
}

function AIABillingStatusBadge({ status }: { status: AIABilling['status'] }) {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'submitted':
      return <Badge variant="warning">Submitted</Badge>;
    default:
      return <Badge variant="secondary">Draft</Badge>;
  }
}

const AIABillingList = ({ projectId }: AIABillingListProps) => {
  const [billings, setBillings] = useState<AIABilling[]>([]);
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  
  useEffect(() => {
    // Get AIA billings for this project
    const projectBillings = mockAIABillings.filter(billing => billing.projectId === projectId);
    setBillings(projectBillings);
  }, [projectId]);

  if (billings.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium">No pay applications yet</h3>
        <p className="text-muted-foreground mt-1">
          Create your first pay application to get started
        </p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="divide-y">
        {billings.map((billing) => (
          <div key={billing.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Application #{billing.applicationNumber}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(billing.billingPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <AIABillingStatusBadge status={billing.status} />
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm mt-2">
              <span className="text-muted-foreground">Amount Due:</span>
              <span className="font-medium">{formatCurrency(billing.currentPaymentDue)}</span>
              <span className="text-muted-foreground">Form:</span>
              <span>{billing.formType}</span>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              {canEdit && billing.status !== 'approved' && (
                <Button size="sm">
                  <FilePenLine className="h-4 w-4 mr-1" /> Edit
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
            <TableHead>Application #</TableHead>
            <TableHead>Period End</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Current Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billings.map((billing) => (
            <TableRow key={billing.id}>
              <TableCell className="font-medium">{billing.applicationNumber}</TableCell>
              <TableCell>{new Date(billing.billingPeriodEnd).toLocaleDateString()}</TableCell>
              <TableCell>{billing.formType}</TableCell>
              <TableCell>{formatCurrency(billing.currentPaymentDue)}</TableCell>
              <TableCell>
                <AIABillingStatusBadge status={billing.status} />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                {canEdit && billing.status !== 'approved' && (
                  <Button size="sm">
                    <FilePenLine className="h-4 w-4 mr-1" /> Edit
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

export default AIABillingList;
