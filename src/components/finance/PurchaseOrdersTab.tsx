
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { PurchaseOrder } from "@/types/finance";
import { FileText, Plus } from "lucide-react";
import { PurchaseOrderStatusBadge } from "./PurchaseOrderStatusBadge";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { toast } from "sonner";

interface PurchaseOrdersTabProps {
  purchaseOrders: PurchaseOrder[];
  canEdit: boolean;
}

export function PurchaseOrdersTab({ purchaseOrders, canEdit }: PurchaseOrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'issueDate',
    direction: 'desc'
  });

  // Filter POs based on search term
  const filteredPOs = purchaseOrders.filter(po => 
    po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (po.projectName && po.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    po.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered POs
  const sortedPOs = [...filteredPOs].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof PurchaseOrder;
    
    if (key === 'totalAmount' || key === 'issueDate') {
      const aValue = a[key] as number | string;
      const bValue = b[key] as number | string;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }
    
    return String(a[key]).localeCompare(String(b[key]));
  });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const handleViewPO = (po: PurchaseOrder) => {
    toast.info(`Viewing purchase order ${po.poNumber}`);
  };
  
  const handleIssuePO = (po: PurchaseOrder) => {
    toast.info(`Issuing purchase order ${po.poNumber}`);
  };
  
  const handleCreatePO = () => {
    toast.info("Creating new purchase order");
  };

  const columns = [
    {
      key: 'poNumber',
      header: 'PO #',
      cell: (po: PurchaseOrder) => po.poNumber,
      sortable: true
    },
    {
      key: 'vendorName',
      header: 'Vendor',
      cell: (po: PurchaseOrder) => po.vendorName,
      sortable: true
    },
    {
      key: 'projectName',
      header: 'Project',
      cell: (po: PurchaseOrder) => po.projectName || "N/A",
      sortable: true
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      cell: (po: PurchaseOrder) => po.issueDate,
      sortable: true
    },
    {
      key: 'expectedDeliveryDate',
      header: 'Expected Delivery',
      cell: (po: PurchaseOrder) => po.expectedDeliveryDate || "N/A",
      sortable: true
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      cell: (po: PurchaseOrder) => <span className="text-right block">{formatCurrency(po.totalAmount)}</span>,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      cell: (po: PurchaseOrder) => <PurchaseOrderStatusBadge status={po.status} />,
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (po: PurchaseOrder) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewPO(po)}>
            <FileText className="h-4 w-4" />
          </Button>
          {canEdit && po.status === 'draft' && (
            <Button variant="outline" size="sm" onClick={() => handleIssuePO(po)}>
              Issue
            </Button>
          )}
        </div>
      ),
      sortable: false
    }
  ];
  
  // Only show the actions column if user can edit
  const filteredColumns = canEdit ? columns : columns.slice(0, -1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Manage purchase orders to vendors</CardDescription>
        </div>
        {canEdit && (
          <Button onClick={handleCreatePO}>
            <Plus className="mr-2 h-4 w-4" />
            New PO
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search purchase orders..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Draft', value: 'draft' },
              { label: 'Issued', value: 'issued' },
              { label: 'Received', value: 'received' },
              { label: 'Cancelled', value: 'cancelled' }
            ],
            dateRange: true
          }}
          showExport
          onExport={() => toast.info("Exporting purchase orders")}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedPOs}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No purchase orders found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedPOs.length} of {purchaseOrders.length} purchase orders
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
