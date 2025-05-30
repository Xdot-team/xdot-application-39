import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BadgeDollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/formatters";
import { useIsMobile } from "@/hooks/use-mobile";

// Import mock data
import { ClientInvoice, PurchaseOrder, VendorInvoice, Transaction, BudgetCategory, ProjectWIP } from "@/types/finance";

// Import finance components
import { FinancialOverview } from "@/components/finance/FinancialOverview";
import { ClientInvoicesTab } from "@/components/finance/ClientInvoicesTab";
import { VendorInvoicesTab } from "@/components/finance/VendorInvoicesTab";
import { PurchaseOrdersTab } from "@/components/finance/PurchaseOrdersTab";
import { TransactionsTab } from "@/components/finance/TransactionsTab";
import { BudgetTab } from "@/components/finance/BudgetTab";
import { PayrollTab } from "@/components/finance/PayrollTab";
import { TaxFormsTab } from "@/components/finance/TaxFormsTab";
import { ReportsTab } from "@/components/finance/ReportsTab";
import { QuickBooksSync } from "@/components/finance/QuickBooksSync";
import { WIPTab } from "@/components/finance/WIPTab";
import MobileWIPView from "@/components/finance/MobileWIPView";

// Mock data for client invoices
const mockClientInvoices: ClientInvoice[] = [
  {
    id: "CI1001",
    projectId: "P1001",
    projectName: "GA-400 Repaving",
    clientId: "CL1001",
    clientName: "Georgia DOT",
    invoiceNumber: "INV-2025-001",
    amount: 125000,
    issueDate: "2025-04-10",
    dueDate: "2025-05-10",
    status: "sent",
    lineItems: [
      { id: "LI1001", description: "Asphalt material", quantity: 500, unitPrice: 150, total: 75000, taxable: false },
      { id: "LI1002", description: "Labor", quantity: 200, unitPrice: 250, total: 50000, taxable: false }
    ]
  },
  {
    id: "CI1002",
    projectId: "P1002",
    projectName: "I-85 Bridge Repair",
    clientId: "CL1001",
    clientName: "Georgia DOT",
    invoiceNumber: "INV-2025-002",
    amount: 87500,
    issueDate: "2025-04-15",
    dueDate: "2025-05-15",
    status: "paid",
    lineItems: [
      { id: "LI2001", description: "Concrete reinforcement", quantity: 350, unitPrice: 150, total: 52500, taxable: false },
      { id: "LI2002", description: "Engineering services", quantity: 140, unitPrice: 250, total: 35000, taxable: false }
    ]
  },
  {
    id: "CI1003",
    projectId: "P1003",
    projectName: "Peachtree Street Improvements",
    clientId: "CL1002",
    clientName: "City of Atlanta",
    invoiceNumber: "INV-2025-003",
    amount: 45000,
    issueDate: "2025-04-18",
    dueDate: "2025-05-18",
    status: "overdue",
    lineItems: [
      { id: "LI3001", description: "Sidewalk construction", quantity: 200, unitPrice: 150, total: 30000, taxable: false },
      { id: "LI3002", description: "Landscaping", quantity: 60, unitPrice: 250, total: 15000, taxable: false }
    ]
  },
  {
    id: "CI1004",
    projectId: "P1004",
    projectName: "Gwinnett County Sidewalk Project",
    clientId: "CL1003",
    clientName: "Gwinnett County",
    invoiceNumber: "INV-2025-004",
    amount: 32500,
    issueDate: "2025-04-22",
    dueDate: "2025-05-22",
    status: "draft",
    lineItems: [
      { id: "LI4001", description: "Concrete work", quantity: 130, unitPrice: 150, total: 19500, taxable: false },
      { id: "LI4002", description: "Site preparation", quantity: 52, unitPrice: 250, total: 13000, taxable: false }
    ]
  },
  {
    id: "CI1005",
    projectId: "P1005",
    projectName: "Augusta Highway Extension",
    clientId: "CL1001",
    clientName: "Georgia DOT",
    invoiceNumber: "INV-2025-005",
    amount: 210000,
    issueDate: "2025-04-25",
    dueDate: "2025-05-25",
    status: "sent",
    lineItems: [
      { id: "LI5001", description: "Road construction", quantity: 800, unitPrice: 150, total: 120000, taxable: false },
      { id: "LI5002", description: "Engineering", quantity: 360, unitPrice: 250, total: 90000, taxable: false }
    ]
  },
  {
    id: "CI1006",
    projectId: "P1006",
    projectName: "Macon Street Repair",
    clientId: "CL1004",
    clientName: "City of Macon",
    invoiceNumber: "INV-2025-006",
    amount: 54000,
    issueDate: "2025-05-01",
    dueDate: "2025-06-01",
    status: "sent",
    lineItems: [
      { id: "LI6001", description: "Pothole repair", quantity: 180, unitPrice: 120, total: 21600, taxable: false },
      { id: "LI6002", description: "Road resurfacing", quantity: 270, unitPrice: 120, total: 32400, taxable: false }
    ]
  },
  {
    id: "CI1007",
    projectId: "P1007",
    projectName: "Savannah Harbor Project",
    clientId: "CL1005",
    clientName: "Savannah Port Authority",
    invoiceNumber: "INV-2025-007",
    amount: 375000,
    issueDate: "2025-05-05",
    dueDate: "2025-06-05",
    status: "paid",
    lineItems: [
      { id: "LI7001", description: "Dredging operations", quantity: 1, unitPrice: 250000, total: 250000, taxable: false },
      { id: "LI7002", description: "Engineering services", quantity: 500, unitPrice: 250, total: 125000, taxable: false }
    ]
  },
  {
    id: "CI1008",
    projectId: "P1008",
    projectName: "Athens Municipal Building",
    clientId: "CL1006",
    clientName: "City of Athens",
    invoiceNumber: "INV-2025-008",
    amount: 95000,
    issueDate: "2025-05-10",
    dueDate: "2025-06-10",
    status: "draft",
    lineItems: [
      { id: "LI8001", description: "Foundation work", quantity: 1, unitPrice: 45000, total: 45000, taxable: false },
      { id: "LI8002", description: "Initial framing", quantity: 1, unitPrice: 50000, total: 50000, taxable: false }
    ]
  },
  {
    id: "CI1009",
    projectId: "P1009",
    projectName: "Columbus River Walk",
    clientId: "CL1007",
    clientName: "Columbus Parks Dept",
    invoiceNumber: "INV-2025-009",
    amount: 48500,
    issueDate: "2025-05-15",
    dueDate: "2025-06-15",
    status: "sent",
    lineItems: [
      { id: "LI9001", description: "Walkway construction", quantity: 1200, unitPrice: 25, total: 30000, taxable: false },
      { id: "LI9002", description: "Lighting installation", quantity: 74, unitPrice: 250, total: 18500, taxable: false }
    ]
  },
  {
    id: "CI1010",
    projectId: "P1010",
    projectName: "Rome Public Library",
    clientId: "CL1008",
    clientName: "City of Rome",
    invoiceNumber: "INV-2025-010",
    amount: 120000,
    issueDate: "2025-05-20",
    dueDate: "2025-06-20",
    status: "cancelled",
    lineItems: [
      { id: "LI10001", description: "Main structure", quantity: 1, unitPrice: 80000, total: 80000, taxable: false },
      { id: "LI10002", description: "Interior work", quantity: 1, unitPrice: 40000, total: 40000, taxable: false }
    ]
  }
];

