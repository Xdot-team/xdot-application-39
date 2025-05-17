
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
import { Search, Filter, Plus, FileCheck, Upload, Clock, CheckCircle2 } from "lucide-react";
import { mockOnboardings } from "@/data/mockWorkforceData";
import { Onboarding } from "@/types/workforce";
import { formatDate } from "@/lib/formatters";

export function OnboardingWorkflow() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [onboardings, setOnboardings] = useState<Onboarding[]>(mockOnboardings);

  const filteredOnboardings = onboardings.filter((onboarding) =>
    onboarding.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "training":
      case "background_check":
        return "warning";
      case "documents_submitted":
        return "secondary";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "training":
        return <FileCheck className="h-4 w-4" />;
      case "background_check":
        return <Clock className="h-4 w-4" />;
      case "documents_submitted":
        return <Upload className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCompletedDocumentsCount = (onboarding: Onboarding) => {
    return onboarding.documents.filter(
      (doc) => doc.status === "approved" || doc.status === "submitted"
    ).length;
  };

  const getTotalDocumentsCount = (onboarding: Onboarding) => {
    return onboarding.documents.length;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee ID..."
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
            New Onboarding
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredOnboardings.map((onboarding) => (
            <div
              key={onboarding.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Employee #{onboarding.employeeId}</p>
                  <p className="text-sm text-muted-foreground">
                    Started: {formatDate(onboarding.startDate)}
                  </p>
                </div>
                <Badge variant={getStatusColor(onboarding.status) as any}>
                  {onboarding.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Documents</p>
                  <p>
                    {getCompletedDocumentsCount(onboarding)}/{getTotalDocumentsCount(onboarding)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Training</p>
                  <p>{onboarding.trainingCompleted.length}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Last Update</p>
                  <p>{onboarding.completedDate ? `Completed on ${formatDate(onboarding.completedDate)}` : "In progress"}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                View Onboarding Process
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Training Completed</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOnboardings.map((onboarding) => (
                <TableRow key={onboarding.id}>
                  <TableCell>{onboarding.employeeId}</TableCell>
                  <TableCell>{formatDate(onboarding.startDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(onboarding.status)}
                      <Badge variant={getStatusColor(onboarding.status) as any}>
                        {onboarding.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCompletedDocumentsCount(onboarding)}/{getTotalDocumentsCount(onboarding)}
                  </TableCell>
                  <TableCell>{onboarding.trainingCompleted.length}</TableCell>
                  <TableCell>
                    {onboarding.completedDate
                      ? formatDate(onboarding.completedDate)
                      : "In progress"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
