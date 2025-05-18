
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { VendorInvoice } from "@/types/finance";
import { FileText, Upload, Plus } from "lucide-react";
import { VendorInvoiceStatusBadge } from "./VendorInvoiceStatusBadge";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { toast } from "sonner";

interface VendorInvoicesTabProps {
  vendorInvoices: VendorInvoice[];
  canEdit: boolean;
}

export function VendorInvoicesTab({ vendorInvoices, canEdit }: VendorInvoicesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'dueDate',
    direction: 'asc'
  });

  // Filter invoices based on search term
  const filteredInvoices = vendorInvoices.filter(invoice => 
    invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.purchaseOrderId && invoice.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Apply sorting to filtered invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof VendorInvoice;
    
    if (key === 'amount' || key === 'dueDate' || key === 'issueDate') {
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
  
  const handleViewInvoice = (invoice: VendorInvoice) => {
    toast.info(`Viewing vendor invoice ${invoice.invoiceNumber}`);
  };
  
  const handlePayInvoice = (invoice: VendorInvoice) => {
    toast.info(`Processing payment for invoice ${invoice.invoiceNumber}`);
  };
  
  const handleAddInvoice = () => {
    toast.info("Adding new vendor invoice");
  };

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      cell: (invoice: VendorInvoice) => invoice.invoiceNumber,
      sortable: true
    },
    {
      key: 'vendorName',
      header: 'Vendor',
      cell: (invoice: VendorInvoice) => invoice.vendorName,
      sortable: true
    },
    {
      key: 'purchaseOrderId',
      header: 'PO #',
      cell: (invoice: VendorInvoice) => invoice.purchaseOrderId || "N/A",
      sortable: true
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      cell: (invoice: VendorInvoice) => invoice.issueDate,
      sortable: true
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (invoice: VendorInvoice) => invoice.dueDate,
      sortable: true
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (invoice: VendorInvoice) => <span className="text-right block">{formatCurrency(invoice.amount)}</span>,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      cell: (invoice: VendorInvoice) => <VendorInvoiceStatusBadge status={invoice.status} />,
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (invoice: VendorInvoice) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
            <FileText className="h-4 w-4" />
          </Button>
          {canEdit && (invoice.status === 'pending' || invoice.status === 'approved') && (
            <Button variant="outline" size="sm" onClick={() => handlePayInvoice(invoice)}>
              Pay
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
          <CardTitle>Vendor Invoices</CardTitle>
          <CardDescription>Manage invoices received from vendors</CardDescription>
        </div>
        {canEdit && (
          <Button onClick={handleAddInvoice}>
            <Upload className="mr-2 h-4 w-4" />
            Add Invoice
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search vendor invoices..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Paid', value: 'paid' },
              { label: 'Disputed', value: 'disputed' }
            ],
            dateRange: true
          }}
          showExport
          onExport={() => toast.info("Exporting vendor invoices")}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedInvoices}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No vendor invoices found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedInvoices.length} of {vendorInvoices.length} vendor invoices
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