// Mock data for purchase orders
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO1001",
    poNumber: "PO-2025-001",
    vendorId: "V1001",
    vendorName: "Georgia Materials Supply",
    projectId: "P1001",
    projectName: "GA-400 Repaving",
    issueDate: "2025-03-25",
    expectedDeliveryDate: "2025-04-10",
    status: "received",
    totalAmount: 75000,
    items: [
      { 
        id: "POI1001", 
        description: "Asphalt materials", 
        quantity: 500, 
        unitPrice: 150, 
        total: 75000,
        deliveryStatus: "complete",
        receivedQuantity: 500
      }
    ],
    approvedBy: "John Manager",
    approvedDate: "2025-03-24"
  },
  {
    id: "PO1002",
    poNumber: "PO-2025-002",
    vendorId: "V1002",
    vendorName: "Southeast Construction Equipment",
    projectId: "P1001",
    projectName: "GA-400 Repaving",
    issueDate: "2025-03-28",
    expectedDeliveryDate: "2025-04-12",
    status: "issued",
    totalAmount: 12500,
    items: [
      { 
        id: "POI2001", 
        description: "Equipment rental", 
        quantity: 5, 
        unitPrice: 2500, 
        total: 12500,
        deliveryStatus: "pending",
        receivedQuantity: 0
      }
    ],
    approvedBy: "Sarah Director",
    approvedDate: "2025-03-27"
  },
  {
    id: "PO1003",
    poNumber: "PO-2025-003",
    vendorId: "V1003",
    vendorName: "Atlanta Engineering Consultants",
    projectId: "P1002",
    projectName: "I-85 Bridge Repair",
    issueDate: "2025-04-02",
    expectedDeliveryDate: "2025-04-20",
    status: "received",
    totalAmount: 35000,
    items: [
      { 
        id: "POI3001", 
        description: "Engineering services", 
        quantity: 140, 
        unitPrice: 250, 
        total: 35000,
        deliveryStatus: "complete",
        receivedQuantity: 140
      }
    ],
    approvedBy: "John Manager",
    approvedDate: "2025-04-01"
  },
  {
    id: "PO1004",
    poNumber: "PO-2025-004",
    vendorId: "V1004",
    vendorName: "Southern Concrete Solutions",
    projectId: "P1002",
    projectName: "I-85 Bridge Repair",
    issueDate: "2025-04-05",
    expectedDeliveryDate: "2025-04-15",
    status: "received",
    totalAmount: 52500,
    items: [
      { 
        id: "POI4001", 
        description: "Concrete materials", 
        quantity: 350, 
        unitPrice: 150, 
        total: 52500,
        deliveryStatus: "complete",
        receivedQuantity: 350
      }
    ],
    approvedBy: "Sarah Director",
    approvedDate: "2025-04-04"
  },
  {
    id: "PO1005",
    poNumber: "PO-2025-005",
    vendorId: "V1005",
    vendorName: "Georgia Safety Equipment",
    issueDate: "2025-04-10",
    expectedDeliveryDate: "2025-04-25",
    status: "draft",
    totalAmount: 7500,
    items: [
      { 
        id: "POI5001", 
        description: "Safety barriers", 
        quantity: 50, 
        unitPrice: 150, 
        total: 7500,
        deliveryStatus: "pending",
        receivedQuantity: 0 
      }
    ]
  }
];

