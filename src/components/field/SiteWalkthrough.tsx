
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Camera, Route } from 'lucide-react';

export function SiteWalkthrough() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Site Walkthrough</CardTitle>
          <CardDescription>Document site conditions and take detailed measurements</CardDescription>
        </div>
        <Button>
          <MapPin className="mr-2 h-4 w-4" />
          Start Walkthrough
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-center p-4 bg-muted rounded-md">
              <div className="text-center">
                <Route className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">Walkthrough Route Tracking</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Record your path through the project site
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input id="project" placeholder="Select project..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspector">Inspector</Label>
                <Input id="inspector" placeholder="Enter name..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location details..." />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Site Observations</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter detailed notes about site conditions..." 
                className="min-h-32"
              />
            </div>
            
            <div className="grid gap-4">
              <Label>Photo Documentation</Label>
              <div className="flex flex-col items-center p-8 text-center border-2 border-dashed rounded-md">
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Add Photos</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Drag and drop or click to upload
                </p>
                <Button variant="outline" size="sm">
                  Upload Photos
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Save Draft</Button>
            <Button>Complete Walkthrough</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Site walkthroughs help with accurate estimating and pre-construction planning
        </p>
      </CardFooter>
    </Card>
  );
}
