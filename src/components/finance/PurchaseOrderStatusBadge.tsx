
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PurchaseOrderStatus = 'draft' | 'issued' | 'received' | 'cancelled';

interface PurchaseOrderStatusBadgeProps {
  status: PurchaseOrderStatus;
  className?: string;
}

export const getPurchaseOrderStatusColor = (status: PurchaseOrderStatus) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'issued': return 'bg-blue-100 text-blue-800';
    case 'received': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function PurchaseOrderStatusBadge({ status, className }: PurchaseOrderStatusBadgeProps) {
  return (
    <Badge 
      className={cn(getPurchaseOrderStatusColor(status), className)}
      variant="outline"
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
