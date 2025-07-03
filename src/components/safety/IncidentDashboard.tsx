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
import { AlertTriangle, FileText, Plus, Loader2 } from "lucide-react";
import { useSafetyIncidents } from "@/hooks/useSafetyData";

export const IncidentDashboard = () => {
  const { incidents, loading } = useSafetyIncidents();

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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading incidents...</span>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Incidents Reported</h3>
              <p className="text-sm text-muted-foreground">No safety incidents have been reported yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
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
                    <TableCell className="font-mono text-sm">{incident.incident_number}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};