
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { Payroll } from "@/types/finance";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { FileText, CalendarDays, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for payroll
const mockPayrolls: Payroll[] = [
  {
    id: "PR1001",
    periodStart: "2025-04-01",
    periodEnd: "2025-04-15",
    payDate: "2025-04-20",
    status: "completed",
    totalGrossPay: 85000,
    totalDeductions: 21250,
    totalNetPay: 63750,
    totalTaxes: 18275,
    employeeCount: 25,
    entries: []
  },
  {
    id: "PR1002",
    periodStart: "2025-04-16",
    periodEnd: "2025-04-30",
    payDate: "2025-05-05",
    status: "processing",
    totalGrossPay: 87500,
    totalDeductions: 22500,
    totalNetPay: 65000,
    totalTaxes: 18750,
    employeeCount: 26,
    entries: []
  },
  {
    id: "PR1003",
    periodStart: "2025-05-01",
    periodEnd: "2025-05-15",
    payDate: "2025-05-20",
    status: "draft",
    totalGrossPay: 88750,
    totalDeductions: 23100,
    totalNetPay: 65650,
    totalTaxes: 19100,
    employeeCount: 26,
    entries: []
  }
];

interface PayrollTabProps {
  canEdit: boolean;
}

export function PayrollTab({ canEdit }: PayrollTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'payDate',
    direction: 'desc'
  });

  // Filter payrolls based on search term
  const filteredPayrolls = mockPayrolls.filter(payroll => 
    payroll.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.payDate.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered payrolls
  const sortedPayrolls = [...filteredPayrolls].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof Payroll;
    
    if (key === 'totalGrossPay' || key === 'totalNetPay' || key === 'employeeCount') {
      const aValue = a[key] as number;
      const bValue = b[key] as number;
      
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
  
  const handleViewPayroll = (payroll: Payroll) => {
    toast.info(`Viewing payroll ${payroll.id}`);
  };
  
  const handleProcessPayroll = (payroll: Payroll) => {
    toast.info(`Processing payroll ${payroll.id}`);
  };
  
  const handleStartPayroll = () => {
    toast.info("Starting new payroll run");
  };

  const getStatusColor = (status: Payroll['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Payroll ID',
      cell: (payroll: Payroll) => payroll.id,
      sortable: true
    },
    {
      key: 'periodStart',
      header: 'Period',
      cell: (payroll: Payroll) => `${payroll.periodStart} - ${payroll.periodEnd}`,
      sortable: true
    },
    {
      key: 'payDate',
      header: 'Pay Date',
      cell: (payroll: Payroll) => payroll.payDate,
      sortable: true
    },
    {
      key: 'employeeCount',
      header: 'Employees',
      cell: (payroll: Payroll) => payroll.employeeCount,
      sortable: true
    },
    {
      key: 'totalGrossPay',
      header: 'Gross Pay',
      cell: (payroll: Payroll) => <span className="text-right block">{formatCurrency(payroll.totalGrossPay)}</span>,
      sortable: true
    },
    {
      key: 'totalNetPay',
      header: 'Net Pay',
      cell: (payroll: Payroll) => <span className="text-right block">{formatCurrency(payroll.totalNetPay)}</span>,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      cell: (payroll: Payroll) => (
        <Badge 
          className={getStatusColor(payroll.status)}
          variant="outline"
        >
          {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
        </Badge>
      ),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (payroll: Payroll) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewPayroll(payroll)}>
            <FileText className="h-4 w-4" />
          </Button>
          {canEdit && payroll.status === 'draft' && (
            <Button variant="outline" size="sm" onClick={() => handleProcessPayroll(payroll)}>
              Process
            </Button>
          )}
        </div>
      ),
      sortable: false
    }
  ];
  
  // Only show the actions column if needed
  const filteredColumns = columns.filter(col => col.key !== 'actions' || canEdit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payroll</CardTitle>
          <CardDescription>Manage employee payroll processing</CardDescription>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={handleStartPayroll}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Start Payroll
            </Button>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search payroll records..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Draft', value: 'draft' },
              { label: 'Processing', value: 'processing' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' }
            ],
            dateRange: true
          }}
          showExport
          onExport={() => toast.info("Exporting payroll data")}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedPayrolls}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No payroll records found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedPayrolls.length} of {mockPayrolls.length} payroll records
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
