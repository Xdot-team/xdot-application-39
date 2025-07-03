import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertTriangle, FileText, Plus } from "lucide-react";

// Mock data that matches the existing schema structure
const mockIncidents = [
  {
    id: "SI-2025-001",
    incident_type: "near_miss",
    severity: "medium",
    location: "GA-400 Mile Marker 15",
    incident_date: "2025-01-15T10:30:00Z",
    status: "resolved",
    description: "Worker nearly struck by moving equipment during paving operations",
    reported_by: "John Smith"
  },
  {
    id: "SI-2025-002", 
    incident_type: "injury",
    severity: "low",
    location: "I-85 Bridge Site",
    incident_date: "2025-01-20T14:15:00Z",
    status: "closed",
    description: "Minor cut on hand while handling steel reinforcement",
    reported_by: "Sarah Johnson"
  },
  {
    id: "SI-2025-003",
    incident_type: "property_damage", 
    severity: "medium",
    location: "Peachtree Street Downtown",
    incident_date: "2025-01-25T09:45:00Z",
    status: "investigating",
    description: "Construction equipment damaged parked vehicle",
    reported_by: "Mike Davis"
  },
  {
    id: "SI-2025-004",
    incident_type: "environmental",
    severity: "high", 
    location: "Augusta Highway Extension",
    incident_date: "2025-02-01T16:00:00Z",
    status: "open",
    description: "Fuel spill from equipment malfunction",
    reported_by: "Emily Brown"
  }
];

export const IncidentDashboard = () => {
  const incidents = mockIncidents;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
      case "critical":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
      case "investigating":
        return "destructive";
      case "resolved":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Safety Incident Dashboard</h2>
          <p className="text-muted-foreground">Track and manage safety incidents across all projects</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Incidents</div>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <div className="text-sm text-green-600">Real-time data</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Open Cases</div>
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.status === 'open' || i.status === 'investigating').length}
            </div>
            <div className="text-sm text-orange-600">Needs attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">High Severity</div>
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length}
            </div>
            <div className="text-sm text-red-600">Critical issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">This Month</div>
            <div className="text-2xl font-bold">
              {incidents.filter(i => {
                const incidentDate = new Date(i.incident_date);
                const now = new Date();
                return incidentDate.getMonth() === now.getMonth() && incidentDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <div className="text-sm text-blue-600">Current month</div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Incidents
          </CardTitle>
          <CardDescription>Latest safety incidents reported across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                  <TableCell className="capitalize">
                    {incident.incident_type.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(incident.severity)}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>{new Date(incident.incident_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(incident.status)}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};