// Mock data for vendor invoices
const mockVendorInvoices: VendorInvoice[] = [
  {
    id: "VI1001",
    vendorId: "V1001",
    vendorName: "Georgia Materials Supply",
    invoiceNumber: "GMS-5432",
    purchaseOrderId: "PO1001",
    amount: 75000,
    issueDate: "2025-04-11",
    dueDate: "2025-05-11",
    status: "paid"
  },
  {
    id: "VI1002",
    vendorId: "V1002",
    vendorName: "Southeast Construction Equipment",
    invoiceNumber: "SCE-1234",
    purchaseOrderId: "PO1002",
    amount: 12500,
    issueDate: "2025-04-13",
    dueDate: "2025-05-13",
    status: "approved"
  },
  {
    id: "VI1003",
    vendorId: "V1003",
    vendorName: "Atlanta Engineering Consultants",
    invoiceNumber: "AEC-7890",
    purchaseOrderId: "PO1003",
    amount: 35000,
    issueDate: "2025-04-21",
    dueDate: "2025-05-21",
    status: "pending"
  },
  {
    id: "VI1004",
    vendorId: "V1004",
    vendorName: "Southern Concrete Solutions",
    invoiceNumber: "SCS-5678",
    purchaseOrderId: "PO1004",
    amount: 52500,
    issueDate: "2025-04-16",
    dueDate: "2025-05-16",
    status: "paid"
  },
  {
    id: "VI1005",
    vendorId: "V1006",
    vendorName: "Atlanta Office Supplies",
    invoiceNumber: "AOS-2468",
    amount: 1250,
    issueDate: "2025-04-15",
    dueDate: "2025-05-15",
    status: "paid"
  },
  {
    id: "VI1006",
    vendorId: "V1007",
    vendorName: "Georgia Utilities",
    invoiceNumber: "GU-1357",
    amount: 3500,
    issueDate: "2025-04-20",
    dueDate: "2025-05-05",
    status: "pending"
  }
];

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "T1001",
    date: "2025-04-11",
    description: "Payment received from Georgia DOT",
    category: "Client Payments",
    categoryName: "Client Payments",
    amount: 87500,
    type: "income",
    relatedToId: "CI1002",
    relatedToType: "client_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking",
    createdBy: "Jane Accountant",
    createdAt: "2025-04-11T10:30:00",
    status: "cleared"
  },
  {
    id: "T1002",
    date: "2025-04-16",
    description: "Payment to Southern Concrete Solutions",
    category: "Material Costs",
    categoryName: "Material Costs",
    amount: 52500,
    type: "expense",
    relatedToId: "VI1004",
    relatedToType: "vendor_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking",
    createdBy: "Jane Accountant",
    createdAt: "2025-04-16T14:15:00",
    status: "cleared"
  },
  {
    id: "T1003",
    date: "2025-04-11",
    description: "Payment to Georgia Materials Supply",
    category: "Material Costs",
    categoryName: "Material Costs",
    amount: 75000,
    type: "expense",
    relatedToId: "VI1001",
    relatedToType: "vendor_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking",
    createdBy: "Jane Accountant",
    createdAt: "2025-04-11T11:45:00",
    status: "cleared"
  },
  {
    id: "T1004",
    date: "2025-04-15",
    description: "Payment to Atlanta Office Supplies",
    category: "Office Expenses",
    categoryName: "Office Expenses",
    amount: 1250,
    type: "expense",
    relatedToId: "VI1005",
    relatedToType: "vendor_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking",
    createdBy: "Jane Accountant",
    createdAt: "2025-04-15T09:20:00",
    status: "cleared"
  },
  {
    id: "T1005",
    date: "2025-05-05",
    description: "Payment received from Savannah Port Authority",
    category: "Client Payments",
    categoryName: "Client Payments",
    amount: 375000,
    type: "income",
    relatedToId: "CI1007",
    relatedToType: "client_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking",
    createdBy: "Jane Accountant",
    createdAt: "2025-05-05T13:10:00",
    status: "cleared"
  }
];

