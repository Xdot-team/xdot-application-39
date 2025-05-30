
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, FileText, Calendar, CreditCard, PieChart, BarChart, Receipt } from "lucide-react";

const Finance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Manage financial operations, billing, and project profitability
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$485K</div>
                <p className="text-xs text-muted-foreground">
                  12 pending invoices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125K</div>
                <p className="text-xs text-muted-foreground">
                  -8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from previous year
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Invoice", client: "Georgia DOT", amount: "+$125,000", status: "paid", date: "Oct 20" },
                    { type: "Expense", vendor: "Equipment Rental Co.", amount: "-$15,500", status: "paid", date: "Oct 19" },
                    { type: "Payroll", description: "Weekly Payroll", amount: "-$45,000", status: "processed", date: "Oct 18" },
                    { type: "Invoice", client: "City of Atlanta", amount: "+$85,000", status: "pending", date: "Oct 17" }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.client || transaction.vendor || transaction.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount}
                        </p>
                        <Badge variant={transaction.status === 'paid' || transaction.status === 'processed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Beginning Balance</span>
                    <span className="font-medium">$850,000</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Total Inflows</span>
                    <span className="font-medium">+$325,000</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span className="text-sm">Total Outflows</span>
                    <span className="font-medium">-$185,500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span>Ending Balance</span>
                    <span>$989,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoicing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>
                Create, send, and track project invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full md:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Invoice
                </Button>
                
                <div className="space-y-3">
                  {[
                    { number: "INV-2023-001", client: "Georgia DOT", project: "I-85 Expansion", amount: "$125,000", status: "paid", date: "Oct 15" },
                    { number: "INV-2023-002", client: "City of Atlanta", project: "Peachtree St", amount: "$85,000", status: "pending", date: "Oct 10" },
                    { number: "INV-2023-003", client: "Gwinnett County", project: "Highway 400", amount: "$95,500", status: "sent", date: "Oct 5" }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{invoice.number}</h4>
                        <p className="text-sm text-muted-foreground">
                          {invoice.client} • {invoice.project}
                        </p>
                        <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'destructive' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription>
                Monitor and categorize project expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Materials</h4>
                    <p className="text-2xl font-bold">$85K</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Equipment</h4>
                    <p className="text-2xl font-bold">$25K</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Subcontractors</h4>
                    <p className="text-2xl font-bold">$45K</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Other</h4>
                    <p className="text-2xl font-bold">$8K</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Recent Expenses</h3>
                  <div className="space-y-3">
                    {[
                      { vendor: "Concrete Supply Co.", category: "Materials", amount: "$15,500", project: "I-85 Expansion", date: "Oct 20" },
                      { vendor: "Equipment Rental", category: "Equipment", amount: "$8,200", project: "Peachtree St", date: "Oct 19" },
                      { vendor: "Steel Works Inc.", category: "Materials", amount: "$22,000", project: "Highway 400", date: "Oct 18" }
                    ].map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{expense.vendor}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category} • {expense.project}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{expense.amount}</p>
                          <p className="text-sm text-muted-foreground">{expense.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>
                Process payroll and track labor costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Total Payroll</h4>
                    <p className="text-2xl font-bold">$45K</p>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Regular Hours</h4>
                    <p className="text-2xl font-bold">1,280</p>
                    <p className="text-sm text-muted-foreground">32 employees</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Overtime Hours</h4>
                    <p className="text-2xl font-bold">96</p>
                    <p className="text-sm text-muted-foreground">8 employees</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Payroll by Department</h3>
                  <div className="space-y-3">
                    {[
                      { department: "Field Operations", employees: 18, amount: "$28,500", hours: "720" },
                      { department: "Equipment Operators", employees: 8, amount: "$12,800", hours: "320" },
                      { department: "Administration", employees: 6, amount: "$3,700", hours: "240" }
                    ].map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{dept.department}</p>
                          <p className="text-sm text-muted-foreground">
                            {dept.employees} employees • {dept.hours} hours
                          </p>
                        </div>
                        <p className="font-medium">{dept.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Profit & Loss", description: "Monthly P&L statement", icon: BarChart },
                  { name: "Cash Flow", description: "Cash flow analysis", icon: TrendingUp },
                  { name: "Budget vs Actual", description: "Budget comparison report", icon: PieChart },
                  { name: "Project Profitability", description: "Project-wise profit analysis", icon: DollarSign },
                  { name: "Expense Report", description: "Detailed expense breakdown", icon: Receipt },
                  { name: "Invoice Summary", description: "Invoice status report", icon: FileText }
                ].map((report, index) => {
                  const Icon = report.icon;
                  return (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5" />
                        <h4 className="font-medium">{report.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Generate Report
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>
                Track project budgets and financial forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Project Budget Overview</h3>
                  <div className="space-y-4">
                    {[
                      { project: "I-85 Expansion", budget: "$1.2M", spent: "$950K", remaining: "$250K", percentage: 79 },
                      { project: "Peachtree Street", budget: "$850K", spent: "$620K", remaining: "$230K", percentage: 73 },
                      { project: "Highway 400", budget: "$2.1M", spent: "$1.8M", remaining: "$300K", percentage: 86 }
                    ].map((project, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{project.project}</h4>
                          <Badge variant={project.percentage > 85 ? 'destructive' : project.percentage > 75 ? 'secondary' : 'default'}>
                            {project.percentage}% used
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">{project.budget}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Spent</p>
                            <p className="font-medium">{project.spent}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Remaining</p>
                            <p className="font-medium">{project.remaining}</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div 
                            className={`h-2 rounded-full ${project.percentage > 85 ? 'bg-red-500' : project.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${project.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
