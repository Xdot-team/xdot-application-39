
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Construction, Search, Upload, Download, FileText, Layers } from "lucide-react";

export function ConstructionLayoutView() {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select defaultValue="highway101">
          <SelectTrigger>
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="highway101">Highway 101 Bridge</SelectItem>
            <SelectItem value="peachtree">Peachtree Street Extension</SelectItem>
            <SelectItem value="i85">I-85 North Resurfacing</SelectItem>
            <SelectItem value="metrostation">Downtown Metro Station</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search layouts..." className="pl-8" />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="flex-1">
            <Construction className="h-4 w-4 mr-2" />
            New Layout
          </Button>
        </div>
      </div>
      
      {/* Layout Display */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-muted h-[500px] flex items-center justify-center">
            <div className="text-center">
              <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Construction Layout Visualization</p>
              <p className="text-sm text-muted-foreground mt-2">
                Interactive construction layout would render here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Layout Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-base">Layer Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <span>Foundation Layout</span>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-red-500" />
                  <span>Utility Lines</span>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-green-500" />
                  <span>Grading Plan</span>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-500" />
                  <span>Structural Elements</span>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-500" />
                  <span>Building Footprint</span>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-base">Layout Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left text-xs font-medium">Point ID</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Coordinates</th>
                    <th className="px-3 py-2 text-center text-xs font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 text-xs">LP-101</td>
                    <td className="px-3 py-2 text-xs">Corner</td>
                    <td className="px-3 py-2 text-xs">34.0522° N, 118.2437° W</td>
                    <td className="px-3 py-2 text-xs text-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs">LP-102</td>
                    <td className="px-3 py-2 text-xs">Utility</td>
                    <td className="px-3 py-2 text-xs">34.0525° N, 118.2441° W</td>
                    <td className="px-3 py-2 text-xs text-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs">LP-103</td>
                    <td className="px-3 py-2 text-xs">Column</td>
                    <td className="px-3 py-2 text-xs">34.0518° N, 118.2430° W</td>
                    <td className="px-3 py-2 text-xs text-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs">LP-104</td>
                    <td className="px-3 py-2 text-xs">Grade</td>
                    <td className="px-3 py-2 text-xs">34.0530° N, 118.2445° W</td>
                    <td className="px-3 py-2 text-xs text-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs">LP-105</td>
                    <td className="px-3 py-2 text-xs">Wall</td>
                    <td className="px-3 py-2 text-xs">34.0527° N, 118.2432° W</td>
                    <td className="px-3 py-2 text-xs text-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
