
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Risk, DriverTrendData } from "@/types/safety";
import { 
  AlertTriangle, 
  Car, 
  Users, 
  BarChart,
  Link
} from "lucide-react";
import { mockRisks, mockDriverTrends } from "@/data/mockSafetyData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";

export function RiskDriverIntegration() {
  const [risks] = useState<Risk[]>(mockRisks as Risk[]);
  const [driverTrends] = useState<DriverTrendData[]>(mockDriverTrends as DriverTrendData[]);
  const [activeTab, setActiveTab] = useState("overview");

  // Get driver-related risks
  const driverRisks = risks.filter(risk => 
    risk.category === "driver" || 
    (risk.relatedDriverData && risk.relatedDriverData.length > 0)
  );

  // Get high-priority AI predictions
  const aiPredictionRisks = risks.filter(risk => 
    risk.source === "ai-prediction" && 
    risk.isHighPriority === true
  );

  // Get driver trends with associated risks
  const riskyDrivers = driverTrends.filter(driver => {
    // Find if there are any risks related to this driver
    const hasRelatedRisks = risks.some(risk => 
      risk.relatedDriverData?.includes(driver.driverId)
    );
    return hasRelatedRisks || driver.riskLevel === "high";
  });

  // Map for correlation visualization  
  const correlationData = driverTrends.map(trend => {
    // Count related risks for this driver
    const relatedRisks = risks.filter(risk => 
      risk.relatedDriverData?.includes(trend.driverId)
    ).length;
    
    return {
      name: trend.driverName,
      safetyScore: trend.safetyScore,
      risks: relatedRisks,
      incidents: trend.incidentCount,
      fatigueEvents: trend.fatigueWarnings,
      speedingEvents: trend.speedingEvents,
      size: relatedRisks * 5 + 10, // Size based on number of related risks
      riskLevel: trend.riskLevel
    };
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk & Driver Trends Integration</h2>
          <p className="text-sm text-muted-foreground">
            AI-powered analysis connecting driver behavior data with risk predictions
          </p>
        </div>
        <Button>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Generate Risk Alert
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Analysis Overview</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="drivers">High Risk Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Driver Risk Correlation</CardTitle>
                <CardDescription>
                  Visualizing relationship between safety scores and risk factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="safetyScore" 
                        name="Safety Score" 
                        domain={[50, 100]}
                        label={{ value: "Safety Score", position: "bottom" }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="speedingEvents" 
                        name="Speeding Events"
                        label={{ value: "Speeding Events", angle: -90, position: "left" }} 
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => {
                          if (name === "size") return null;
                          return [value, name];
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border p-3 rounded-md shadow-md">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm">Safety Score: {data.safetyScore}</p>
                                <p className="text-sm">Speeding Events: {data.speedingEvents}</p>
                                <p className="text-sm">Fatigue Events: {data.fatigueEvents}</p>
                                <p className="text-sm">Related Risks: {data.risks}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter name="Drivers" data={correlationData}>
                        {correlationData.map((entry, index) => {
                          let color = "#10b981"; // green for low risk
                          if (entry.riskLevel === "medium") color = "#f59e0b"; // amber for medium
                          if (entry.riskLevel === "high") color = "#ef4444"; // red for high

                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={color}
                              fillOpacity={0.7}
                            />
                          );
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                  <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                  <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Integration Statistics</CardTitle>
                <CardDescription>
                  Key metrics from driver and risk data integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="mb-2">
                        <Car className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700">{riskyDrivers.length}</div>
                      <div className="text-sm text-blue-700 text-center">Drivers with Risk Factors</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-violet-50">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="mb-2">
                        <BarChart className="h-8 w-8 text-violet-600" />
                      </div>
                      <div className="text-2xl font-bold text-violet-700">{aiPredictionRisks.length}</div>
                      <div className="text-sm text-violet-700 text-center">AI Risk Predictions</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="mb-2">
                        <Users className="h-8 w-8 text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold text-amber-700">
                        {driverTrends.reduce((sum, driver) => sum + driver.fatigueWarnings, 0)}
                      </div>
                      <div className="text-sm text-amber-700 text-center">Fatigue Warnings</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="mb-2">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-700">
                        {driverTrends.reduce((sum, driver) => sum + driver.incidentCount, 0)}
                      </div>
                      <div className="text-sm text-red-700 text-center">Driver Incidents</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Integration Benefits</h3>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Early identification of driver fatigue patterns</li>
                    <li>Correlation of speeding events with safety incidents</li>
                    <li>Project-specific driver risk assessment</li>
                    <li>Automated alerts for high-risk trends</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI-Generated Risk Predictions</CardTitle>
              <CardDescription>
                Risks identified through AI analysis of driver and project data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiPredictionRisks.length > 0 ? (
                  aiPredictionRisks.map(risk => (
                    <Card key={risk.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              {risk.isHighPriority && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <BarChart className="h-4 w-4 text-violet-500" />
                              <h3 className="font-medium">{risk.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {risk.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="bg-violet-50">
                                AI Confidence: {risk.aiConfidence}%
                              </Badge>
                              <span>Project: {risk.projectName}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <Badge className={`${risk.category === "driver" ? "bg-cyan-100 text-cyan-800" : "bg-red-100 text-red-800"}`}>
                              {risk.category}
                            </Badge>
                            <Badge className="bg-amber-100 text-amber-800">
                              Risk Score: {risk.riskScore}
                            </Badge>
                          </div>
                        </div>
                        
                        {risk.relatedDriverData && risk.relatedDriverData.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <h4 className="text-xs font-medium mb-1">Related Driver Data:</h4>
                            <div className="flex flex-wrap gap-1">
                              {risk.relatedDriverData.map(driverId => {
                                const driver = driverTrends.find(d => d.driverId === driverId);
                                return driver ? (
                                  <Badge key={driverId} variant="outline" className="flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    {driver.driverName}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-border flex justify-end">
                          <Button size="sm">View Mitigation Actions</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No AI predictions available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">High Risk Driver Analysis</CardTitle>
              <CardDescription>
                Drivers identified with elevated risk factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskyDrivers.length > 0 ? (
                  riskyDrivers.map(driver => (
                    <Card key={driver.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              {driver.riskLevel === "high" && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <Car className="h-4 w-4 text-cyan-500" />
                              <h3 className="font-medium">{driver.driverName}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <div>
                                <span className="font-medium">Safety Score:</span>{" "}
                                <span className={driver.safetyScore > 80 ? "text-green-600" : driver.safetyScore > 60 ? "text-amber-600" : "text-red-600"}>
                                  {driver.safetyScore}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Trend:</span>{" "}
                                <span className={`${driver.trendDirection === "improving" ? "text-green-600" : driver.trendDirection === "stable" ? "text-blue-600" : "text-red-600"}`}>
                                  {driver.trendDirection}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Incidents:</span>{" "}
                                {driver.incidentCount}
                              </div>
                              <div>
                                <span className="font-medium">Mileage:</span>{" "}
                                {driver.mileageDriven.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <Badge className={`${driver.riskLevel === "low" ? "bg-green-100 text-green-800" : driver.riskLevel === "medium" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                              {driver.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div className="p-1.5 bg-gray-50 rounded text-center">
                            <span className="font-medium block">Harsh Braking</span> 
                            <span className={driver.harshBrakingEvents > 5 ? "text-red-600 font-medium" : ""}>
                              {driver.harshBrakingEvents}
                            </span>
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded text-center">
                            <span className="font-medium block">Speeding</span>
                            <span className={driver.speedingEvents > 5 ? "text-red-600 font-medium" : ""}>
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
                        
                        {/* Linked risks */}
                        {(() => {
                          const linkedRisks = risks.filter(risk => 
                            risk.relatedDriverData?.includes(driver.driverId)
                          );
                          
                          return linkedRisks.length > 0 ? (
                            <div className="mt-3 pt-3 border-t border-border">
                              <h4 className="text-xs font-medium mb-1">Associated Risks:</h4>
                              <div className="flex flex-wrap gap-1">
                                {linkedRisks.map(risk => (
                                  <Badge key={risk.id} variant="outline" className="flex items-center gap-1">
                                    <Link className="h-3 w-3" />
                                    {risk.title.length > 30 ? risk.title.substring(0, 30) + '...' : risk.title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}
                        
                        <div className="mt-3 pt-3 border-t border-border flex justify-between">
                          <Button size="sm" variant="outline">Driver Profile</Button>
                          <Button size="sm">Safety Intervention</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No high risk drivers identified.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
