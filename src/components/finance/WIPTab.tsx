
import { useState } from "react";
import { ProjectWIP } from "@/types/finance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableTable } from "@/components/finance/SortableTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { FileText, Download, Filter, BarChart3, Calculator, FileBarChart } from "lucide-react";
import { SearchFilter } from "@/components/finance/SearchFilter";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import { WIPDetails } from "@/components/finance/WIPDetails";

interface WIPTabProps {
  wipReports: ProjectWIP[];
  canEdit: boolean;
}

export const WIPTab = ({ wipReports, canEdit }: WIPTabProps) => {
  const [activeView, setActiveView] = useState<"table" | "cards" | "chart">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "projectName", direction: "asc" });
  const [selectedWIP, setSelectedWIP] = useState<ProjectWIP | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter reports based on search term
  const filteredReports = wipReports.filter(
    (report) =>
      report.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.billingStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort reports based on sort configuration
  const sortedReports = [...filteredReports].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof ProjectWIP];
    const bValue = b[sortConfig.key as keyof ProjectWIP];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortConfig.direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      if (sortConfig.direction === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle report details
  const handleViewDetails = (report: ProjectWIP) => {
    setSelectedWIP(report);
    setIsDetailsOpen(true);
  };

  // Status badge color mapping
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "not_billed":
        return "bg-yellow-500";
      case "partially_billed":
        return "bg-blue-500";
      case "fully_billed":
        return "bg-green-500";
      case "over_billed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format billing status for display
  const formatBillingStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Prepare data for chart
  const chartData = sortedReports.map((report) => ({
    name: report.projectName,
    revenue: report.revenueEarned,
    cost: report.costsIncurred,
    profit: report.revenueEarned - report.costsIncurred,
    completion: report.completionPercentage,
  }));

  // Table columns configuration
  const columns = [
    {
      key: "projectName",
      header: "Project",
      cell: (report: ProjectWIP) => (
        <div>
          <div className="font-medium">{report.projectName}</div>
          <div className="text-sm text-muted-foreground">{report.projectId}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "completionPercentage",
      header: "Completion",
      cell: (report: ProjectWIP) => formatPercent(report.completionPercentage),
      sortable: true,
    },
    {
      key: "revenueEarned",
      header: "Revenue Earned",
      cell: (report: ProjectWIP) => formatCurrency(report.revenueEarned),
      sortable: true,
    },
    {
      key: "costsIncurred",
      header: "Costs Incurred",
      cell: (report: ProjectWIP) => formatCurrency(report.costsIncurred),
      sortable: true,
    },
    {
      key: "overUnderBilledAmount",
      header: "Over/Under Billed",
      cell: (report: ProjectWIP) => {
        const amount = report.overUnderBilledAmount;
        const isPositive = amount >= 0;
        return (
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {formatCurrency(amount)}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "billingStatus",
      header: "Billing Status",
      cell: (report: ProjectWIP) => (
        <Badge className={getBadgeColor(report.billingStatus)}>
          {formatBillingStatus(report.billingStatus)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "",
      cell: (report: ProjectWIP) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewDetails(report)}>
            <span className="sr-only">View details</span>
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  // Correctly handle the search filter onChange event
  // This function needs to provide a callback that accepts just the string value
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs
          value={activeView}
          onValueChange={(v) => setActiveView(v as "table" | "cards" | "chart")}
        >
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <SearchFilter
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canEdit && (
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New WIP Report
            </Button>
          )}
        </div>
      </div>

      {/* Links to related modules */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" className="bg-slate-100" asChild>
          <Link to="/projects">
            <BarChart3 className="h-4 w-4 mr-2" />
            Project Progress
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-100" asChild>
          <Link to="/estimating">
            <Calculator className="h-4 w-4 mr-2" />
            Estimating
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-100" asChild>
          <Link to="/reports">
            <FileBarChart className="h-4 w-4 mr-2" />
            Reports
          </Link>
        </Button>
      </div>

      <TabsContent value="table" className="m-0">
        <SortableTable
          columns={columns}
          data={sortedReports}
          sortConfig={sortConfig}
          onSort={handleSort}
          emptyMessage="No WIP reports found"
        />
      </TabsContent>

      <TabsContent value="cards" className="m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReports.map((report) => (
            <Card key={report.id} className="bg-white border-slate-200">
              <CardHeader className="bg-slate-50 pb-2">
                <CardTitle>{report.projectName}</CardTitle>
                <CardDescription>ID: {report.projectId}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion:</span>
                    <span className="font-medium">{formatPercent(report.completionPercentage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-medium">{formatCurrency(report.revenueEarned)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">{formatCurrency(report.costsIncurred)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Over/Under:</span>
                    <span className={report.overUnderBilledAmount >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {formatCurrency(report.overUnderBilledAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Badge className={getBadgeColor(report.billingStatus)}>
                      {formatBillingStatus(report.billingStatus)}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => handleViewDetails(report)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="chart" className="m-0">
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-slate-800">WIP Financial Analysis</CardTitle>
            <CardDescription>Revenue vs Cost by Project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 70,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70} 
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                  <Bar dataKey="cost" name="Cost" fill="#ef4444" />
                  <Bar dataKey="profit" name="Profit" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-slate-800">Completion Percentage</CardTitle>
            <CardDescription>Project completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="completion" name="Completion %" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* WIP Details Dialog */}
      <WIPDetails
        wip={selectedWIP}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        canEdit={canEdit}
      />
    </div>
  );
};
