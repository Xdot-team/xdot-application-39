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
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Safety Training Sessions</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>
      
      {trainings.length === 0 ? (
        <div className="text-center py-8">
          <FileCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Training Sessions</h3>
          <p className="text-sm text-muted-foreground">No safety training sessions scheduled yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainings.map((training) => (
            <Card key={training.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{training.session_name}</CardTitle>
                  <Badge className={getStatusColor(training.status)}>
                    {training.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  {training.training_type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{new Date(training.session_date).toLocaleDateString()} at {training.start_time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Instructor: {training.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    <span>Location: {training.location}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Register</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
