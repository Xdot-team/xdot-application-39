
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Risk, RiskProbability, RiskImpact, RiskCategory } from "@/types/safety";
import { AlertTriangle, ChevronDown, ChevronRight, ChevronUp, ShieldAlert } from "lucide-react";
import { mockRisks } from "@/data/mockSafetyData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function MobileRiskViewer() {
  const [risks] = useState<Risk[]>(mockRisks as Risk[]);
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null);
  
  const toggleRiskExpand = (riskId: string) => {
    if (expandedRiskId === riskId) {
      setExpandedRiskId(null);
    } else {
      setExpandedRiskId(riskId);
    }
  };

  const getPriorityRisks = () => {
    return risks.filter(risk => risk.isHighPriority).sort((a, b) => b.riskScore - a.riskScore);
  };

  const getRecentRisks = () => {
    return [...risks]
      .sort((a, b) => new Date(b.dateIdentified).getTime() - new Date(a.dateIdentified).getTime())
      .slice(0, 5);
  };

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
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const priorityRisks = getPriorityRisks();
  const recentRisks = getRecentRisks();

  return (
    <div className="space-y-4 p-4">
      <div className="sticky top-0 z-10 bg-background pb-2">
        <Button variant="default" className="w-full">
          <ShieldAlert className="h-4 w-4 mr-2" />
          Report New Risk
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            High Priority Risks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {priorityRisks.length > 0 ? (
              priorityRisks.map(risk => (
                <Collapsible 
                  key={risk.id} 
                  open={expandedRiskId === risk.id}
                  onOpenChange={() => toggleRiskExpand(risk.id)}
                >
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{risk.title}</h3>
                            <Badge className={getCategoryColor(risk.category)} variant="outline">
                              {risk.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${risk.riskScore > 12 ? 'bg-red-100 text-red-800' : risk.riskScore > 8 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                            {risk.riskScore}
                          </div>
                          {expandedRiskId === risk.id ? 
                            <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-3 pt-0 border-t">
                        <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-xs">
                            <span className="font-medium">Probability:</span>{" "}
                            <Badge className={getProbabilityColor(risk.probability)}>
                              {risk.probability}
                            </Badge>
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Impact:</span>{" "}
                            <Badge className={getImpactColor(risk.impact)}>
                              {risk.impact}
                            </Badge>
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Project:</span>{" "}
                            {risk.projectName || "Global"}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Status:</span>{" "}
                            {risk.status}
                          </div>
                        </div>
                        <Button size="sm" className="w-full">View Details</Button>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">
                No high priority risks at this time.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ChevronRight className="h-5 w-5 mr-2" />
            Recent Risks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {recentRisks.map(risk => (
              <Collapsible 
                key={risk.id} 
                open={expandedRiskId === risk.id}
                onOpenChange={() => toggleRiskExpand(risk.id)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                      <div>
                        <h3 className="font-medium text-sm">{risk.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className={getCategoryColor(risk.category)} variant="outline">
                            {risk.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(risk.dateIdentified).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {expandedRiskId === risk.id ? 
                        <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      }
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0 border-t">
                      <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                      <div className="flex gap-2 mb-3">
                        <Badge className={getProbabilityColor(risk.probability)}>
                          P: {risk.probability}
                        </Badge>
                        <Badge className={getImpactColor(risk.impact)}>
                          I: {risk.impact}
                        </Badge>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${risk.riskScore > 12 ? 'bg-red-100 text-red-800' : risk.riskScore > 8 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                          Score: {risk.riskScore}
                        </span>
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
    </div>
  );
}
