
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DriverData, DriverTrendData, TrendDirection } from "@/types/safety";
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  ChevronUp, 
  Car,
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { mockDriverData, mockDriverTrends } from "@/data/mockSafetyData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

export function MobileDriverView() {
  const [driverTrends] = useState<DriverTrendData[]>(mockDriverTrends as DriverTrendData[]);
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  
  const toggleDriverExpand = (driverId: string) => {
    if (expandedDriverId === driverId) {
      setExpandedDriverId(null);
    } else {
      setExpandedDriverId(driverId);
    }
  };

  const getHighRiskDrivers = () => {
    return driverTrends.filter(trend => trend.riskLevel === 'high')
      .sort((a, b) => a.safetyScore - b.safetyScore);
  };

  const getTopPerformingDrivers = () => {
    return driverTrends
      .sort((a, b) => b.safetyScore - a.safetyScore)
      .slice(0, 3);
  };

  const getTrendDirectionColor = (direction: TrendDirection) => {
    switch (direction) {
      case "improving": return "bg-green-100 text-green-800";
      case "stable": return "bg-blue-100 text-blue-800";
      case "worsening": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const highRiskDrivers = getHighRiskDrivers();
  const topPerformingDrivers = getTopPerformingDrivers();

  return (
    <div className="space-y-4 p-4">
      <div className="sticky top-0 z-10 bg-background pb-2">
        <Button variant="default" className="w-full">
          <Car className="h-4 w-4 mr-2" />
          Driver Alerts Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            High Risk Drivers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {highRiskDrivers.length > 0 ? (
              highRiskDrivers.map(driver => (
                <Collapsible 
                  key={driver.id} 
                  open={expandedDriverId === driver.id}
                  onOpenChange={() => toggleDriverExpand(driver.id)}
                >
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{driver.driverName}</h3>
                            <Badge className={getRiskLevelColor(driver.riskLevel)} variant="outline">
                              {driver.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            Score: {driver.safetyScore}
                          </div>
                          {expandedDriverId === driver.id ? 
                            <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-3 pt-0 border-t">
                        <div className="space-y-3 mb-3">
                          <div>
                            <div className="text-xs font-medium mb-1">Safety Score</div>
                            <Progress value={driver.safetyScore} className={getSafetyScoreColor(driver.safetyScore)} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs">
                              <span className="font-medium">Period:</span>{" "}
                              {driver.period === "week" ? "Weekly" :
                               driver.period === "month" ? "Monthly" :
                               driver.period === "quarter" ? "Quarterly" : "Yearly"}
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">Trend:</span>{" "}
                              <Badge className={getTrendDirectionColor(driver.trendDirection)}>
                                {driver.trendDirection === "improving" ? (
                                  <span className="flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" /> Improving
                                  </span>
                                ) : driver.trendDirection === "stable" ? (
                                  <span>Stable</span>
                                ) : (
                                  <span className="flex items-center">
                                    <TrendingDown className="h-3 w-3 mr-1" /> Worsening
                                  </span>
                                )}
                              </Badge>
                            </div>
                            
                            <div className="text-xs">
                              <span className="font-medium">Mileage:</span>{" "}
                              {driver.mileageDriven.toLocaleString()} mi
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">Incidents:</span>{" "}
                              {driver.incidentCount}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="p-1.5 bg-gray-50 rounded text-center">
                              <span className="font-medium block">Braking</span> 
                              <span className={driver.harshBrakingEvents > 3 ? "text-red-600 font-medium" : ""}>
                                {driver.harshBrakingEvents}
                              </span>
                            </div>
                            <div className="p-1.5 bg-gray-50 rounded text-center">
                              <span className="font-medium block">Speeding</span>
                              <span className={driver.speedingEvents > 3 ? "text-red-600 font-medium" : ""}>
                                {driver.speedingEvents}
                              </span>
                            </div>
                            <div className="p-1.5 bg-gray-50 rounded text-center">
                              <span className="font-medium block">Fatigue</span>
                              <span className={driver.fatigueWarnings > 0 ? "text-red-600 font-medium" : ""}>
                                {driver.fatigueWarnings}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {driver.improvementSuggestions && driver.improvementSuggestions.length > 0 && (
                          <div className="text-xs mb-3">
                            <span className="font-medium block">Action needed:</span>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {driver.improvementSuggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Button size="sm" className="w-full">View Complete Profile</Button>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">
                No high risk drivers at this time.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ChevronRight className="h-5 w-5 mr-2" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {topPerformingDrivers.map(driver => (
              <Collapsible 
                key={driver.id} 
                open={expandedDriverId === driver.id}
                onOpenChange={() => toggleDriverExpand(driver.id)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                      <div>
                        <h3 className="font-medium text-sm">{driver.driverName}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className="bg-green-100 text-green-800" variant="outline">
                            Safety Score: {driver.safetyScore}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {driver.period === "week" ? "Weekly" :
                             driver.period === "month" ? "Monthly" :
                             driver.period === "quarter" ? "Quarterly" : "Yearly"}
                          </span>
                        </div>
                      </div>
                      {expandedDriverId === driver.id ? 
                        <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      }
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0 border-t">
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <span className="font-medium">Mileage:</span>{" "}
                          {driver.mileageDriven.toLocaleString()} mi
                        </div>
                        <div>
                          <span className="font-medium">Incidents:</span>{" "}
                          {driver.incidentCount}
                        </div>
                        <div>
                          <span className="font-medium">Dates:</span>{" "}
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(driver.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Trend:</span>{" "}
                          <Badge className={getTrendDirectionColor(driver.trendDirection)}>
                            {driver.trendDirection}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">View Profile</Button>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="pt-2 pb-4">
        <Button variant="outline" className="w-full">
          View All Drivers
        </Button>
      </div>
    </div>
  );
}
