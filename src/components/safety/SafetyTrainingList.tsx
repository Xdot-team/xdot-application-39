import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSafetyTrainings } from "@/data/mockSafetyData";
import { SafetyTraining } from "@/types/safety";
import { Clock, FileCheck, Users } from "lucide-react";

export function SafetyTrainingList() {
  const [trainings] = useState<SafetyTraining[]>(mockSafetyTrainings as SafetyTraining[]);

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "once":
        return "bg-slate-100 text-slate-800";
      case "monthly":
        return "bg-red-100 text-red-800";
      case "quarterly":
        return "bg-amber-100 text-amber-800";
      case "annually":
        return "bg-green-100 text-green-800";
      case "biannually":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainings.map((training) => (
          <Card key={training.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{training.title}</CardTitle>
                <Badge className={getFrequencyColor(training.frequency)}>
                  {training.frequency}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {training.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{training.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Required for: {training.requiredFor.join(", ")}</span>
                </div>
                {training.certificationProduced && (
                  <div className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    <span>Provides certification</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button size="sm">Schedule Training</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
