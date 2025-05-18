
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  DriverTrendData,
  Risk
} from "@/types/safety";
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  ChevronUp, 
  BarChart,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Car,
  Truck
} from "lucide-react";
import { mockDriverTrends, mockRisks } from "@/data/mockSafetyData";
import { ResponsiveContainer, BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function MobileDriverView() {
  const [driverTrends] = useState<DriverTrendData[]>(mockDriverTrends);
  const [risks] = useState<Risk[]>(mockRisks.filter(r => r.category === 'driver'));
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("trends");
  
  const toggleItemExpand = (id: string) => {
    if (expandedItemId === id) {
      setExpandedItemId(null);
    } else {
      setExpandedItemId(id);
    }
  };

  const getPriorityTrends = () => {
    return driverTrends
      .filter(trend => trend.riskLevel === "high")
      .sort((a, b) => a.safetyScore - b.safetyScore);
  };

  const getRecentTrends = () => {
    return [...driverTrends]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendDirectionColor = (direction: "improving" | "stable" | "worsening") => {
    switch (direction) {
      case "improving": return "bg-green-100 text-green-800";
      case "stable": return "bg-blue-100 text-blue-800";
      case "worsening": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const highRiskDrivers = getPriorityTrends();
  const recentTrends = getRecentTrends();

  // Data for performance chart
  const driverPerformanceData = driverTrends
    .slice(0, 5)
    .map(trend => ({
      name: trend.driverName.split(' ')[0],
      score: trend.safetyScore,
      incidents: trend.incidentCount
    }));

  return (
    <div className="space-y-4 p-4">
      <div className="sticky top-0 z-10 bg-background pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="trends">
              <BarChart className="h-4 w-4 mr-1.5" />
              Driver Trends
            </TabsTrigger>
            <TabsTrigger value="risks">
              <ShieldAlert className="h-4 w-4 mr-1.5" />
              Driver Risks
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="trends" className="mt-0 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
              High Risk Drivers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {highRiskDrivers.length > 0 ? (
                highRiskDrivers.map(trend => (
                  <Collapsible 
                    key={trend.id} 
                    open={expandedItemId === trend.id}
                    onOpenChange={() => toggleItemExpand(trend.id)}
                  >
                    <Card className="overflow-hidden border-red-200">
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="mt-1">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{trend.driverName}</h3>
                              <div className="text-xs text-muted-foreground">Safety Score: {trend.safetyScore}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRiskLevelColor(trend.riskLevel)}>
                              High Risk
                            </Badge>
                            {expandedItemId === trend.id ? 
                              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            }
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="p-3 pt-0 border-t">
                          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                            <div>
                              <span className="font-medium">Period:</span>{" "}
                              {trend.period.charAt(0).toUpperCase() + trend.period.slice(1)}
                            </div>
                            <div>
                              <span className="font-medium">Trend:</span>{" "}
                              <Badge className={getTrendDirectionColor(trend.trendDirection)}>
                                {trend.trendDirection}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Incidents:</span>{" "}
                              {trend.incidentCount}
                            </div>
                            <div>
                              <span className="font-medium">Miles:</span>{" "}
                              {trend.mileageDriven}
                            </div>
                          </div>
                          
                          <div className="text-xs space-y-1">
                            <div className="font-medium">Risk Factors:</div>
                            <div className="grid grid-cols-3 gap-1">
                              <div className="p-1.5 bg-gray-50 rounded">
                                <span className="font-medium block">Harsh Braking:</span> {trend.harshBrakingEvents}
                              </div>
                              <div className="p-1.5 bg-gray-50 rounded">
                                <span className="font-medium block">Speeding:</span> {trend.speedingEvents}
                              </div>
                              <div className="p-1.5 bg-gray-50 rounded">
                                <span className="font-medium block">Fatigue:</span> {trend.fatigueWarnings}
                              </div>
                            </div>
                          </div>
                          
                          {trend.improvementSuggestions && trend.improvementSuggestions.length > 0 && (
                            <div className="mt-2 text-xs">
                              <span className="font-medium">Improvement Needed:</span>
                              <ul className="list-disc list-inside text-muted-foreground">
                                {trend.improvementSuggestions.map((suggestion, i) => (
                                  <li key={i}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button size="sm" className="w-full mt-3">View Driver Details</Button>
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
            <CardTitle className="text-lg">Driver Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart
                  data={driverPerformanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="score" name="Safety Score" fill="#3b82f6" />
                  <Bar yAxisId="right" dataKey="incidents" name="Incidents" fill="#ef4444" />
                </RechartBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ChevronRight className="h-5 w-5 mr-2" />
              Recent Driver Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {recentTrends.map(trend => (
                <Collapsible 
                  key={trend.id} 
                  open={expandedItemId === trend.id}
                  onOpenChange={() => toggleItemExpand(trend.id)}
                >
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                        <div>
                          <h3 className="font-medium text-sm">{trend.driverName}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Score: {trend.safetyScore}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {trend.mileageDriven} mi
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={getRiskLevelColor(trend.riskLevel)}>
                            {trend.riskLevel}
                          </Badge>
                          {expandedItemId === trend.id ? 
                            <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" /> : 
                            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                          }
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-3 pt-0 border-t">
                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div>
                            <span className="font-medium">Period:</span>{" "}
                            {trend.period.charAt(0).toUpperCase() + trend.period.slice(1)}
                          </div>
                          <div>
                            <span className="font-medium">Trend:</span>{" "}
                            <Badge className={getTrendDirectionColor(trend.trendDirection)}>
                              {trend.trendDirection}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Incidents:</span>{" "}
                            {trend.incidentCount}
                          </div>
                          <div>
                            <span className="font-medium">Incident Rate:</span>{" "}
                            {(trend.incidentRate * 1000).toFixed(2)}/1000 mi
                          </div>
                        </div>

                        <Button size="sm" className="w-full">View Details</Button>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="risks" className="mt-0 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Truck className="h-5 w-5 mr-2 text-blue-500" />
              Driver-Related Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {risks.length > 0 ? (
                risks.map(risk => (
                  <Collapsible 
                    key={risk.id} 
                    open={expandedItemId === risk.id}
                    onOpenChange={() => toggleItemExpand(risk.id)}
                  >
                    <Card className="overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="mt-1">
                              <ShieldAlert className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{risk.title}</h3>
                              <div className="text-xs text-muted-foreground">
                                {risk.source === "ai-prediction" ? (
                                  <span className="flex items-center">
                                    AI Predicted
                                    {risk.aiConfidence && (
                                      <span className="ml-1">
                                        ({risk.aiConfidence}% confidence)
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span>{risk.source.replace("_", " ")}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`px-2 py-1 rounded-full text-xs font-bold ${risk.riskScore > 12 ? 'bg-red-100 text-red-800' : risk.riskScore > 8 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                              {risk.riskScore}
                            </Badge>
                            {expandedItemId === risk.id ? 
                              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            }
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="p-3 pt-0 border-t">
                          <p className="text-sm mb-2">{risk.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div>
                              <span className="font-medium">Category:</span>{" "}
                              {risk.category}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>{" "}
                              {risk.status}
                            </div>
                            <div>
                              <span className="font-medium">Probability:</span>{" "}
                              {risk.probability}
                            </div>
                            <div>
                              <span className="font-medium">Impact:</span>{" "}
                              {risk.impact}
                            </div>
                          </div>
                          
                          {risk.predictedTriggers && risk.predictedTriggers.length > 0 && (
                            <div className="text-xs mb-2">
                              <span className="font-medium">Triggers:</span>
                              <ul className="list-disc list-inside text-muted-foreground">
                                {risk.predictedTriggers.map((trigger, i) => (
                                  <li key={i}>{trigger}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button size="sm" className="w-full">Mitigation Plan</Button>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No driver risks identified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
