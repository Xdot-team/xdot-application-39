
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FinancialReport } from "@/types/finance";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { FileText, BarChart, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Mock data for financial reports
const mockReports: FinancialReport[] = [
  {
    id: "FR1001",
    name: "Profit & Loss Statement",
    type: "profit_loss",
    dateGenerated: "2025-04-10",
    dateRange: {
      start: "2025-03-01",
      end: "2025-03-31"
    },
    format: "pdf",
    createdBy: "John Smith",
    url: "#"
  },
  {
    id: "FR1002",
    name: "Balance Sheet",
    type: "balance_sheet",
    dateGenerated: "2025-04-10",
    dateRange: {
      start: "2025-03-31",
      end: "2025-03-31"
    },
    format: "excel",
    createdBy: "John Smith",
    url: "#"
  },
  {
    id: "FR1003",
    name: "Cash Flow Statement",
    type: "cash_flow",
    dateGenerated: "2025-04-10",
    dateRange: {
      start: "2025-03-01",
      end: "2025-03-31"
    },
    format: "pdf",
    createdBy: "Sarah Director",
    url: "#"
  },
  {
    id: "FR1004",
    name: "Accounts Receivable Aging",
    type: "ar_aging",
    dateGenerated: "2025-04-15",
    dateRange: {
      start: "2025-04-15",
      end: "2025-04-15"
    },
    format: "excel",
    createdBy: "John Smith",
    url: "#"
  },
  {
    id: "FR1005",
    name: "Accounts Payable Aging",
    type: "ap_aging",
    dateGenerated: "2025-04-15",
    dateRange: {
      start: "2025-04-15",
      end: "2025-04-15"
    },
    format: "pdf",
    createdBy: "John Smith",
    url: "#"
  },
  {
    id: "FR1006",
    name: "Job Cost Report - GA-400 Repaving",
    type: "job_cost",
    dateGenerated: "2025-04-20",
    dateRange: {
      start: "2025-01-01",
      end: "2025-04-20"
    },
    format: "excel",
    createdBy: "Sarah Director",
    url: "#",
    parameters: {
      projectId: "P1001"
    }
  }
];

interface ReportsTabProps {
  canEdit: boolean;
}

export function ReportsTab({ canEdit }: ReportsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'dateGenerated',
    direction: 'desc'
  });

  // Filter reports based on search term
  const filteredReports = mockReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof FinancialReport;
    
    if (key === 'dateGenerated') {
      const aValue = a[key];
      const bValue = b[key];
      
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
  
  const handleViewReport = (report: FinancialReport) => {
    toast.info(`Viewing report: ${report.name}`);
  };
  
  const handleDownloadReport = (report: FinancialReport) => {
    toast.info(`Downloading ${report.format.toUpperCase()} report: ${report.name}`);
  };
  
  const handleCreateReport = () => {
    toast.info("Creating new financial report");
  };
  
  const getReportTypeLabel = (type: FinancialReport['type']) => {
    switch (type) {
      case 'profit_loss': return 'Profit & Loss';
      case 'balance_sheet': return 'Balance Sheet';
      case 'cash_flow': return 'Cash Flow';
      case 'job_cost': return 'Job Cost';
      case 'ar_aging': return 'AR Aging';
      case 'ap_aging': return 'AP Aging';
      case 'tax': return 'Tax Report';
      case 'custom': return 'Custom';
      default: return type;
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Report Name',
      cell: (report: FinancialReport) => report.name,
      sortable: true
    },
    {
      key: 'type',
      header: 'Type',
      cell: (report: FinancialReport) => getReportTypeLabel(report.type),
      sortable: true
    },
    {
      key: 'dateGenerated',
      header: 'Generated On',
      cell: (report: FinancialReport) => report.dateGenerated,
      sortable: true
    },
    {
      key: 'dateRange',
      header: 'Date Range',
      cell: (report: FinancialReport) => `${report.dateRange.start} - ${report.dateRange.end}`,
      sortable: false
    },
    {
      key: 'format',
      header: 'Format',
      cell: (report: FinancialReport) => (
        <Badge variant="outline" className="uppercase">{report.format}</Badge>
      ),
      sortable: true
    },
    {
      key: 'createdBy',
      header: 'Created By',
      cell: (report: FinancialReport) => report.createdBy,
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (report: FinancialReport) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Generate and manage financial statements and reports</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateReport}>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
          <Button variant="outline">
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search reports..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'P&L', value: 'profit_loss' },
              { label: 'Balance Sheet', value: 'balance_sheet' },
              { label: 'Cash Flow', value: 'cash_flow' },
              { label: 'AR Aging', value: 'ar_aging' },
              { label: 'AP Aging', value: 'ap_aging' },
              { label: 'Job Cost', value: 'job_cost' }
            ]
          }}
        />
        
        <SortableTable
          columns={columns}
          data={sortedReports}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No reports found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedReports.length} of {mockReports.length} reports
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
