
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { ClientInvoice, VendorInvoice, Transaction } from "@/types/finance";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, BadgeDollarSign } from "lucide-react";

interface FinancialOverviewProps {
  clientInvoices: ClientInvoice[];
  vendorInvoices: VendorInvoice[];
  transactions: Transaction[];
}

export function FinancialOverview({ clientInvoices, vendorInvoices, transactions }: FinancialOverviewProps) {
  const outstandingInvoices = clientInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const outstandingCount = clientInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;
    
  const accountsPayable = vendorInvoices
    .filter(inv => inv.status === 'pending' || inv.status === 'approved')
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const payableCount = vendorInvoices
    .filter(inv => inv.status === 'pending' || inv.status === 'approved').length;

  const revenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const revenueCount = transactions.filter(t => t.type === 'income').length;

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  
  const cashFlow = revenue - expenses;
  const cashFlowPositive = cashFlow >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Outstanding Invoices</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {formatCurrency(outstandingInvoices)}
            <CreditCard className="ml-2 h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {outstandingCount} invoices pending payment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Accounts Payable</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {formatCurrency(accountsPayable)}
            <BadgeDollarSign className="ml-2 h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {payableCount} invoices to be paid
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Revenue (MTD)</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {formatCurrency(revenue)}
            <ArrowUpRight className="ml-2 h-4 w-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {revenueCount} payment transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Expenses (MTD)</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {formatCurrency(expenses)}
            <ArrowDownRight className="ml-2 h-4 w-4 text-red-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {expenseCount} expense transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
