
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VendorInvoiceStatus = 'pending' | 'approved' | 'paid' | 'disputed';

interface VendorInvoiceStatusBadgeProps {
  status: VendorInvoiceStatus;
  className?: string;
}

export const getVendorInvoiceStatusColor = (status: VendorInvoiceStatus) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'paid': return 'bg-green-100 text-green-800';
    case 'disputed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function VendorInvoiceStatusBadge({ status, className }: VendorInvoiceStatusBadgeProps) {
  return (
    <Badge 
      className={cn(getVendorInvoiceStatusColor(status), className)}
      variant="outline"
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
