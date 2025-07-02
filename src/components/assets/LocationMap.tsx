import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Fuel, Calendar, Settings, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const mockMapData = [
  { id: "VEH-001", name: "Dump Truck #1", lat: 33.748997, lng: -84.387985, status: "in-use", project: "I-85 Bridge Repair" },
  { id: "VEH-002", name: "Excavator #2", lat: 33.749897, lng: -84.389985, status: "available" },
  { id: "VEH-003", name: "Pickup #5", lat: 33.746997, lng: -84.385985, status: "maintenance" },
];

export function LocationMap() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Asset Location Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-muted-foreground">Real-time asset tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockMapData.map((asset) => (
                <div key={asset.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.id}</p>
                    </div>
                    <Badge variant={asset.status === "in-use" ? "default" : asset.status === "available" ? "secondary" : "destructive"}>
                      {asset.status}
                    </Badge>
                  </div>
                  {asset.project && (
                    <p className="text-sm">Project: {asset.project}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Lat: {asset.lat}, Lng: {asset.lng}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Track on Map
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}