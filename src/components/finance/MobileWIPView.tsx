
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectWIP } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { ChevronRight, Filter, Calculator, BarChart3, FileBarChart, Search } from 'lucide-react';
import { WIPDetails } from '@/components/finance/WIPDetails';
import { Input } from '@/components/ui/input';

interface MobileWIPViewProps {
  wipReports: ProjectWIP[];
  canEdit?: boolean;
}

const MobileWIPView = ({ wipReports, canEdit = false }: MobileWIPViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWIP, setSelectedWIP] = useState<ProjectWIP | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter reports based on search term
  const filteredReports = wipReports.filter(
    (report) =>
      report.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.billingStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format billing status for display
  const formatBillingStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
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

  const handleViewDetails = (report: ProjectWIP) => {
    setSelectedWIP(report);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">WIP Reports</h2>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Links to related modules */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="bg-slate-100 text-xs" asChild>
          <Link to="/projects">
            <BarChart3 className="h-3 w-3 mr-1" />
            Projects
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-100 text-xs" asChild>
          <Link to="/estimating">
            <Calculator className="h-3 w-3 mr-1" />
            Estimating
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-100 text-xs" asChild>
          <Link to="/reports">
            <FileBarChart className="h-3 w-3 mr-1" />
            Reports
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No WIP reports found</div>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="w-full border-slate-200">
              <CardHeader className="pb-2 bg-slate-50">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-slate-800">{report.projectName}</CardTitle>
                  <Badge className={getBadgeColor(report.billingStatus)}>
                    {formatBillingStatus(report.billingStatus)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{report.projectId}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion</span>
                    <span className="font-medium">{formatPercent(report.completionPercentage)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-medium">{formatCurrency(report.revenueEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost</span>
                    <span className="font-medium">{formatCurrency(report.costsIncurred)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Over/Under Billed</span>
                    <span className={report.overUnderBilledAmount >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {formatCurrency(report.overUnderBilledAmount)}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 flex justify-between items-center"
                  onClick={() => handleViewDetails(report)}
                >
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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

export default MobileWIPView;
