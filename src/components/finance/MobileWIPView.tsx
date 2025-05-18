
import React from 'react';
import { ProjectWIP } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { ChevronRight } from 'lucide-react';

interface MobileWIPViewProps {
  wipReports: ProjectWIP[];
}

const MobileWIPView = ({ wipReports }: MobileWIPViewProps) => {
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

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">WIP Reports</h2>
        <Button variant="outline" size="sm">
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {wipReports.map((report) => (
          <Card key={report.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{report.projectName}</CardTitle>
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
                  <span className="font-medium">{formatPercentage(report.completionPercentage)}</span>
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
              <Button variant="ghost" className="w-full mt-4 flex justify-between items-center">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MobileWIPView;
