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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Filter, FileText } from "lucide-react";
import { useEmployeeProfiles } from "@/hooks/useWorkforceManagement";
import { formatDate } from "@/lib/formatters";

export function EmployeeDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployeeProfiles();

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "on_leave":
        return "warning";
      case "terminated":
      case "retired":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
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
            Add Employee
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {employee.profile_photo ? (
                      <AvatarImage src={employee.profile_photo} />
                    ) : null}
                    <AvatarFallback>
                      {employee.first_name.charAt(0)}
                      {employee.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {employee.first_name} {employee.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employee.job_title.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(employee.status) as any}>
                  {employee.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee ID</p>
                  <p>{employee.employee_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hire Date</p>
                  <p>{formatDate(employee.hire_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Skills</p>
                  <p>{employee.skills?.length || 0}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {employee.profile_photo ? (
                          <AvatarImage src={employee.profile_photo} />
                        ) : null}
                        <AvatarFallback>
                          {employee.first_name.charAt(0)}
                          {employee.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.job_title.replace("_", " ")}</TableCell>
                  <TableCell>{formatDate(employee.hire_date)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(employee.status) as any}>
                      {employee.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.skills?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Details
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
