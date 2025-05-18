
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SafetyIncident, IncidentSeverity } from "@/types/safety";
import { AlertTriangle, Calendar, FileText, MapPin, User } from "lucide-react";
import { mockSafetyIncidents } from "@/data/mockSafetyData";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function IncidentDashboard() {
  const [incidents, setIncidents] = useState<SafetyIncident[]>(mockSafetyIncidents as SafetyIncident[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const isMobile = useIsMobile();

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = selectedSeverity === "all" || incident.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-100 text-blue-800";
      case "investigating":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-1/2">
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">
            Report New Incident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(incident.date), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className={`${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </Badge>
                    <Badge className={`${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2 mb-3">
                  {incident.description}
                </p>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{incident.location}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>Reported by: {incident.reportedBy}</span>
                  </div>
                  {incident.projectName && (
                    <div className="flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      <span>Project: {incident.projectName}</span>
                    </div>
                  )}
                  {incident.oshaReportable && (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      <span>OSHA Reportable</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No incidents match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
