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
import { Clock, MapPin, Camera, User } from "lucide-react";
import { useTimeClock, useEmployeeProfiles } from "@/hooks/useWorkforceManagement";
import { toast } from "@/hooks/use-toast";
import { TimeClockRecord } from "@/types/employee";

interface TimeClockFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = {
  employee_id: string;
  project_id?: string;
  notes?: string;
};

export function TimeClockForm({ open, onOpenChange }: TimeClockFormProps) {
  const { clockIn, clockOut } = useTimeClock();
  const { employees } = useEmployeeProfiles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<GeolocationPosition | null>(null);
  const [photo, setPhoto] = useState<string>("");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>();

  const selectedEmployeeId = watch("employee_id");

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation(position);
          toast({
            title: "Location captured",
            description: "GPS coordinates recorded for clock in/out",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get current location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg');
        setPhoto(dataURL);
        
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Photo captured",
          description: "Photo will be attached to time record",
        });
      });
    } catch (error) {
      toast({
        title: "Camera error",
        description: "Could not access camera",
        variant: "destructive",
      });
    }
  };

  const onClockIn = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      const location = gpsLocation ? {
        lat: gpsLocation.coords.latitude,
        lng: gpsLocation.coords.longitude
      } : undefined;

      await clockIn(data.employee_id, location, photo);
      
      reset();
      setPhoto("");
      setGpsLocation(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clock in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Clock
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onClockIn)} className="space-y-6">
          {/* Employee Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Select Employee *</Label>
                <Select 
                  value={selectedEmployeeId} 
                  onValueChange={(value) => setValue("employee_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {employee.first_name} {employee.last_name} - {employee.employee_id}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee_id && (
                  <p className="text-sm text-destructive">Please select an employee</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_id">Project (Optional)</Label>
                <Input
                  id="project_id"
                  {...register("project_id")}
                  placeholder="Project ID or name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location & Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={getCurrentLocation}
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {gpsLocation ? "Location Captured" : "Get Location"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={capturePhoto}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {photo ? "Photo Captured" : "Take Photo"}
                </Button>
              </div>

              {gpsLocation && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Location:</strong> {gpsLocation.coords.latitude.toFixed(6)}, {gpsLocation.coords.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accuracy: ±{gpsLocation.coords.accuracy.toFixed(0)} meters
                  </p>
                </div>
              )}

              {photo && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-green-600">
                    <strong>Photo:</strong> Verification photo captured
                  </p>
                </div>
              )}
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
                placeholder="Any additional notes for this time entry..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedEmployeeId}>
              {isSubmitting ? "Clocking In..." : "Clock In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}