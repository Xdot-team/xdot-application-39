
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { TaxForm } from "@/types/finance";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { FileText, CalendarClock, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for tax forms
const mockTaxForms: TaxForm[] = [
  {
    id: "TF1001",
    formType: "941",
    taxYear: "2025",
    filingStatus: "filed",
    dueDate: "2025-04-30",
    filingDate: "2025-04-25",
    amount: 58250,
    relatedEntityType: "company",
    relatedEntityName: "ABC Construction, Inc.",
    notes: "Q1 2025 Quarterly Federal Tax Return"
  },
  {
    id: "TF1002",
    formType: "W2",
    taxYear: "2024",
    filingStatus: "filed",
    dueDate: "2025-01-31",
    filingDate: "2025-01-20",
    relatedEntityType: "employee",
    relatedEntityName: "All Employees",
    notes: "Annual wage reporting"
  },
  {
    id: "TF1003",
    formType: "1099",
    taxYear: "2024",
    filingStatus: "filed",
    dueDate: "2025-01-31",
    filingDate: "2025-01-15",
    relatedEntityType: "contractor",
    relatedEntityName: "Various Subcontractors",
    notes: "Annual contractor payment reporting"
  },
  {
    id: "TF1004",
    formType: "941",
    taxYear: "2025",
    filingStatus: "not_started",
    dueDate: "2025-07-31",
    relatedEntityType: "company",
    relatedEntityName: "ABC Construction, Inc.",
    notes: "Q2 2025 Quarterly Federal Tax Return"
  }
];

interface TaxFormsTabProps {
  canEdit: boolean;
}

export function TaxFormsTab({ canEdit }: TaxFormsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'dueDate',
    direction: 'asc'
  });

  // Filter tax forms based on search term
  const filteredForms = mockTaxForms.filter(form => 
    form.formType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.taxYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.filingStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.relatedEntityName && form.relatedEntityName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Apply sorting to filtered forms
  const sortedForms = [...filteredForms].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof TaxForm;
    
    if (key === 'dueDate' || key === 'filingDate') {
      const aValue = a[key] as string;
      const bValue = b[key] as string;
      
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
  
  const handleViewForm = (form: TaxForm) => {
    toast.info(`Viewing tax form ${form.id}`);
  };
  
  const handleFileForm = (form: TaxForm) => {
    toast.info(`Filing tax form ${form.id}`);
  };
  
  const handleUploadForm = () => {
    toast.info("Uploading new tax form");
  };

  const getStatusColor = (status: TaxForm['filingStatus']) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'filed': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: TaxForm['filingStatus']) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'filed': return 'Filed';
      case 'accepted': return 'Accepted';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      cell: (form: TaxForm) => form.id,
      sortable: true
    },
    {
      key: 'formType',
      header: 'Form Type',
      cell: (form: TaxForm) => form.formType,
      sortable: true
    },
    {
      key: 'taxYear',
      header: 'Tax Year',
      cell: (form: TaxForm) => form.taxYear,
      sortable: true
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (form: TaxForm) => form.dueDate,
      sortable: true
    },
    {
      key: 'filingDate',
      header: 'Filing Date',
      cell: (form: TaxForm) => form.filingDate || "N/A",
      sortable: true
    },
    {
      key: 'relatedEntityName',
      header: 'Related To',
      cell: (form: TaxForm) => form.relatedEntityName || "N/A",
      sortable: true
    },
    {
      key: 'filingStatus',
      header: 'Status',
      cell: (form: TaxForm) => (
        <Badge 
          className={getStatusColor(form.filingStatus)}
          variant="outline"
        >
          {getStatusLabel(form.filingStatus)}
        </Badge>
      ),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (form: TaxForm) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewForm(form)}>
            <FileText className="h-4 w-4" />
          </Button>
          {canEdit && form.filingStatus === 'not_started' && (
            <Button variant="outline" size="sm" onClick={() => handleFileForm(form)}>
              File
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
          <CardTitle>Tax Forms</CardTitle>
          <CardDescription>Manage and track tax filing requirements</CardDescription>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={handleUploadForm}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Form
            </Button>
          )}
          <Button variant="outline">
            <CalendarClock className="mr-2 h-4 w-4" />
            Tax Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search tax forms..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Not Started', value: 'not_started' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Filed', value: 'filed' },
              { label: 'Accepted', value: 'accepted' }
            ],
            other: [
              { label: '941', value: '941' },
              { label: 'W2', value: 'W2' },
              { label: '1099', value: '1099' }
            ]
          }}
          showExport
          onExport={() => toast.info("Exporting tax forms data")}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedForms}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No tax forms found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedForms.length} of {mockTaxForms.length} tax forms
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
