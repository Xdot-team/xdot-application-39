
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Risk, RiskProbability, RiskImpact, RiskCategory, RiskSource } from "@/types/safety";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { AlertTriangle, Filter, ShieldAlert, SortAsc, FileText, CalendarClock, ListFilter, BarChart, Car, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockRisks } from "@/data/mockSafetyData";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

export function RiskDashboard() {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<string>("riskScore");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  
  const sortedRisks = [...risks].sort((a, b) => {
    if (sortBy === "riskScore") return b.riskScore - a.riskScore;
    if (sortBy === "probability") {
      const probOrder = { low: 1, medium: 2, high: 3, "very-high": 4 };
      return probOrder[b.probability as RiskProbability] - probOrder[a.probability as RiskProbability];
    }
    if (sortBy === "impact") {
      const impactOrder = { minimal: 1, moderate: 2, significant: 3, severe: 4 };
      return impactOrder[b.impact as RiskImpact] - impactOrder[a.impact as RiskImpact];
    }
    if (sortBy === "date") return new Date(b.dateIdentified).getTime() - new Date(a.dateIdentified).getTime();
    if (sortBy === "aiConfidence" && a.aiConfidence && b.aiConfidence) return b.aiConfidence - a.aiConfidence;
    return 0;
  });
  
  const filteredRisks = sortedRisks.filter(risk => {
    const matchesSearch = 
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || risk.category === filterCategory;
    const matchesSource = filterSource === "all" || risk.source === filterSource;
    const matchesTab = activeTab === "all" || 
      (activeTab === "high-priority" && risk.isHighPriority) ||
      (activeTab === "mitigating" && risk.status === "mitigating") ||
      (activeTab === "ai-predicted" && risk.source === "ai-prediction");
    
    return matchesSearch && matchesCategory && matchesSource && matchesTab;
  });

  const getProbabilityColor = (probability: RiskProbability) => {
    switch (probability) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "very-high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: RiskImpact) => {
    switch (impact) {
      case "minimal": return "bg-blue-100 text-blue-800";
      case "moderate": return "bg-purple-100 text-purple-800";
      case "significant": return "bg-orange-100 text-orange-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getCategoryColor = (category: RiskCategory) => {
    switch (category) {
      case "safety": return "bg-red-100 text-red-800";
      case "schedule": return "bg-blue-100 text-blue-800";
      case "budget": return "bg-green-100 text-green-800";
      case "resource": return "bg-purple-100 text-purple-800";
      case "equipment": return "bg-yellow-100 text-yellow-800";
      case "environmental": return "bg-teal-100 text-teal-800";
      case "regulatory": return "bg-indigo-100 text-indigo-800";
      case "driver": return "bg-cyan-100 text-cyan-800";
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: RiskSource) => {
    switch (source) {
      case "ai-prediction": return "bg-violet-100 text-violet-800";
      case "manual-entry": return "bg-blue-100 text-blue-800";
      case "incident-escalation": return "bg-orange-100 text-orange-800";
      case "compliance-issue": return "bg-red-100 text-red-800";
      case "driver-data": return "bg-cyan-100 text-cyan-800";
      case "jsa-analysis": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Transform data for risk heat map
  const heatMapData = risks.map(risk => {
    // Convert probability and impact to numeric values for the scatter chart
    const probValues = { low: 1, medium: 2, high: 3, "very-high": 4 };
    const impactValues = { minimal: 1, moderate: 2, significant: 3, severe: 4 };
    
    return {
      name: risk.title,
      x: probValues[risk.probability as RiskProbability],
      y: impactValues[risk.impact as RiskImpact],
      z: risk.riskScore,
      category: risk.category,
      source: risk.source,
      id: risk.id
    };
  });

  // Prepare data for category distribution chart
  const categoryData = Array.from(
    risks.reduce((acc, risk) => {
      const current = acc.get(risk.category) || 0;
      acc.set(risk.category, current + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  // Prepare data for source distribution chart
  const sourceData = Array.from(
    risks.reduce((acc, risk) => {
      const current = acc.get(risk.source) || 0;
      acc.set(risk.source, current + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  // Colors for pie charts
  const CATEGORY_COLORS = {
    safety: "#ef4444", 
    schedule: "#3b82f6", 
    budget: "#10b981", 
    resource: "#8b5cf6", 
    equipment: "#eab308", 
    environmental: "#14b8a6",
    regulatory: "#6366f1",
    driver: "#06b6d4",
    other: "#6b7280"
  };

  const SOURCE_COLORS = {
    "ai-prediction": "#8b5cf6",
    "manual-entry": "#3b82f6",
    "incident-escalation": "#f97316",
    "compliance-issue": "#ef4444",
    "driver-data": "#06b6d4",
    "jsa-analysis": "#eab308" 
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-1/2">
          <Input
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="regulatory">Regulatory</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="ai-prediction">AI Prediction</SelectItem>
              <SelectItem value="manual-entry">Manual Entry</SelectItem>
              <SelectItem value="incident-escalation">Incident Escalation</SelectItem>
              <SelectItem value="compliance-issue">Compliance Issue</SelectItem>
              <SelectItem value="driver-data">Driver Data</SelectItem>
              <SelectItem value="jsa-analysis">JSA Analysis</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Create Risk Assessment
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Risk Heat Map */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Risk Heat Map</CardTitle>
            <CardDescription>
              Visualization of risks by probability and impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Probability" 
                    domain={[0, 5]} 
                    tick={{fontSize: 12}}
                    tickFormatter={(value) => {
                      const labels = ["", "Low", "Medium", "High", "Very High"];
                      return labels[value] || "";
                    }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Impact" 
                    domain={[0, 5]}
                    tick={{fontSize: 12}}
                    tickFormatter={(value) => {
                      const labels = ["", "Minimal", "Moderate", "Significant", "Severe"];
                      return labels[value] || "";
                    }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                  />
                  <Scatter name="Risks" data={heatMapData}>
                    {heatMapData.map((entry, index) => {
                      let color;
                      // @ts-ignore
                      color = CATEGORY_COLORS[entry.category] || "#6b7280";
                      
                      // Size based on risk score
                      const size = 30 + (entry.z * 5);
                      
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
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Badge className="bg-red-100 text-red-800">Safety</Badge>
              <Badge className="bg-blue-100 text-blue-800">Schedule</Badge>
              <Badge className="bg-green-100 text-green-800">Budget</Badge>
              <Badge className="bg-purple-100 text-purple-800">Resource</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">Equipment</Badge>
              <Badge className="bg-teal-100 text-teal-800">Environmental</Badge>
              <Badge className="bg-indigo-100 text-indigo-800">Regulatory</Badge>
              <Badge className="bg-cyan-100 text-cyan-800">Driver</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Risk Summary */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Risk Summary</CardTitle>
            <CardDescription>
              Overview of current project risks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold">{risks.length}</div>
                  <div className="text-sm text-muted-foreground text-center">Total Risks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-red-600">
                    {risks.filter(r => r.isHighPriority).length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">High Priority</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-amber-600">
                    {risks.filter(r => r.status === "mitigating").length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Mitigating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-violet-600">
                    {risks.filter(r => r.source === "ai-prediction").length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">AI Predicted</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Risk Categories</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            // @ts-ignore 
                            fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} risks`, name]} />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2">Risk Sources</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            // @ts-ignore
                            fill={SOURCE_COLORS[entry.name] || "#6b7280"}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => {
                        const prettyName = name.replace(/-/g, ' ');
                        return [`${value} risks`, prettyName];
                      }} />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ fontSize: "12px" }}
                        formatter={(value) => value.replace(/-/g, ' ')}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Risk Register</CardTitle>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riskScore">Risk Score</SelectItem>
                  <SelectItem value="probability">Probability</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="date">Date Identified</SelectItem>
                  <SelectItem value="aiConfidence">AI Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList>
                <TabsTrigger value="all">All Risks</TabsTrigger>
                <TabsTrigger value="high-priority">High Priority</TabsTrigger>
                <TabsTrigger value="mitigating">Mitigating</TabsTrigger>
                <TabsTrigger value="ai-predicted">AI Predicted</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRisks.length > 0 ? (
              filteredRisks.map(risk => (
                <Card key={risk.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {risk.isHighPriority && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {risk.source === "ai-prediction" && (
                            <BarChart className="h-4 w-4 text-violet-500" />
                          )}
                          {risk.source === "driver-data" && (
                            <Car className="h-4 w-4 text-cyan-500" />
                          )}
                          {risk.source === "jsa-analysis" && (
                            <Users className="h-4 w-4 text-amber-500" />
                          )}
                          <h3 className="font-medium">{risk.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {risk.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>Project: {risk.projectName || 'Global'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 md:flex-col md:items-end">
                        <Badge className={getCategoryColor(risk.category)}>
                          {risk.category}
                        </Badge>
                        <Badge className={getSourceColor(risk.source)}>
                          {risk.source.replace(/-/g, ' ')}
                          {risk.aiConfidence && (
                            <span className="ml-1">({risk.aiConfidence}%)</span>
                          )}
                        </Badge>
                        <div className="flex gap-1.5">
                          <Badge className={getProbabilityColor(risk.probability)}>
                            P: {risk.probability}
                          </Badge>
                          <Badge className={getImpactColor(risk.impact)}>
                            I: {risk.impact}
                          </Badge>
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          <span>{new Date(risk.dateIdentified).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Show related data sections if available */}
                    {(risk.relatedDriverData?.length || risk.relatedJsaData?.length) && (
                      <div className="mt-3 pt-1 border-t border-border">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {risk.relatedDriverData && risk.relatedDriverData.length > 0 && (
                            <div className="flex items-center">
                              <Car className="h-3 w-3 mr-1 text-cyan-600" />
                              <span className="text-muted-foreground">
                                {risk.relatedDriverData.length} related driver records
                              </span>
                            </div>
                          )}
                          {risk.relatedJsaData && risk.relatedJsaData.length > 0 && (
                            <div className="flex items-center">
                              <ClipboardList className="h-3 w-3 mr-1 text-amber-600" />
                              <span className="text-muted-foreground">
                                {risk.relatedJsaData.length} related JSA records
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-border flex flex-wrap justify-between gap-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Risk Score:</span>
                        <span className={`text-sm font-bold ${risk.riskScore > 12 ? 'text-red-600' : risk.riskScore > 8 ? 'text-amber-600' : 'text-green-600'}`}>
                          {risk.riskScore}
                        </span>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Mitigation Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No risks match your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Custom tooltip for risk heat map
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          <span className="font-medium">Probability:</span> {["", "Low", "Medium", "High", "Very High"][data.x]}
        </p>
        <p className="text-sm">
          <span className="font-medium">Impact:</span> {["", "Minimal", "Moderate", "Significant", "Severe"][data.y]}
        </p>
        <p className="text-sm">
          <span className="font-medium">Risk Score:</span> {data.z}
        </p>
        <p className="text-sm capitalize">
          <span className="font-medium">Category:</span> {data.category}
        </p>
        <p className="text-sm capitalize">
          <span className="font-medium">Source:</span> {data.source.replace(/-/g, ' ')}
        </p>
      </div>
    );
  }
  return null;
};
