
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, DollarSign, FileText, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/formatters";
import { ClientInvoice, PurchaseOrder, VendorInvoice, Transaction, BudgetCategory } from "@/types/finance";

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
      { id: "LI1001", description: "Asphalt material", quantity: 500, unitPrice: 150, total: 75000 },
      { id: "LI1002", description: "Labor", quantity: 200, unitPrice: 250, total: 50000 }
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
      { id: "LI2001", description: "Concrete reinforcement", quantity: 350, unitPrice: 150, total: 52500 },
      { id: "LI2002", description: "Engineering services", quantity: 140, unitPrice: 250, total: 35000 }
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
      { id: "LI3001", description: "Sidewalk construction", quantity: 200, unitPrice: 150, total: 30000 },
      { id: "LI3002", description: "Landscaping", quantity: 60, unitPrice: 250, total: 15000 }
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
      { id: "LI4001", description: "Concrete work", quantity: 130, unitPrice: 150, total: 19500 },
      { id: "LI4002", description: "Site preparation", quantity: 52, unitPrice: 250, total: 13000 }
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
      { id: "LI5001", description: "Road construction", quantity: 800, unitPrice: 150, total: 120000 },
      { id: "LI5002", description: "Engineering", quantity: 360, unitPrice: 250, total: 90000 }
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
      { id: "LI6001", description: "Pothole repair", quantity: 180, unitPrice: 120, total: 21600 },
      { id: "LI6002", description: "Road resurfacing", quantity: 270, unitPrice: 120, total: 32400 }
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
      { id: "LI7001", description: "Dredging operations", quantity: 1, unitPrice: 250000, total: 250000 },
      { id: "LI7002", description: "Engineering services", quantity: 500, unitPrice: 250, total: 125000 }
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
      { id: "LI8001", description: "Foundation work", quantity: 1, unitPrice: 45000, total: 45000 },
      { id: "LI8002", description: "Initial framing", quantity: 1, unitPrice: 50000, total: 50000 }
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
      { id: "LI9001", description: "Walkway construction", quantity: 1200, unitPrice: 25, total: 30000 },
      { id: "LI9002", description: "Lighting installation", quantity: 74, unitPrice: 250, total: 18500 }
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
      { id: "LI10001", description: "Main structure", quantity: 1, unitPrice: 80000, total: 80000 },
      { id: "LI10002", description: "Interior work", quantity: 1, unitPrice: 40000, total: 40000 }
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
      { id: "POI1001", description: "Asphalt materials", quantity: 500, unitPrice: 150, total: 75000 }
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
      { id: "POI2001", description: "Equipment rental", quantity: 5, unitPrice: 2500, total: 12500 }
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
      { id: "POI3001", description: "Engineering services", quantity: 140, unitPrice: 250, total: 35000 }
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
      { id: "POI4001", description: "Concrete materials", quantity: 350, unitPrice: 150, total: 52500 }
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
      { id: "POI5001", description: "Safety barriers", quantity: 50, unitPrice: 150, total: 7500 }
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
    categoryId: "CAT1001",
    categoryName: "Client Payments",
    amount: 87500,
    type: "income",
    relatedToId: "CI1002",
    relatedToType: "client_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking"
  },
  {
    id: "T1002",
    date: "2025-04-16",
    description: "Payment to Southern Concrete Solutions",
    categoryId: "CAT2001",
    categoryName: "Material Costs",
    amount: 52500,
    type: "expense",
    relatedToId: "VI1004",
    relatedToType: "vendor_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking"
  },
  {
    id: "T1003",
    date: "2025-04-11",
    description: "Payment to Georgia Materials Supply",
    categoryId: "CAT2001",
    categoryName: "Material Costs",
    amount: 75000,
    type: "expense",
    relatedToId: "VI1001",
    relatedToType: "vendor_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking"
  },
  {
    id: "T1004",
    date: "2025-04-15",
    description: "Payment to Atlanta Office Supplies",
    categoryId: "CAT2002",
    categoryName: "Office Expenses",
    amount: 1250,
    type: "expense",
    relatedToId: "VI1005",
    relatedToType: "vendor_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking"
  },
  {
    id: "T1005",
    date: "2025-05-05",
    description: "Payment received from Savannah Port Authority",
    categoryId: "CAT1001",
    categoryName: "Client Payments",
    amount: 375000,
    type: "income",
    relatedToId: "CI1007",
    relatedToType: "client_invoice",
    accountId: "ACC1001",
    accountName: "Business Checking"
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

const Finance = () => {
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    clientInvoices: "",
    vendorInvoices: "",
    purchaseOrders: "",
    transactions: "",
    budget: ""
  });
  
  const [sortConfig, setSortConfig] = useState<{
    tab: string;
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const { authState } = useAuth();
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
  
  // Handler for search functionality
  const handleSearch = (tab: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [tab]: value }));
  };
  
  // Handler for sorting
  const requestSort = (tab: string, key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.tab === tab && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ tab, key, direction });
  };
  
  // Function to filter data based on search term
  const filterData = <T extends Record<string, any>>(data: T[], tab: string, searchableFields: (keyof T)[]) => {
    const term = searchTerms[tab].toLowerCase();
    
    if (!term) return data;
    
    return data.filter(item => 
      searchableFields.some(field => 
        String(item[field]).toLowerCase().includes(term)
      )
    );
  };
  
  // Function to sort data
  const sortData = <T extends Record<string, any>>(data: T[], tab: string, defaultKey: keyof T) => {
    if (!sortConfig || sortConfig.tab !== tab) {
      return [...data].sort((a, b) => String(a[defaultKey]).localeCompare(String(b[defaultKey])));
    }
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };
  
  // Client Invoices tab data processing
  const filteredClientInvoices = filterData(
    mockClientInvoices,
    'clientInvoices',
    ['clientName', 'projectName', 'invoiceNumber', 'amount', 'status']
  );
  
  const sortedClientInvoices = sortData(filteredClientInvoices, 'clientInvoices', 'dueDate');
  
  // Vendor Invoices tab data processing
  const filteredVendorInvoices = filterData(
    mockVendorInvoices,
    'vendorInvoices',
    ['vendorName', 'invoiceNumber', 'amount', 'status']
  );
  
  const sortedVendorInvoices = sortData(filteredVendorInvoices, 'vendorInvoices', 'dueDate');
  
  // Purchase Orders tab data processing
  const filteredPurchaseOrders = filterData(
    mockPurchaseOrders,
    'purchaseOrders',
    ['vendorName', 'poNumber', 'totalAmount', 'status']
  );
  
  const sortedPurchaseOrders = sortData(filteredPurchaseOrders, 'purchaseOrders', 'issueDate');
  
  // Transactions tab data processing
  const filteredTransactions = filterData(
    mockTransactions,
    'transactions',
    ['description', 'categoryName', 'amount', 'type']
  );
  
  const sortedTransactions = sortData(filteredTransactions, 'transactions', 'date');
  
  // Budget tab data processing
  const filteredBudgetCategories = filterData(
    mockBudgetCategories,
    'budget',
    ['name', 'type']
  );
  
  const sortedBudgetCategories = sortData(filteredBudgetCategories, 'budget', 'name');
  
  // Get status color for client invoices
  const getClientInvoiceStatusColor = (status: ClientInvoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status color for vendor invoices
  const getVendorInvoiceStatusColor = (status: VendorInvoice['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status color for purchase orders
  const getPurchaseOrderStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort indicator component
  const SortIndicator = ({ tab, column }: { tab: string; column: string }) => {
    if (sortConfig?.tab !== tab || sortConfig?.key !== column) return null;
    
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

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
          <Button variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            QuickBooks Sync
          </Button>
        </div>
      </div>

      {/* Financial Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding Invoices</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(
                mockClientInvoices
                  .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
                  .reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {mockClientInvoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length} invoices pending payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accounts Payable</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(
                mockVendorInvoices
                  .filter(inv => inv.status === 'pending' || inv.status === 'approved')
                  .reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {mockVendorInvoices.filter(inv => inv.status === 'pending' || inv.status === 'approved').length} invoices to be paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue (MTD)</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(
                mockTransactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {mockTransactions.filter(t => t.type === 'income').length} payment transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expenses (MTD)</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(
                mockTransactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {mockTransactions.filter(t => t.type === 'expense').length} expense transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Finance Tabs */}
      <Tabs defaultValue="clientInvoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clientInvoices">Client Invoices</TabsTrigger>
          <TabsTrigger value="vendorInvoices">Vendor Invoices</TabsTrigger>
          <TabsTrigger value="purchaseOrders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="transactions">General Ledger</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        {/* Client Invoices Tab */}
        <TabsContent value="clientInvoices">
          <Card>
            <CardHeader>
              <CardTitle>Client Invoices</CardTitle>
              <CardDescription>Manage invoices sent to clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search invoices..."
                    className="pl-8"
                    value={searchTerms.clientInvoices}
                    onChange={(e) => handleSearch('clientInvoices', e.target.value)}
                  />
                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Filter by Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Draft</Badge>
                          <Badge variant="outline">Sent</Badge>
                          <Badge variant="outline">Paid</Badge>
                          <Badge variant="outline">Overdue</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Date Range</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="grid gap-1">
                            <label htmlFor="from" className="text-xs">From</label>
                            <Input id="from" placeholder="YYYY-MM-DD" />
                          </div>
                          <div className="grid gap-1">
                            <label htmlFor="to" className="text-xs">To</label>
                            <Input id="to" placeholder="YYYY-MM-DD" />
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('clientInvoices', 'invoiceNumber')}
                      >
                        Invoice #<SortIndicator tab="clientInvoices" column="invoiceNumber" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('clientInvoices', 'clientName')}
                      >
                        Client<SortIndicator tab="clientInvoices" column="clientName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('clientInvoices', 'projectName')}
                      >
                        Project<SortIndicator tab="clientInvoices" column="projectName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('clientInvoices', 'issueDate')}
                      >
                        Issue Date<SortIndicator tab="clientInvoices" column="issueDate" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('clientInvoices', 'dueDate')}
                      >
                        Due Date<SortIndicator tab="clientInvoices" column="dueDate" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('clientInvoices', 'amount')}
                      >
                        Amount<SortIndicator tab="clientInvoices" column="amount" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('clientInvoices', 'status')}
                      >
                        Status<SortIndicator tab="clientInvoices" column="status" />
                      </TableHead>
                      {canEdit && <TableHead className="w-[100px]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedClientInvoices.length > 0 ? (
                      sortedClientInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.clientName}</TableCell>
                          <TableCell>{invoice.projectName}</TableCell>
                          <TableCell>{invoice.issueDate}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={getClientInvoiceStatusColor(invoice.status)}
                              variant="outline"
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          {canEdit && (
                            <TableCell>
                              <Button variant="ghost" size="sm">View</Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-4">
                          No invoices found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedClientInvoices.length} of {mockClientInvoices.length} invoices
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Vendor Invoices Tab */}
        <TabsContent value="vendorInvoices">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Invoices</CardTitle>
              <CardDescription>Manage invoices received from vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search vendor invoices..."
                    className="pl-8"
                    value={searchTerms.vendorInvoices}
                    onChange={(e) => handleSearch('vendorInvoices', e.target.value)}
                  />
                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('vendorInvoices', 'invoiceNumber')}
                      >
                        Invoice #<SortIndicator tab="vendorInvoices" column="invoiceNumber" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('vendorInvoices', 'vendorName')}
                      >
                        Vendor<SortIndicator tab="vendorInvoices" column="vendorName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('vendorInvoices', 'purchaseOrderId')}
                      >
                        PO #<SortIndicator tab="vendorInvoices" column="purchaseOrderId" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('vendorInvoices', 'issueDate')}
                      >
                        Issue Date<SortIndicator tab="vendorInvoices" column="issueDate" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('vendorInvoices', 'dueDate')}
                      >
                        Due Date<SortIndicator tab="vendorInvoices" column="dueDate" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('vendorInvoices', 'amount')}
                      >
                        Amount<SortIndicator tab="vendorInvoices" column="amount" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('vendorInvoices', 'status')}
                      >
                        Status<SortIndicator tab="vendorInvoices" column="status" />
                      </TableHead>
                      {canEdit && <TableHead className="w-[100px]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedVendorInvoices.length > 0 ? (
                      sortedVendorInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.vendorName}</TableCell>
                          <TableCell>{invoice.purchaseOrderId || "N/A"}</TableCell>
                          <TableCell>{invoice.issueDate}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={getVendorInvoiceStatusColor(invoice.status)}
                              variant="outline"
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          {canEdit && (
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">View</Button>
                                {(invoice.status === 'pending' || invoice.status === 'approved') && (
                                  <Button variant="outline" size="sm">Pay</Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-4">
                          No vendor invoices found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedVendorInvoices.length} of {mockVendorInvoices.length} vendor invoices
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchaseOrders">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Manage purchase orders to vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search purchase orders..."
                    className="pl-8"
                    value={searchTerms.purchaseOrders}
                    onChange={(e) => handleSearch('purchaseOrders', e.target.value)}
                  />
                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                
                {canEdit && (
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    New PO
                  </Button>
                )}
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('purchaseOrders', 'poNumber')}
                      >
                        PO #<SortIndicator tab="purchaseOrders" column="poNumber" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('purchaseOrders', 'vendorName')}
                      >
                        Vendor<SortIndicator tab="purchaseOrders" column="vendorName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('purchaseOrders', 'projectName')}
                      >
                        Project<SortIndicator tab="purchaseOrders" column="projectName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('purchaseOrders', 'issueDate')}
                      >
                        Issue Date<SortIndicator tab="purchaseOrders" column="issueDate" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('purchaseOrders', 'totalAmount')}
                      >
                        Amount<SortIndicator tab="purchaseOrders" column="totalAmount" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('purchaseOrders', 'status')}
                      >
                        Status<SortIndicator tab="purchaseOrders" column="status" />
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPurchaseOrders.length > 0 ? (
                      sortedPurchaseOrders.map((po) => (
                        <TableRow key={po.id}>
                          <TableCell>{po.poNumber}</TableCell>
                          <TableCell>{po.vendorName}</TableCell>
                          <TableCell>{po.projectName || "N/A"}</TableCell>
                          <TableCell>{po.issueDate}</TableCell>
                          <TableCell className="text-right">{formatCurrency(po.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={getPurchaseOrderStatusColor(po.status)}
                              variant="outline"
                            >
                              {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="sm">View</Button>
                              {canEdit && po.status === 'draft' && (
                                <Button variant="outline" size="sm">Issue</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No purchase orders found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedPurchaseOrders.length} of {mockPurchaseOrders.length} purchase orders
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>General Ledger</CardTitle>
              <CardDescription>View all financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerms.transactions}
                    onChange={(e) => handleSearch('transactions', e.target.value)}
                  />
                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date Range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Select Date Range</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="grid gap-1">
                            <label htmlFor="from-date" className="text-xs">From</label>
                            <Input id="from-date" placeholder="YYYY-MM-DD" />
                          </div>
                          <div className="grid gap-1">
                            <label htmlFor="to-date" className="text-xs">To</label>
                            <Input id="to-date" placeholder="YYYY-MM-DD" />
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Apply Range</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('transactions', 'date')}
                      >
                        Date<SortIndicator tab="transactions" column="date" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('transactions', 'description')}
                      >
                        Description<SortIndicator tab="transactions" column="description" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('transactions', 'categoryName')}
                      >
                        Category<SortIndicator tab="transactions" column="categoryName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('transactions', 'accountName')}
                      >
                        Account<SortIndicator tab="transactions" column="accountName" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('transactions', 'type')}
                      >
                        Type<SortIndicator tab="transactions" column="type" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('transactions', 'amount')}
                      >
                        Amount<SortIndicator tab="transactions" column="amount" />
                      </TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length > 0 ? (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.categoryName}</TableCell>
                          <TableCell>{transaction.accountName}</TableCell>
                          <TableCell>
                            <Badge
                              className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              variant="outline"
                            >
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {transaction.relatedToType && (
                              <Button variant="ghost" size="sm">
                                {transaction.relatedToType === 'client_invoice' ? 'Invoice' : 
                                 transaction.relatedToType === 'vendor_invoice' ? 'Bill' : 'PO'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No transactions found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedTransactions.length} of {mockTransactions.length} transactions
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track budget usage across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search budget categories..."
                    className="pl-8"
                    value={searchTerms.budget}
                    onChange={(e) => handleSearch('budget', e.target.value)}
                  />
                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Category Type</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">All</Badge>
                          <Badge variant="outline">Income</Badge>
                          <Badge variant="outline">Expense</Badge>
                        </div>
                      </div>
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('budget', 'name')}
                      >
                        Category<SortIndicator tab="budget" column="name" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort('budget', 'type')}
                      >
                        Type<SortIndicator tab="budget" column="type" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('budget', 'budgeted')}
                      >
                        Budgeted<SortIndicator tab="budget" column="budgeted" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('budget', 'spent')}
                      >
                        Actual<SortIndicator tab="budget" column="spent" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort('budget', 'remaining')}
                      >
                        Remaining<SortIndicator tab="budget" column="remaining" />
                      </TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedBudgetCategories.length > 0 ? (
                      sortedBudgetCategories.map((category) => {
                        const percentUsed = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
                        return (
                          <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                variant="outline"
                              >
                                {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(category.budgeted)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(category.spent)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(category.remaining)}</TableCell>
                            <TableCell>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={cn(
                                    "h-2.5 rounded-full",
                                    category.type === 'income' ? 'bg-green-600' : 'bg-blue-600'
                                  )}
                                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-center mt-1">{percentUsed.toFixed(1)}%</p>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No budget categories found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedBudgetCategories.length} of {mockBudgetCategories.length} budget categories
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
