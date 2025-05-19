
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { FinancialReport } from "@/types/finance";
import { FileText, Download, BarChart3, Filter, CalendarRange } from "lucide-react";
import { SearchFilter } from "./SearchFilter";
import { toast } from "sonner";

export function ReportsTab({ canEdit = false }) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock financial reports
  const mockReports: FinancialReport[] = [
    {
      id: "FR1001",
      name: "Monthly Income Statement",
      type: "income_statement",
      period: "April 2025",
      generatedDate: "2025-05-01",
      dateGenerated: "2025-05-01",
      dateRange: {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        start: "2025-04-01",
        end: "2025-04-30"
      },
      data: {}
    },
    {
      id: "FR1002",
      name: "Q1 Balance Sheet",
      type: "balance_sheet",
      period: "Q1 2025",
      generatedDate: "2025-04-05",
      dateGenerated: "2025-04-05",
      dateRange: {
        startDate: "2025-01-01",
        endDate: "2025-03-31",
        start: "2025-01-01",
        end: "2025-03-31"
      },
      data: {}
    },
    {
      id: "FR1003",
      name: "Cash Flow Statement",
      type: "cash_flow",
      period: "April 2025",
      generatedDate: "2025-05-01",
      dateGenerated: "2025-05-01",
      dateRange: {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        start: "2025-04-01",
        end: "2025-04-30"
      },
      data: {}
    },
    {
      id: "FR1004",
      name: "WIP Report",
      type: "wip",
      period: "April 2025",
      generatedDate: "2025-05-01",
      dateGenerated: "2025-05-01",
      dateRange: {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        start: "2025-04-01",
        end: "2025-04-30"
      },
      data: {}
    },
    {
      id: "FR1005",
      name: "AR Aging Report",
      type: "ar_aging",
      period: "April 2025",
      generatedDate: "2025-05-01",
      dateGenerated: "2025-05-01",
      dateRange: {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        start: "2025-04-01",
        end: "2025-04-30"
      },
      data: {}
    },
    {
      id: "FR1006",
      name: "Job Cost Report",
      type: "job_cost",
      period: "April 2025",
      generatedDate: "2025-05-01",
      dateGenerated: "2025-05-01",
      dateRange: {
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        start: "2025-04-01",
        end: "2025-04-30"
      },
      data: {}
    }
  ];
  
  const handleViewReport = (report: FinancialReport) => {
    toast.info(`Viewing ${report.name}`);
  };
  
  const handleDownloadReport = (report: FinancialReport) => {
    toast.info(`Downloading ${report.name}`);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>View and download financial reports</CardDescription>
        </div>
        {canEdit && (
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant={activeTab === "all" ? "default" : "outline"}
                onClick={() => setActiveTab("all")}
              >
                All
              </Button>
              <Button 
                variant={activeTab === "income" ? "default" : "outline"}
                onClick={() => setActiveTab("income")}
              >
                Income Statements
              </Button>
              <Button 
                variant={activeTab === "balance" ? "default" : "outline"}
                onClick={() => setActiveTab("balance")}
              >
                Balance Sheets
              </Button>
              <Button 
                variant={activeTab === "wip" ? "default" : "outline"}
                onClick={() => setActiveTab("wip")}
              >
                WIP Reports
              </Button>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockReports.filter(report => 
              activeTab === "all" ||
              (activeTab === "income" && report.type === "income_statement") ||
              (activeTab === "balance" && report.type === "balance_sheet") ||
              (activeTab === "wip" && report.type === "wip")
            ).map(report => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                  </div>
                  <CardDescription>{report.period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    <span>Generated on {report.dateGenerated}</span>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                      <FileText className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDownloadReport(report)}>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {mockReports.length} reports
        </p>
      </CardFooter>
    </Card>
  );
}
