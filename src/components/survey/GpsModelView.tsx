
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Download, RefreshCcw, Layers } from "lucide-react";

export function GpsModelView() {
  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Select defaultValue="highway101">
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
            <Layers className="h-4 w-4 mr-2" />
            Layer Manager
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Model
          </Button>
          <Button size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Update Model
          </Button>
        </div>
      </div>
      
      {/* GPS Model Display */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-muted h-[500px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">GPS Model Visualization</p>
              <p className="text-sm text-muted-foreground mt-2">
                GPS model would render here with interactive map and real-time coordinates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Control Points Table */}
      <Card>
        <CardHeader>
          <CardTitle>GPS Control Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left text-sm font-medium">Point ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Coordinates</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Elevation</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2 text-sm">CP-101</td>
                  <td className="px-4 py-2 text-sm">34.0522° N, 118.2437° W</td>
                  <td className="px-4 py-2 text-sm">102.5 m</td>
                  <td className="px-4 py-2 text-sm">Primary</td>
                  <td className="px-4 py-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-sm">May 15, 2025</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">CP-102</td>
                  <td className="px-4 py-2 text-sm">34.0525° N, 118.2441° W</td>
                  <td className="px-4 py-2 text-sm">103.2 m</td>
                  <td className="px-4 py-2 text-sm">Secondary</td>
                  <td className="px-4 py-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-sm">May 15, 2025</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">CP-103</td>
                  <td className="px-4 py-2 text-sm">34.0518° N, 118.2430° W</td>
                  <td className="px-4 py-2 text-sm">101.8 m</td>
                  <td className="px-4 py-2 text-sm">Reference</td>
                  <td className="px-4 py-2 text-sm">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Needs Verification
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-sm">May 16, 2025</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">CP-104</td>
                  <td className="px-4 py-2 text-sm">34.0530° N, 118.2445° W</td>
                  <td className="px-4 py-2 text-sm">104.1 m</td>
                  <td className="px-4 py-2 text-sm">Secondary</td>
                  <td className="px-4 py-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-sm">May 14, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
