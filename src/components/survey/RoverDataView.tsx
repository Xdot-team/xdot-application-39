
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Satellite, RefreshCcw, Download, Wifi, Battery, Database, Signal } from "lucide-react";

export function RoverDataView() {
  return (
    <div className="space-y-6">
      {/* Rover Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rovers</CardTitle>
            <Satellite className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Out of 5 total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Signal Strength</CardTitle>
            <Signal className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">All units connected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Collected</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4 GB</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10:32 AM</div>
            <p className="text-xs text-muted-foreground">May 18, 2025</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Rover List */}
      <Card>
        <CardHeader>
          <CardTitle>Rover Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Rover 1 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Rover R-5000</h3>
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Battery</p>
                  <div className="flex items-center gap-1">
                    <Battery className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Strong</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <span className="text-sm">Highway 101 Site</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operator</p>
                  <span className="text-sm">Michael Johnson</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Storage</span>
                  <span className="text-xs">62% used</span>
                </div>
                <Progress value={62} className="h-1" />
              </div>
            </div>
            
            {/* Rover 2 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Rover R-5001</h3>
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Battery</p>
                  <div className="flex items-center gap-1">
                    <Battery className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Good</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <span className="text-sm">Peachtree Site</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operator</p>
                  <span className="text-sm">Sarah Williams</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Storage</span>
                  <span className="text-xs">38% used</span>
                </div>
                <Progress value={38} className="h-1" />
              </div>
            </div>
            
            {/* Rover 3 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Rover R-5002</h3>
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Battery</p>
                  <div className="flex items-center gap-1">
                    <Battery className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Fair</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <span className="text-sm">I-85 North Site</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operator</p>
                  <span className="text-sm">David Thompson</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Storage</span>
                  <span className="text-xs">27% used</span>
                </div>
                <Progress value={27} className="h-1" />
              </div>
            </div>
            
            {/* Rover 4 */}
            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-gray-400" />
                  <h3 className="font-medium">Rover R-5003</h3>
                  <Badge variant="outline" className="ml-2">Inactive</Badge>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Battery</p>
                  <div className="flex items-center gap-1">
                    <Battery className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">0%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">None</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <span className="text-sm">Storage</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operator</p>
                  <span className="text-sm">None</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Sync Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button className="flex-1">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Sync All Data
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download All Raw Data
        </Button>
      </div>
    </div>
  );
}