// Mock data for budget categories
const mockBudgetCategories: BudgetCategory[] = [
  {
    id: "BC1001",
    name: "Client Payments",
    budgeted: 1500000,
    spent: 462500,
    remaining: 1037500,
    type: "income"
  },
  {
    id: "BC2001",
    name: "Material Costs",
    budgeted: 600000,
    spent: 127500,
    remaining: 472500,
    type: "expense"
  },
  {
    id: "BC2002",
    name: "Equipment Rental",
    budgeted: 150000,
    spent: 12500,
    remaining: 137500,
    type: "expense"
  },
  {
    id: "BC2003",
    name: "Labor",
    budgeted: 450000,
    spent: 0,
    remaining: 450000,
    type: "expense"
  },
  {
    id: "BC2004",
    name: "Office Expenses",
    budgeted: 25000,
    spent: 1250,
    remaining: 23750,
    type: "expense"
  },
  {
    id: "BC2005",
    name: "Professional Services",
    budgeted: 200000,
    spent: 35000,
    remaining: 165000,
    type: "expense"
  }
];

// New mock data for WIP reports
const mockWIPReports: ProjectWIP[] = [
  {
    id: "WIP1001",
    projectId: "P1001",
    projectName: "GA-400 Repaving",
    periodEndDate: "2025-05-15",
    revenueEarned: 85000,
    costsIncurred: 72500,
    completionPercentage: 68,
    billingStatus: "partially_billed",
    contractValue: 125000,
    billedToDate: 75000,
    billingToDate: 75000,
    remainingToBill: 50000,
    overUnderBilledAmount: -10000,
    lastUpdated: "2025-05-16",
    updatedBy: "Jane Accountant"
  },
  {
    id: "WIP1002",
    projectId: "P1003",
    projectName: "Peachtree Street Improvements",
    periodEndDate: "2025-05-15",
    revenueEarned: 28000,
    costsIncurred: 26500,
    completionPercentage: 62,
    billingStatus: "over_billed",
    contractValue: 45000,
    billedToDate: 32000,
    billingToDate: 32000,
    remainingToBill: 13000,
    overUnderBilledAmount: 4000,
    lastUpdated: "2025-05-16",
    updatedBy: "Jane Accountant"
  },
  {
    id: "WIP1003",
    projectId: "P1010",
    projectName: "Rome Public Library",
    periodEndDate: "2025-05-15",
    revenueEarned: 60000,
    costsIncurred: 55000,
    completionPercentage: 50,
    billingStatus: "not_billed",
    contractValue: 120000,
    billedToDate: 0,
    billingToDate: 0,
    remainingToBill: 120000,
    overUnderBilledAmount: -60000,
    lastUpdated: "2025-05-16",
    updatedBy: "Jane Accountant"
  }
];

