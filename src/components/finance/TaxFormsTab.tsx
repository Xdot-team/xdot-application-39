
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaxForm } from "@/types/finance";
import { FileText, Plus, CalendarCheck, FileUp } from "lucide-react";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { StatusBadge } from "./StatusBadge";
import { toast } from "sonner";

export function TaxFormsTab({ canEdit = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({ key: 'dueDate', direction: 'asc' });

  // Mock tax forms
  const mockTaxForms: TaxForm[] = [
    {
      id: "TF1001",
      formNumber: "941",
      formName: "Employer's Quarterly Federal Tax Return",
      taxYear: "2025",
      dueDate: "2025-07-31",
      status: "not_started",
      filingStatus: "not_started",
      filingDate: "",
      relatedEntityName: "xDOT Contractor LLC",
      formType: "federal",
      notes: "Q2 2025 filing"
    },
    {
      id: "TF1002",
      formNumber: "940",
      formName: "Employer's Annual Federal Unemployment Tax Return",
      taxYear: "2024",
      dueDate: "2025-01-31",
      status: "filed",
      filingStatus: "filed",
      filingDate: "2025-01-15",
      relatedEntityName: "xDOT Contractor LLC",
      formType: "federal",
      notes: "Filed on time"
    },
    {
      id: "TF1003",
      formNumber: "1099-NEC",
      formName: "Nonemployee Compensation",
      taxYear: "2024",
      dueDate: "2025-01-31",
      status: "filed",
      filingStatus: "filed",
      filingDate: "2025-01-20",
      relatedEntityName: "Various Subcontractors",
      formType: "federal",
      notes: "25 forms submitted"
    },
    {
      id: "TF1004",
      formNumber: "ST-3",
      formName: "Georgia Sales Tax Return",
      taxYear: "2025",
      dueDate: "2025-04-20",
      status: "ready_for_review",
      filingStatus: "pending",
      filingDate: "",
      relatedEntityName: "xDOT Contractor LLC",
      formType: "state",
      notes: "Q1 2025 filing"
    }
  ];
  
  // Filter forms based on search term
  const filteredForms = mockTaxForms.filter(form => 
    form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.formNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.taxYear.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered forms
  const sortedForms = [...filteredForms].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof TaxForm;
    
    if (key === 'dueDate') {
      return sortConfig.direction === 'asc' 
        ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
        : new Date(b[key]).getTime() - new Date(a[key]).getTime();
    }
    
    return sortConfig.direction === 'asc'
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-500';
      case 'in_progress': return 'bg-blue-500';
      case 'ready_for_review': return 'bg-yellow-500';
      case 'filed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  const handleViewForm = (form: TaxForm) => {
    toast.info(`Viewing form ${form.formNumber}`);
  };
  
  const handleFileForm = (form: TaxForm) => {
    toast.info(`Filing form ${form.formNumber}`);
  };
  
  const handleCreateForm = () => {
    toast.info("Creating new tax form");
  };

  const columns = [
    {
      key: 'formNumber',
      header: 'Form #',
      cell: (form: TaxForm) => form.formNumber,
      sortable: true
    },
    {
      key: 'formName',
      header: 'Name',
      cell: (form: TaxForm) => form.formName,
      sortable: true
    },
    {
      key: 'taxYear',
      header: 'Tax Year',
      cell: (form: TaxForm) => form.taxYear,
      sortable: true
    },
    {
      key: 'formType',
      header: 'Type',
      cell: (form: TaxForm) => form.formType || 'N/A',
      sortable: true
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      cell: (form: TaxForm) => form.dueDate,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      cell: (form: TaxForm) => (
        <StatusBadge label={formatStatus(form.status)} color={getStatusColor(form.status)} />
      ),
      sortable: true
    },
    {
      key: 'relatedEntityName',
      header: 'Related Entity',
      cell: (form: TaxForm) => form.relatedEntityName || 'N/A',
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
          {canEdit && form.status !== 'filed' && (
            <Button variant="outline" size="sm" onClick={() => handleFileForm(form)}>
              <FileUp className="h-4 w-4 mr-1" />
              File
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
          <CardTitle>Tax Forms</CardTitle>
          <CardDescription>Manage and file tax forms</CardDescription>
        </div>
        {canEdit && (
          <Button onClick={handleCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            New Tax Form
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Due This Month
            </Button>
          </div>
        </div>
        
        <SearchFilter 
          placeholder="Search tax forms..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Not Started', value: 'not_started' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Ready for Review', value: 'ready_for_review' },
              { label: 'Filed', value: 'filed' }
            ],
            dateRange: true
          }}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedForms}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No tax forms found matching your search."
        />
      </CardContent>
    </Card>
  );
}
