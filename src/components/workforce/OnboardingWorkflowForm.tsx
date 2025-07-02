import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserPlus, Calendar, FileText, CheckCircle } from "lucide-react";
import { useEmployeeProfiles } from "@/hooks/useWorkforceManagement";
import { toast } from "@/hooks/use-toast";

interface OnboardingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = {
  employee_id: string;
  workflow_template: string;
  assigned_hr_rep: string;
  assigned_buddy_id?: string;
  expected_completion_date: string;
  notes?: string;
};

export function OnboardingWorkflowForm({ open, onOpenChange }: OnboardingFormProps) {
  const { employees } = useEmployeeProfiles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // TODO: Create onboarding workflow in database
      toast({
        title: "Success",
        description: "Onboarding workflow created successfully",
      });
      
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create onboarding workflow",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            New Employee Onboarding
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Select Employee *</Label>
                  <Select 
                    value={watch("employee_id")} 
                    onValueChange={(value) => setValue("employee_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name} - {employee.employee_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflow_template">Workflow Template *</Label>
                  <Select 
                    value={watch("workflow_template")} 
                    onValueChange={(value) => setValue("workflow_template", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Onboarding</SelectItem>
                      <SelectItem value="manager">Manager Onboarding</SelectItem>
                      <SelectItem value="field_worker">Field Worker</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_hr_rep">HR Representative *</Label>
                  <Input
                    id="assigned_hr_rep"
                    {...register("assigned_hr_rep", { required: "HR rep is required" })}
                    placeholder="HR representative name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_buddy_id">Onboarding Buddy</Label>
                  <Select 
                    value={watch("assigned_buddy_id")} 
                    onValueChange={(value) => setValue("assigned_buddy_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select buddy (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_completion_date">Expected Completion Date *</Label>
                <Input
                  id="expected_completion_date"
                  type="date"
                  {...register("expected_completion_date", { required: "Completion date is required" })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Workflow"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}