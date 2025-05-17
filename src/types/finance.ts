
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
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
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
}

export interface PurchaseOrderItem {
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
  type: 'income' | 'expense';
  relatedToId?: string;
  relatedToType?: 'client_invoice' | 'vendor_invoice' | 'purchase_order';
  accountId: string;
  accountName: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  type: 'income' | 'expense';
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit' | 'other';
  balance: number;
}
