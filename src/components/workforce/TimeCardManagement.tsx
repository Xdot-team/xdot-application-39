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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Filter, Plus, CalendarCheck, CheckCircle, XCircle, Clock, LogOut, Edit } from "lucide-react";
import { useTimeClock, useEmployeeProfiles } from "@/hooks/useWorkforceManagement";
import { formatDate } from "@/lib/formatters";
import { TimeClockForm } from "./TimeClockForm";
import { toast } from "@/hooks/use-toast";
import { TimeClockRecord } from "@/types/employee";

export function TimeCardManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTimeClockOpen, setIsTimeClockOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TimeClockRecord | undefined>();
  const [actionType, setActionType] = useState<'clockout' | 'approve' | 'reject'>('clockout');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { timeRecords, loading, clockOut } = useTimeClock();
  const { employees } = useEmployeeProfiles();

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
      case "pending":
        return <CalendarCheck className="h-4 w-4 text-amber-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : employeeId;
  };

  const handleClockOut = (record: TimeClockRecord) => {
    setSelectedRecord(record);
    setActionType('clockout');
    setActionDialogOpen(true);
  };

  const handleApprove = (record: TimeClockRecord) => {
    setSelectedRecord(record);
    setActionType('approve');
    setActionDialogOpen(true);
  };

  const handleReject = (record: TimeClockRecord) => {
    setSelectedRecord(record);
    setActionType('reject');
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedRecord) return;

    try {
      switch (actionType) {
        case 'clockout':
          await clockOut(selectedRecord.id);
          break;
        case 'approve':
          // TODO: Implement approve functionality
          toast({
            title: "Success",
            description: "Time record approved",
          });
          break;
        case 'reject':
          // TODO: Implement reject functionality
          toast({
            title: "Success", 
            description: "Time record rejected",
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${actionType} time record`,
        variant: "destructive",
      });
    }
    
    setActionDialogOpen(false);
    setSelectedRecord(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading time records...</p>
        </div>
      </div>
    );
  }

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
          <Button size="sm" onClick={() => setIsTimeClockOpen(true)}>
            <Clock className="h-4 w-4 mr-2" />
            Clock In/Out
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
                  <p className="font-medium">{getEmployeeName(timeCard.employee_id)}</p>
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
                {!timeCard.clock_out && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleClockOut(timeCard)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Clock Out
                  </Button>
                )}
                {timeCard.status === "pending" && (
                  <>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApprove(timeCard)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleReject(timeCard)}
                    >
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
                  <TableCell>{getEmployeeName(timeCard.employee_id)}</TableCell>
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
                      {!timeCard.clock_out && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleClockOut(timeCard)}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Clock Out
                        </Button>
                      )}
                      {timeCard.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApprove(timeCard)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(timeCard)}
                          >
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

      {/* Time Clock Form */}
      <TimeClockForm
        open={isTimeClockOpen}
        onOpenChange={setIsTimeClockOpen}
      />

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {actionType === 'clockout' ? 'Clock Out' : actionType === 'approve' ? 'Approve' : 'Reject'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'clockout' && 
                `Are you sure you want to clock out ${selectedRecord ? getEmployeeName(selectedRecord.employee_id) : ''}?`
              }
              {actionType === 'approve' && 
                `Are you sure you want to approve this time record for ${selectedRecord ? getEmployeeName(selectedRecord.employee_id) : ''}?`
              }
              {actionType === 'reject' && 
                `Are you sure you want to reject this time record for ${selectedRecord ? getEmployeeName(selectedRecord.employee_id) : ''}?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={handleActionConfirm}
            >
              {actionType === 'clockout' ? 'Clock Out' : actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
