
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileX, DollarSign, Users, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

type BuyoutStatus = 'pending' | 'approved' | 'rejected' | 'awarded';

interface BuyoutItem {
  id: string;
  packageName: string;
  vendor: string;
  amount: number;
  originalEstimate: number;
  variance: number;
  status: BuyoutStatus;
  dueDate: string;
}

export default function Buyout() {
  const [activeTab, setActiveTab] = useState("packages");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock buyout packages data
  const mockBuyoutItems: BuyoutItem[] = [
    { 
      id: "buy-001", 
      packageName: "Concrete Supply", 
      vendor: "Georgia Concrete Co.", 
      amount: 245000, 
      originalEstimate: 260000,
      variance: -15000,
      status: 'pending',
      dueDate: "2025-06-15"
    },
    { 
      id: "buy-002", 
      packageName: "Earthwork", 
      vendor: "Southern Excavation", 
      amount: 178500, 
      originalEstimate: 165000,
      variance: 13500,
      status: 'approved',
      dueDate: "2025-06-10"
    },
    { 
      id: "buy-003", 
      packageName: "Steel Supply", 
      vendor: "Atlanta Steel Solutions", 
      amount: 320000, 
      originalEstimate: 345000,
      variance: -25000,
      status: 'awarded',
      dueDate: "2025-05-30"
    },
    { 
      id: "buy-004", 
      packageName: "Traffic Control", 
      vendor: "SafeRoads Inc.", 
      amount: 87500, 
      originalEstimate: 75000,
      variance: 12500,
      status: 'rejected',
      dueDate: "2025-06-05"
    },
  ];

  // Filter items based on search query
  const filteredItems = searchQuery 
    ? mockBuyoutItems.filter(item => 
        item.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockBuyoutItems;

  // Calculate statistics
  const totalPackages = mockBuyoutItems.length;
  const completedPackages = mockBuyoutItems.filter(item => 
    item.status === 'approved' || item.status === 'awarded').length;
  const totalSavings = mockBuyoutItems.reduce((acc, item) => 
    item.variance < 0 ? acc + Math.abs(item.variance) : acc, 0);
  const totalOverage = mockBuyoutItems.reduce((acc, item) => 
    item.variance > 0 ? acc + item.variance : acc, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getStatusBadge = (status: BuyoutStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'awarded':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Awarded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleApprovePackage = (id: string) => {
    toast.success(`Package ${id} approved for award`);
  };

  const handleRejectPackage = (id: string) => {
    toast.info(`Package ${id} rejected`);
  };
  
  const handleCreatePackage = () => {
    toast.info("Creating new buyout package");
    // Would navigate to a form or open a modal
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="packages" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span>Buyout Packages</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>Cost Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Vendors</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleCreatePackage}>
          <FileCheck className="h-4 w-4 mr-2" />
          New Package
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Packages</CardDescription>
            <CardTitle className="text-2xl">{totalPackages}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {completedPackages} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(mockBuyoutItems.reduce((acc, item) => acc + item.amount, 0))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Against original estimate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Savings</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(totalSavings)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Under estimated values
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Overage</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {formatCurrency(totalOverage)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Over estimated values
            </p>
          </CardContent>
        </Card>
      </div>

      <TabsContent value="packages" className="mt-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Buyout Packages</CardTitle>
            <CardDescription>Manage procurement and vendor awards</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search packages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Package Name</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Vendor</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Est. Variance</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{item.packageName}</td>
                        <td className="px-4 py-2">{item.vendor}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.amount)}</td>
                        <td className={cn(
                          "px-4 py-2 text-right",
                          {"text-green-600": item.variance < 0, "text-red-600": item.variance > 0}
                        )}>
                          {item.variance < 0 
                            ? `${formatCurrency(Math.abs(item.variance))} under` 
                            : `${formatCurrency(item.variance)} over`}
                        </td>
                        <td className="px-4 py-2">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-4 py-2">{item.dueDate}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApprovePackage(item.id)}
                              disabled={item.status === 'approved' || item.status === 'awarded'}
                            >
                              <FileCheck className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRejectPackage(item.id)}
                              disabled={item.status === 'rejected'}
                            >
                              <FileX className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center">
                        No buyout packages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analysis" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>
              Compare buyout results with estimates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-[400px] rounded-md flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Cost Comparison Chart</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Visualization of estimate vs buyout costs would be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vendors" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Management</CardTitle>
            <CardDescription>
              Track and manage vendor performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-[400px] rounded-md flex items-center justify-center">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Vendor Database</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vendor management interface would be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Buyout Schedule</CardTitle>
            <CardDescription>
              Track procurement timeline and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-[400px] rounded-md flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Buyout Timeline</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Buyout schedule chart would be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
