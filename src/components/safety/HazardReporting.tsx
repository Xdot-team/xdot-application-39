
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HazardType, IncidentSeverity } from "@/types/safety";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type HazardFormData = {
  type: HazardType;
  description: string;
  location: string;
  projectId?: string;
  severity: IncidentSeverity;
  photos?: FileList;
  mitigationSteps?: string;
};

export function HazardReporting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const form = useForm<HazardFormData>({
    defaultValues: {
      type: "other",
      description: "",
      location: "",
      severity: "medium",
      mitigationSteps: "",
    }
  });

  const onSubmit = (data: HazardFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitted hazard:", data);
      toast.success("Hazard reported successfully", {
        description: "Your report has been submitted to safety personnel"
      });
      form.reset();
      setPhotoPreview(null);
      setIsSubmitting(false);
    }, 1500);
  };
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Report a Hazard</CardTitle>
          <CardDescription>
            Use this form to report potential hazards on your worksite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hazard Type</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hazard type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fall">Fall Hazard</SelectItem>
                          <SelectItem value="electrical">Electrical Hazard</SelectItem>
                          <SelectItem value="chemical">Chemical Hazard</SelectItem>
                          <SelectItem value="fire">Fire Hazard</SelectItem>
                          <SelectItem value="structural">Structural Hazard</SelectItem>
                          <SelectItem value="equipment">Equipment Hazard</SelectItem>
                          <SelectItem value="environmental">Environmental Hazard</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        High severity hazards trigger immediate notifications
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Building A, Floor 2, Room 201" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the hazard in detail..." 
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mitigationSteps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Mitigation Steps (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Suggest steps to address this hazard..." 
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Photos (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo-upload")?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-border">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormItem>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Hazard Report"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
