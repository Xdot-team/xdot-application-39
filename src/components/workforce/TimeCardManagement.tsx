import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Plus, CalendarCheck, CheckCircle, XCircle } from "lucide-react";
import { useTimeClock } from "@/hooks/useWorkforceManagement";
import { formatDate } from "@/lib/formatters";

export function TimeCardManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { timeRecords, loading, clockIn, clockOut } = useTimeClock();

  const filteredTimeCards = timeRecords.filter(
    (timeCard) =>
      timeCard.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timeCard.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "submitted":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "submitted":
        return <CalendarCheck className="h-4 w-4 text-amber-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search time cards..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Time Card
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredTimeCards.map((timeCard) => (
            <div
              key={timeCard.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Employee: {timeCard.employee_id}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(timeCard.clock_in)}
                  </p>
                </div>
                <Badge variant={getStatusColor(timeCard.status) as any}>
                  {timeCard.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Clock In</p>
                  <p>{new Date(timeCard.clock_in).toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Clock Out</p>
                  <p>{timeCard.clock_out ? new Date(timeCard.clock_out).toLocaleTimeString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Hours</p>
                  <p>{timeCard.total_hours || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p>{timeCard.status}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {timeCard.status === "submitted" && (
                  <>
                    <Button size="sm" className="flex-1">
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Regular Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimeCards.map((timeCard) => (
                <TableRow key={timeCard.id}>
                  <TableCell>{timeCard.employee_id}</TableCell>
                  <TableCell>{formatDate(timeCard.clock_in)}</TableCell>
                  <TableCell>{timeCard.project_id || "N/A"}</TableCell>
                  <TableCell>{timeCard.regular_hours || 0}</TableCell>
                  <TableCell>{timeCard.overtime_hours || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(timeCard.status)}
                      <Badge variant={getStatusColor(timeCard.status) as any}>
                        {timeCard.status.charAt(0).toUpperCase() + timeCard.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{timeCard.created_at ? formatDate(timeCard.created_at) : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {timeCard.status === "pending" && (
                        <>
                          <Button size="sm" variant="default">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
