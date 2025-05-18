export interface ProjectWIP {
  id: string;
  projectId: string;
  projectName: string;
  completionPercentage: number;
  revenueEarned: number;
  costsIncurred: number;
  billingToDate: number;
  overUnderBilledAmount: number;
  billingStatus: 'not_billed' | 'partially_billed' | 'fully_billed' | 'over_billed';
  lastUpdated: string;
  notes?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  grossProfitMargin: number;
  netProfit: number;
  netProfitMargin: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  cashOnHand: number;
  accountsReceivable: number;
  accountsPayable: number;
  period: 'month' | 'quarter' | 'year';
  comparisonPercentage: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  notes?: string;
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
  taxRate?: number;
  taxAmount?: number;
}

export interface Expense {
  id: string;
  projectId?: string;
  projectName?: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  description: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  paymentMethod?: string;
  paymentDate?: string;
  reimbursable: boolean;
  billable: boolean;
  notes?: string;
}

export interface Budget {
  id: string;
  projectId: string;
  projectName: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  lastUpdated: string;
  status: 'draft' | 'approved' | 'active' | 'closed';
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  subcategories?: BudgetSubcategory[];
}

export interface BudgetSubcategory {
  id: string;
  name: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
}

export interface CashFlow {
  id: string;
  date: string;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  runningBalance: number;
  category?: string;
  description?: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
}

export interface TaxFiling {
  id: string;
  taxType: string;
  period: string;
  dueDate: string;
  filingDate?: string;
  amount: number;
  status: 'pending' | 'filed' | 'paid' | 'extension';
  notes?: string;
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'wip' | 'custom';
  period: string;
  generatedDate: string;
  data: any; // This would be structured based on report type
  notes?: string;
}
