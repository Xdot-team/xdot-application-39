import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSafetyTraining } from "@/hooks/useSafetyData";
import { Clock, FileCheck, Users, Plus, Loader2 } from "lucide-react";

export function SafetyTrainingList() {
  const { sessions: trainings, loading } = useSafetyTraining();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading training sessions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Safety Training Sessions</h3>
        <Button className="self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Session</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
      
      {trainings.length === 0 ? (
        <div className="text-center py-8">
          <FileCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Training Sessions</h3>
          <p className="text-sm text-muted-foreground">No safety training sessions scheduled yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {trainings.map((training) => (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <CardTitle className="text-base sm:text-lg leading-tight">{training.session_name}</CardTitle>
                  <Badge className={`${getStatusColor(training.status)} text-xs whitespace-nowrap`}>
                    {training.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription className="mt-1 text-sm">
                  {training.training_type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm mb-4">
                  <div className="flex items-start sm:items-center">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span className="break-words">{new Date(training.session_date).toLocaleDateString()} at {training.start_time}</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <Users className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span className="break-words">Instructor: {training.instructor}</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <FileCheck className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span className="break-words">Location: {training.location}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                  </Button>
                  <Button size="sm" className="text-xs sm:text-sm">Register</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
