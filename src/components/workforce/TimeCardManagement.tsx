
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
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
import { mockTimeCards } from "@/data/mockWorkforceData";
import { TimeCard } from "@/types/workforce";
import { formatDate } from "@/lib/formatters";

export function TimeCardManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [timeCards, setTimeCards] = useState<TimeCard[]>(mockTimeCards);

  const filteredTimeCards = timeCards.filter(
    (timeCard) =>
      timeCard.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (timeCard.projectName && timeCard.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
                  <p className="font-medium">{timeCard.employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(timeCard.date)}
                  </p>
                </div>
                <Badge variant={getStatusColor(timeCard.status) as any}>
                  {timeCard.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Project</p>
                  <p>{timeCard.projectName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hours</p>
                  <p>{timeCard.hoursWorked + timeCard.overtimeHours}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Regular</p>
                  <p>{timeCard.hoursWorked}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Overtime</p>
                  <p>{timeCard.overtimeHours}</p>
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
                  <TableCell>{timeCard.employeeName}</TableCell>
                  <TableCell>{formatDate(timeCard.date)}</TableCell>
                  <TableCell>{timeCard.projectName || "N/A"}</TableCell>
                  <TableCell>{timeCard.hoursWorked}</TableCell>
                  <TableCell>{timeCard.overtimeHours}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(timeCard.status)}
                      <Badge variant={getStatusColor(timeCard.status) as any}>
                        {timeCard.status.charAt(0).toUpperCase() + timeCard.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{timeCard.submittedAt ? formatDate(timeCard.submittedAt) : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {timeCard.status === "submitted" && (
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
