
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
  periodEndDate?: string;
  contractValue?: number;
  billedToDate?: number;
  remainingToBill?: number;
  updatedBy?: string;
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

export interface ClientInvoice extends Invoice {}

export interface VendorInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  projectId?: string;
  projectName?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  approvalDate?: string;
  paymentDate?: string;
  notes?: string;
  poNumber?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  projectId?: string;
  projectName?: string;
  issueDate: string;
  expectedDeliveryDate?: string;
  totalAmount: number;
  status: 'draft' | 'issued' | 'received' | 'cancelled';
  notes?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  deliveryStatus: 'pending' | 'partial' | 'complete';
  receivedQuantity: number;
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
  budgeted: number;
  spent: number;
  remaining: number;
  type: 'income' | 'expense';
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

export interface Payroll {
  id: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  totalTaxes: number;
  employeeCount: number;
  entries: PayrollEntry[];
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

export interface TaxForm {
  id: string;
  formNumber: string;
  formName: string;
  taxYear: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'ready_for_review' | 'filed';
  assignedTo?: string;
  notes?: string;
  attachmentUrl?: string;
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'wip' | 'custom' | 'profit_loss' | 'ar_aging' | 'ap_aging' | 'job_cost' | 'tax';
  period: string;
  generatedDate: string;
  dateGenerated: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  data: any; // This would be structured based on report type
  notes?: string;
  createdBy?: string;
  format?: 'pdf' | 'xlsx' | 'csv';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  description: string;
  accountId: string;
  accountName: string;
  projectId?: string;
  projectName?: string;
  reference?: string;
  status: 'pending' | 'cleared' | 'reconciled' | 'void';
  createdBy: string;
  createdAt: string;
}
