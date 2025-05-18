
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, MapPin } from "lucide-react";

interface FieldDataCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FieldDataCollectionDialog({ open, onOpenChange }: FieldDataCollectionDialogProps) {
  const [formData, setFormData] = useState({
    type: "issue",
    title: "",
    description: "",
    location: "",
    priority: "medium",
  });

  const [step, setStep] = useState<"info" | "location" | "photo">("info");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would save the data
    toast.success("Field data successfully submitted!");
    onOpenChange(false);
    
    // Reset the form
    setFormData({
      type: "issue",
      title: "",
      description: "",
      location: "",
      priority: "medium",
    });
    setStep("info");
  };

  const handleNextStep = () => {
    if (step === "info") {
      if (!formData.title) {
        toast.error("Please enter a title");
        return;
      }
      setStep("location");
    } else if (step === "location") {
      if (!formData.location) {
        toast.error("Please enter a location");
        return;
      }
      setStep("photo");
    }
  };

  const handlePreviousStep = () => {
    if (step === "location") {
      setStep("info");
    } else if (step === "photo") {
      setStep("location");
    }
  };

  const captureLocation = () => {
    // In a real app, this would use the device's GPS
    toast.info("Getting your current location...");
    setTimeout(() => {
      handleChange("location", "33.7490, -84.3880 (Current Location)");
      toast.success("Location captured!");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Field Data Collection</DialogTitle>
          <DialogDescription>
            Record field observations, issues, or progress updates.
          </DialogDescription>
        </DialogHeader>

        {step === "info" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue">Issue/Problem</SelectItem>
                  <SelectItem value="observation">Observation</SelectItem>
                  <SelectItem value="progress">Progress Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Brief summary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Provide details..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === "location" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex space-x-2">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="GPS coordinates or location description"
                  className="flex-1"
                />
                <Button variant="outline" type="button" onClick={captureLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-md">
              <p className="text-sm text-slate-600">
                Add location details or use the pin button to capture your current GPS coordinates.
              </p>
            </div>
          </div>
        )}

        {step === "photo" && (
          <div className="space-y-4 py-4">
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-md h-[200px] flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                <p className="mb-2 text-sm text-slate-600">Tap to take a photo</p>
                <Button variant="secondary" size="sm">
                  Take Photo
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Photos help document field conditions accurately
            </p>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          {step !== "info" ? (
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          ) : (
            <span></span>
          )}
          
          {step !== "photo" ? (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