const Finance = () => {
  const [activeTab, setActiveTab] = useState("clientInvoices");
  const { authState } = useAuth();
  const isMobile = useIsMobile();
  
  // Access control
  const isAccountant = authState.user?.role === 'accountant';
  const isManager = authState.user?.role === 'project_manager' || authState.user?.role === 'admin';
  const canEdit = isAccountant;
  const canView = isAccountant || isManager;
  
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-semibold mb-2">Access Restricted</h1>
        <p>You don't have permission to view financial information.</p>
      </div>
    );
  }
  
  const lastSync = "2025-05-15T10:30:00";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Manage financial data, invoices, and transactions</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          )}
          <QuickBooksSync lastSync={lastSync} />
        </div>
      </div>

      {/* Financial Overview Dashboard */}
      <FinancialOverview 
        clientInvoices={mockClientInvoices} 
        vendorInvoices={mockVendorInvoices} 
        transactions={mockTransactions} 
      />

      {/* Main Finance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className={`${isMobile ? "flex w-full overflow-x-auto" : "grid grid-cols-4 md:grid-cols-9 lg:grid-cols-9"}`}>
          <TabsTrigger value="clientInvoices">Client Invoices</TabsTrigger>
          <TabsTrigger value="vendorInvoices">Vendor Invoices</TabsTrigger>
          <TabsTrigger value="purchaseOrders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="transactions">General Ledger</TabsTrigger>
          <TabsTrigger value="wip">WIP</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="taxForms">Tax Forms</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Client Invoices Tab */}
        <TabsContent value="clientInvoices">
          <ClientInvoicesTab clientInvoices={mockClientInvoices} canEdit={canEdit} />
        </TabsContent>

        {/* Vendor Invoices Tab */}
        <TabsContent value="vendorInvoices">
          <VendorInvoicesTab vendorInvoices={mockVendorInvoices} canEdit={canEdit} />
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchaseOrders">
          <PurchaseOrdersTab purchaseOrders={mockPurchaseOrders} canEdit={canEdit} />
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <TransactionsTab transactions={mockTransactions} canEdit={canEdit} />
        </TabsContent>

        {/* WIP Tab */}
        <TabsContent value="wip">
          {isMobile ? (
            <MobileWIPView wipReports={mockWIPReports} />
          ) : (
            <WIPTab wipReports={mockWIPReports} canEdit={canEdit} />
          )}
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget">
          <BudgetTab budgetCategories={mockBudgetCategories} canEdit={canEdit} />
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <PayrollTab canEdit={canEdit} />
        </TabsContent>

        {/* Tax Forms Tab */}
        <TabsContent value="taxForms">
          <TaxFormsTab canEdit={canEdit} />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <ReportsTab canEdit={canEdit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
