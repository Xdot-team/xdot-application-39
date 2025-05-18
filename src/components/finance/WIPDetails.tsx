
import { ProjectWIP } from "@/types/finance";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface WIPDetailsProps {
  wip: ProjectWIP | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit: boolean;
}

export const WIPDetails = ({ wip, isOpen, onClose, canEdit }: WIPDetailsProps) => {
  const [billingData, setBillingData] = useState<any[]>([]);
  const [costRevenueData, setCostRevenueData] = useState<any[]>([]);

  useEffect(() => {
    if (wip) {
      // Prepare data for billing pie chart
      setBillingData([
        { name: "Billed", value: wip.billedToDate, color: "#10b981" },
        { name: "Remaining", value: wip.remainingToBill, color: "#6366f1" }
      ]);

      // Prepare data for cost vs revenue chart
      setCostRevenueData([
        {
          name: "Amount",
          Revenue: wip.revenueEarned,
          Cost: wip.costsIncurred,
          Profit: wip.revenueEarned - wip.costsIncurred
        }
      ]);
    }
  }, [wip]);

  if (!wip) return null;

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>WIP Report Details</DialogTitle>
          <DialogDescription>
            Project: {wip.projectName} ({wip.projectId})
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>As of {new Date(wip.periodEndDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Value:</span>
                  <span className="font-medium">{formatCurrency(wip.contractValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion:</span>
                  <span className="font-medium">{formatPercent(wip.completionPercentage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Earned:</span>
                  <span className="font-medium">{formatCurrency(wip.revenueEarned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Costs Incurred:</span>
                  <span className="font-medium">{formatCurrency(wip.costsIncurred)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit to Date:</span>
                  <span className="font-medium">{formatCurrency(wip.revenueEarned - wip.costsIncurred)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billed to Date:</span>
                  <span className="font-medium">{formatCurrency(wip.billedToDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Over/Under Billed:</span>
                  <span className={wip.overUnderBilledAmount >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {formatCurrency(wip.overUnderBilledAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Billing Status:</span>
                  <Badge className={getBadgeColor(wip.billingStatus)}>
                    {formatBillingStatus(wip.billingStatus)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Status</CardTitle>
              <CardDescription>Contract billing breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={billingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {billingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Cost vs. Revenue</CardTitle>
              <CardDescription>Financial performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#10b981" name="Revenue Earned" />
                    <Bar dataKey="Cost" fill="#ef4444" name="Cost Incurred" />
                    <Bar dataKey="Profit" fill="#6366f1" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {wip.notes && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{wip.notes}</p>
              </CardContent>
            </Card>
          )}

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p>{new Date(wip.lastUpdated).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated By</p>
                  <p>{wip.updatedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Period End Date</p>
                  <p>{new Date(wip.periodEndDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WIPDetails;
