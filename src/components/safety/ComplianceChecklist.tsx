
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockSafetyCompliances } from "@/data/mockSafetyData";
import { SafetyCompliance } from "@/types/safety";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export function ComplianceChecklist() {
  // Explicitly cast the mock data to the correct type
  const [complianceData, setComplianceData] = useState<SafetyCompliance[]>(
    mockSafetyCompliances as SafetyCompliance[]
  );

  const toggleChecklistItem = (complianceId: string, itemId: string) => {
    setComplianceData((prev) =>
      prev.map((compliance) => {
        if (compliance.id === complianceId) {
          return {
            ...compliance,
            checklistItems: compliance.checklistItems.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  status: item.status === "compliant" ? "non-compliant" : "compliant",
                  lastChecked: new Date().toISOString(),
                };
              }
              return item;
            }),
          };
        }
        return compliance;
      })
    );
  };

  const calculateCompliancePercentage = (compliance: SafetyCompliance) => {
    const requiredItems = compliance.checklistItems.filter(
      (item) => item.required && item.status !== "not-applicable"
    );
    
    if (requiredItems.length === 0) return 100;
    
    const compliantItems = requiredItems.filter(
      (item) => item.status === "compliant"
    );
    
    return Math.round((compliantItems.length / requiredItems.length) * 100);
  };

  return (
    <div className="space-y-6 p-4">
      {complianceData.map((compliance) => {
        const compliancePercentage = calculateCompliancePercentage(compliance);
        
        return (
          <Card key={compliance.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{compliance.standard}</CardTitle>
                  <CardDescription className="mt-1">
                    {compliance.description}
                  </CardDescription>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">{compliancePercentage}% Complete</div>
                  <div className="text-muted-foreground text-xs">
                    Next review: {new Date(compliance.nextReviewDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Progress value={compliancePercentage} className="mt-2" />
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {compliance.checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-start gap-3"
                  >
                    <Checkbox
                      id={`${compliance.id}-${item.id}`}
                      checked={item.status === "compliant"}
                      onCheckedChange={() => toggleChecklistItem(compliance.id, item.id)}
                      disabled={item.status === "not-applicable"}
                      className="mt-0.5"
                    />
                    <div className="space-y-1 flex-1">
                      <label
                        htmlFor={`${compliance.id}-${item.id}`}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 ${
                          item.required ? "after:content-['*'] after:text-red-500" : ""
                        }`}
                      >
                        {item.description}
                        {item.status === "not-applicable" && (
                          <span className="text-xs text-muted-foreground">(N/A)</span>
                        )}
                      </label>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                    {item.status === "non-compliant" && item.required && (
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                    {item.status === "compliant" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm">
                  <Info className="mr-1 h-4 w-4" />
                  View Details
                </Button>
                <Button size="sm">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
