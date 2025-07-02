import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, User } from "lucide-react";
import { useEmployeeProfiles } from "@/hooks/useWorkforceManagement";
import { toast } from "@/hooks/use-toast";
import { EmployeeProfile } from "@/types/employee";

interface EmployeeFormProps {
  employee?: EmployeeProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = Omit<EmployeeProfile, 'id' | 'created_at' | 'updated_at'>;

export function EmployeeForm({ employee, open, onOpenChange }: EmployeeFormProps) {
  const { addEmployee, updateEmployee } = useEmployeeProfiles();
  const [skills, setSkills] = useState<string[]>(employee?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: employee || {
      employee_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      job_title: "",
      department: "",
      hire_date: new Date().toISOString().split('T')[0],
      pay_rate: 0,
      pay_type: "hourly",
      status: "active",
      skills: [],
      address: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      notes: ""
    }
  });

  const payType = watch("pay_type");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      if (employee) {
        await updateEmployee(employee.id, data);
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        await addEmployee(data);
        toast({
          title: "Success", 
          description: "Employee added successfully",
        });
      }
      
      reset();
      setSkills([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID *</Label>
                  <Input
                    id="employee_id"
                    {...register("employee_id", { required: "Employee ID is required" })}
                    placeholder="E10001"
                  />
                  {errors.employee_id && (
                    <p className="text-sm text-destructive">{errors.employee_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={watch("status")} 
                    onValueChange={(value) => setValue("status", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    {...register("first_name", { required: "First name is required" })}
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <p className="text-sm text-destructive">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    {...register("last_name", { required: "Last name is required" })}
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="text-sm text-destructive">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St, City, State 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    {...register("job_title", { required: "Job title is required" })}
                    placeholder="Project Manager"
                  />
                  {errors.job_title && (
                    <p className="text-sm text-destructive">{errors.job_title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    {...register("department", { required: "Department is required" })}
                    placeholder="Operations"
                  />
                  {errors.department && (
                    <p className="text-sm text-destructive">{errors.department.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hire_date">Hire Date *</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    {...register("hire_date", { required: "Hire date is required" })}
                  />
                  {errors.hire_date && (
                    <p className="text-sm text-destructive">{errors.hire_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pay_type">Pay Type</Label>
                  <Select 
                    value={payType} 
                    onValueChange={(value) => setValue("pay_type", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pay_rate">
                    Pay Rate * ({payType === "hourly" ? "$/hour" : "$/year"})
                  </Label>
                  <Input
                    id="pay_rate"
                    type="number"
                    step="0.01"
                    {...register("pay_rate", { 
                      required: "Pay rate is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Pay rate must be positive" }
                    })}
                    placeholder={payType === "hourly" ? "25.00" : "50000"}
                  />
                  {errors.pay_rate && (
                    <p className="text-sm text-destructive">{errors.pay_rate.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    {...register("emergency_contact_name")}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    {...register("emergency_contact_phone")}
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register("notes")}
                placeholder="Any additional notes about the employee..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : employee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}