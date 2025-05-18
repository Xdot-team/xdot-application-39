
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cube, Download, Share2, Eye } from "lucide-react";
import { useState } from "react";

export function VisualizationView() {
  const [selectedProject, setSelectedProject] = useState("highway101");
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="highway101">Highway 101 Bridge</SelectItem>
            <SelectItem value="peachtree">Peachtree Street Extension</SelectItem>
            <SelectItem value="i85">I-85 North Resurfacing</SelectItem>
            <SelectItem value="metrostation">Downtown Metro Station</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Visualization Tabs */}
      <Tabs defaultValue="terrain">
        <TabsList>
          <TabsTrigger value="terrain">Terrain Model</TabsTrigger>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="overlay">Data Overlay</TabsTrigger>
          <TabsTrigger value="sections">Cross-Sections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terrain" className="mt-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Cube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">3D Terrain Visualization</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Interactive 3D model would render here
                  </p>
                  <Button className="mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    View in Full Screen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buildings" className="mt-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Cube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Buildings 3D Model</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Building models would render here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overlay" className="mt-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Cube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Data Overlay Visualization</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Data overlay visualization would render here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sections" className="mt-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Cube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Cross-Sections View</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cross-sections would render here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Data Information */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,873</div>
            <p className="text-xs text-muted-foreground">Last collected on May 15, 2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Area Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 km²</div>
            <p className="text-xs text-muted-foreground">Terrain and surroundings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 cm</div>
            <p className="text-xs text-muted-foreground">Terrain point density</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
