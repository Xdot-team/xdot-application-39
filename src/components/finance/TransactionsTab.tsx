
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Transaction } from "@/types/finance";
import { Plus, Calendar, FileText } from "lucide-react";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import { SearchFilter } from "./SearchFilter";
import { SortableTable } from "./SortableTable";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TransactionsTabProps {
  transactions: Transaction[];
  canEdit: boolean;
}

export function TransactionsTab({ transactions, canEdit }: TransactionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'date',
    direction: 'desc'
  });

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply sorting to filtered transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof Transaction;
    
    if (key === 'amount' || key === 'date') {
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
  
  const handleViewTransaction = (transaction: Transaction) => {
    toast.info(`Viewing transaction details`);
  };
  
  const handleAddTransaction = () => {
    toast.info("Adding new transaction");
  };
  
  const handleGenerateReport = () => {
    toast.info("Generating general ledger report");
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      cell: (transaction: Transaction) => transaction.date,
      sortable: true
    },
    {
      key: 'description',
      header: 'Description',
      cell: (transaction: Transaction) => transaction.description,
      sortable: true
    },
    {
      key: 'categoryName',
      header: 'Category',
      cell: (transaction: Transaction) => transaction.categoryName,
      sortable: true
    },
    {
      key: 'accountName',
      header: 'Account',
      cell: (transaction: Transaction) => transaction.accountName,
      sortable: true
    },
    {
      key: 'type',
      header: 'Type',
      cell: (transaction: Transaction) => <TransactionTypeBadge type={transaction.type} />,
      sortable: true
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (transaction: Transaction) => (
        <span className={`text-right block ${transaction.type === 'income' ? 'text-green-700' : transaction.type === 'expense' ? 'text-red-700' : 'text-blue-700'}`}>
          {formatCurrency(transaction.amount)}
        </span>
      ),
      sortable: true
    },
    {
      key: 'reference',
      header: 'Reference',
      cell: (transaction: Transaction) => (
        transaction.relatedToType ? (
          <Button variant="ghost" size="sm">
            {transaction.relatedToType === 'client_invoice' ? 'Invoice' : 
             transaction.relatedToType === 'vendor_invoice' ? 'Bill' : 
             transaction.relatedToType === 'purchase_order' ? 'PO' : 'Payroll'}
          </Button>
        ) : null
      ),
      sortable: false
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (transaction: Transaction) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewTransaction(transaction)}>
            <FileText className="h-4 w-4" />
          </Button>
        </div>
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
          <CardTitle>General Ledger</CardTitle>
          <CardDescription>View all financial transactions</CardDescription>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={handleAddTransaction}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          )}
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={setSearchTerm}
          filterOptions={{
            status: [
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
              { label: 'Transfer', value: 'transfer' }
            ],
            dateRange: true,
            other: [
              { label: 'Reconciled', value: 'reconciled' },
              { label: 'Unreconciled', value: 'unreconciled' }
            ]
          }}
          showExport
          onExport={() => toast.info("Exporting transactions")}
        />
        
        <SortableTable
          columns={filteredColumns}
          data={sortedTransactions}
          sortConfig={sortConfig}
          onSort={requestSort}
          emptyMessage="No transactions found matching your search."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedTransactions.length} of {transactions.length} transactions
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
}
