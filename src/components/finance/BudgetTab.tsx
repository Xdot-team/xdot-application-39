
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { BudgetCategory } from "@/types/finance";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import { Pencil, Download, BarChart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BudgetTabProps {
  budgetCategories: BudgetCategory[];
  canEdit: boolean;
}

export function BudgetTab({ budgetCategories, canEdit }: BudgetTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'name',
    direction: 'asc'
  });

  // Filter categories based on search term
  const filteredCategories = budgetCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof BudgetCategory;
    
    if (key === 'budgeted' || key === 'spent' || key === 'remaining') {
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
  
  const handleEditBudget = (category: BudgetCategory) => {
    toast.info(`Editing budget for ${category.name}`);
  };
  
  const handleExportBudget = () => {
    toast.info("Exporting budget data");
  };
  
  const handleViewBudgetReport = () => {
    toast.info("Viewing budget variance report");
  };

  const columns = [
    {
      key: 'name',
      header: 'Category',
      cell: (category: BudgetCategory) => category.name,
      sortable: true
    },
    {
      key: 'type',
      header: 'Type',
      cell: (category: BudgetCategory) => <TransactionTypeBadge type={category.type} />,
      sortable: true
    },
    {
      key: 'budgeted',
      header: 'Budgeted',
      cell: (category: BudgetCategory) => <span className="text-right block">{formatCurrency(category.budgeted)}</span>,
      sortable: true
    },
    {
      key: 'spent',
      header: 'Actual',
      cell: (category: BudgetCategory) => <span className="text-right block">{formatCurrency(category.spent)}</span>,
      sortable: true
    },
    {
      key: 'remaining',
      header: 'Remaining',
      cell: (category: BudgetCategory) => (
        <span className={`text-right block ${category.remaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
          {formatCurrency(category.remaining)}
        </span>
      ),
      sortable: true
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (category: BudgetCategory) => {
        const percentUsed = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
        return (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={cn(
                  "h-2.5 rounded-full",
                  category.type === 'income' ? 'bg-green-600' : 'bg-blue-600',
                  percentUsed > 100 && 'bg-red-600'
                )}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">{percentUsed.toFixed(1)}%</p>
          </div>
        );
      },
      sortable: false
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (category: BudgetCategory) => (
        canEdit && (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditBudget(category)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )
      ),
      sortable: false
    }
  ];
  
  // Only show the actions column if user can edit
  const filteredColumns = canEdit ? columns : columns.filter(col => col.key !== 'actions');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track budget usage across categories</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportBudget}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleViewBudgetReport}>
            <BarChart className="mr-2 h-4 w-4" />
            View Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search budget categories..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'All', value: 'all' },
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' }
            ]
          }}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedCategories}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No budget categories found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedCategories.length} of {budgetCategories.length} budget categories
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
