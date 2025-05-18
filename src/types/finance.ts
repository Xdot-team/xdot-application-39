export interface ClientInvoice {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  lineItems: InvoiceLineItem[];
  terms?: string;
  notes?: string;
  attachments?: Attachment[];
  paymentHistory?: Payment[];
  taxRate?: number;
  taxAmount?: number;
  subTotal?: number;
  totalWithTax?: number;
  customFields?: Record<string, string>;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable?: boolean;
  costCode?: string;
  notes?: string;
}

export interface VendorInvoice {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceNumber: string;
  purchaseOrderId?: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  description?: string;
  lineItems?: InvoiceLineItem[];
  terms?: string;
  notes?: string;
  attachments?: Attachment[];
  approvalHistory?: ApprovalStep[];
  paymentDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  taxAmount?: number;
  costCodes?: string[];
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
  status: 'draft' | 'issued' | 'received' | 'cancelled';
  totalAmount: number;
  items: PurchaseOrderItem[];
  approvedBy?: string;
  approvedDate?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
  attachments?: Attachment[];
  terms?: string;
  taxRate?: number;
  taxAmount?: number;
  subTotal?: number;
  totalWithTax?: number;
  changeOrders?: ChangeOrder[];
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  costCode?: string;
  receivedQuantity?: number;
  receivedDate?: string;
  backorderedQuantity?: number;
}

export interface ChangeOrder {
  id: string;
  number: string;
  date: string;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  items: ChangeOrderItem[];
  totalAmount: number;
  approvedBy?: string;
  approvedDate?: string;
}

export interface ChangeOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  relatedToId?: string;
  relatedToType?: 'client_invoice' | 'vendor_invoice' | 'purchase_order' | 'payroll';
  accountId: string;
  accountName: string;
  checkNumber?: string;
  memo?: string;
  reconciled?: boolean;
  attachments?: Attachment[];
  createdBy?: string;
  costCodes?: string[];
  taxable?: boolean;
  paymentMethod?: 'check' | 'credit_card' | 'ach' | 'wire' | 'cash' | 'other';
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  type: 'income' | 'expense';
  parentId?: string;
  subCategories?: BudgetCategory[];
  costCodes?: string[];
  notes?: string;
  fiscalYear?: string;
  quarter?: string;
  variance?: number;
  variancePercentage?: number;
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit' | 'loan' | 'asset' | 'liability' | 'equity' | 'income' | 'expense' | 'other';
  balance: number;
  accountNumber?: string;
  routingNumber?: string;
  institution?: string;
  openingBalance?: number;
  openingBalanceDate?: string;
  lastReconciled?: string;
  isActive: boolean;
  notes?: string;
  contactPerson?: string;
  contactInformation?: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'check' | 'credit_card' | 'ach' | 'wire' | 'cash' | 'other';
  reference?: string;
  notes?: string;
  relatedToId: string;
  relatedToType: 'client_invoice' | 'vendor_invoice';
  accountId: string;
  accountName: string;
}

export interface ApprovalStep {
  id: string;
  approverName: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  url: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CostCode {
  id: string;
  code: string;
  description: string;
  category: string;
  isActive: boolean;
  parentId?: string;
  subCodes?: CostCode[];
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'job_cost' | 'ar_aging' | 'ap_aging' | 'tax' | 'custom';
  dateGenerated: string;
  dateRange: {
    start: string;
    end: string;
  };
  format: 'pdf' | 'excel' | 'csv';
  createdBy: string;
  url?: string;
  parameters?: Record<string, any>;
  scheduleId?: string;
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
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  regularRate: number;
  overtimeRate: number;
  doubleTimeRate: number;
  grossPay: number;
  deductions: PayrollDeduction[];
  netPay: number;
  taxes: PayrollTax[];
  projectAllocations?: ProjectAllocation[];
}

export interface PayrollDeduction {
  id: string;
  type: string;
  amount: number;
  description?: string;
}

export interface PayrollTax {
  id: string;
  type: string;
  amount: number;
  description?: string;
}

export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  hours: number;
  amount: number;
  costCode?: string;
}

export interface TaxForm {
  id: string;
  formType: '1099' | 'W2' | 'W4' | '941' | 'other';
  taxYear: string;
  filingStatus: 'not_started' | 'in_progress' | 'filed' | 'accepted';
  dueDate: string;
  filingDate?: string;
  amount?: number;
  relatedEntityId?: string;
  relatedEntityType?: 'employee' | 'contractor' | 'company';
  relatedEntityName?: string;
  attachments?: Attachment[];
  notes?: string;
}

export interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: number;
  unit: 'currency' | 'percentage' | 'ratio' | 'days' | 'count';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  date: string;
  category: 'profitability' | 'liquidity' | 'efficiency' | 'growth' | 'other';
}

export interface CreditTerms {
  id: string;
  name: string; 
  daysUntilDue: number;
  discountPercentage?: number;
  discountDays?: number;
  description?: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate: string;
  amount: number;
  description?: string;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  isActive: boolean;
  lastProcessed?: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  relatedEntityId?: string;
  relatedEntityType?: 'vendor' | 'client' | 'employee';
}

export interface ProjectWIP {
  id: string;
  projectId: string;
  projectName: string;
  periodEndDate: string;
  revenueEarned: number;
  costsIncurred: number;
  completionPercentage: number;
  billingStatus: 'not_billed' | 'partially_billed' | 'fully_billed' | 'over_billed';
  contractValue: number;
  billedToDate: number;
  remainingToBill: number;
  overUnderBilledAmount: number;
  notes?: string;
  lastUpdated: string;
  updatedBy: string;
}
