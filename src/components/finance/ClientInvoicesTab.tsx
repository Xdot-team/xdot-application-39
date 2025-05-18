
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { ClientInvoice } from "@/types/finance";
import { FileText, Plus } from "lucide-react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { toast } from "sonner";

interface ClientInvoicesTabProps {
  clientInvoices: ClientInvoice[];
  canEdit: boolean;
}

export function ClientInvoicesTab({ clientInvoices, canEdit }: ClientInvoicesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'dueDate',
    direction: 'asc'
  });

  // Filter invoices based on search term
  const filteredInvoices = clientInvoices.filter(invoice => 
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof ClientInvoice;
    
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
  
  const handleViewInvoice = (invoice: ClientInvoice) => {
    toast.info(`Viewing invoice ${invoice.invoiceNumber}`);
  };
  
  const handleCreateInvoice = () => {
    toast.info("Creating new invoice");
  };

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      cell: (invoice: ClientInvoice) => invoice.invoiceNumber,
      sortable: true
    },
    {
      key: 'clientName',
      header: 'Client',
      cell: (invoice: ClientInvoice) => invoice.clientName,
      sortable: true
    },
    {
      key: 'projectName',
      header: 'Project',
      cell: (invoice: ClientInvoice) => invoice.projectName,
      sortable: true
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      cell: (invoice: ClientInvoice) => invoice.issueDate,
      sortable: true
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (invoice: ClientInvoice) => invoice.dueDate,
      sortable: true
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (invoice: ClientInvoice) => <span className="text-right block">{formatCurrency(invoice.amount)}</span>,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      cell: (invoice: ClientInvoice) => <InvoiceStatusBadge status={invoice.status} />,
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (invoice: ClientInvoice) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
            <FileText className="h-4 w-4" />
          </Button>
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
          <CardTitle>Client Invoices</CardTitle>
          <CardDescription>Manage invoices sent to clients</CardDescription>
        </div>
        {canEdit && (
          <Button onClick={handleCreateInvoice}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Draft', value: 'draft' },
              { label: 'Sent', value: 'sent' },
              { label: 'Paid', value: 'paid' },
              { label: 'Overdue', value: 'overdue' },
              { label: 'Cancelled', value: 'cancelled' }
            ],
            dateRange: true
          }}
          showExport
          onExport={() => toast.info("Exporting invoices")}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedInvoices}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No invoices found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedInvoices.length} of {clientInvoices.length} invoices
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
