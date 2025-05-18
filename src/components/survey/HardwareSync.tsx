
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link2, RefreshCw, Settings, AlertCircle, Check, X, Bluetooth, WifiOff, Wifi } from "lucide-react";
import { useState } from "react";

export function HardwareSync() {
  const [syncing, setSyncing] = useState(false);
  
  const handleSync = () => {
    setSyncing(true);
    // Simulate sync process
    setTimeout(() => {
      setSyncing(false);
    }, 2500);
  };
  
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Hardware Sync Status</h2>
          <p className="text-sm text-muted-foreground">
            Connect and sync data with field survey equipment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Sync Status Messages */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Last automated sync completed successfully on May 18, 2025 at 8:45 AM.
        </AlertDescription>
      </Alert>
      
      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Hardware</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Device 1 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Bluetooth className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Trimble R12i GNSS</h3>
                  <p className="text-xs text-muted-foreground">Serial: TR12-5463-892</p>
                </div>
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Settings</Button>
                <Button variant="destructive" size="sm">Disconnect</Button>
              </div>
            </div>
            
            {/* Device 2 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Wifi className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Leica TS16 Total Station</h3>
                  <p className="text-xs text-muted-foreground">Serial: LTS16-7739-102</p>
                </div>
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Settings</Button>
                <Button variant="destructive" size="sm">Disconnect</Button>
              </div>
            </div>
            
            {/* Device 3 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <WifiOff className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">Topcon GLS-2000 Scanner</h3>
                  <p className="text-xs text-muted-foreground">Serial: TGS-8821-455</p>
                </div>
                <Badge variant="outline" className="ml-2">Disconnected</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm">Connect</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Auto Sync</h3>
                <p className="text-xs text-muted-foreground">Automatically sync data when devices connect</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Schedule Daily Sync</h3>
                <p className="text-xs text-muted-foreground">Perform a daily sync at specified time</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Cloud Backup</h3>
                <p className="text-xs text-muted-foreground">Store a backup copy of all data in secure cloud</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Firmware Auto-Update</h3>
                <p className="text-xs text-muted-foreground">Keep device firmware updated automatically</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Notification on Sync Issues</h3>
                <p className="text-xs text-muted-foreground">Receive alerts when sync fails</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium">Date & Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Device</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Data Size</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2 text-xs">May 18, 2025 8:45 AM</td>
                  <td className="px-4 py-2 text-xs">Trimble R12i GNSS</td>
                  <td className="px-4 py-2 text-xs">2.3 GB</td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" />
                      <span>Success</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-xs">May 18, 2025 8:42 AM</td>
                  <td className="px-4 py-2 text-xs">Leica TS16 Total Station</td>
                  <td className="px-4 py-2 text-xs">1.7 GB</td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" />
                      <span>Success</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-xs">May 17, 2025 5:30 PM</td>
                  <td className="px-4 py-2 text-xs">Topcon GLS-2000 Scanner</td>
                  <td className="px-4 py-2 text-xs">5.8 GB</td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-3 w-3" />
                      <span>Failed</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-xs">May 17, 2025 2:15 PM</td>
                  <td className="px-4 py-2 text-xs">Trimble R12i GNSS</td>
                  <td className="px-4 py-2 text-xs">1.9 GB</td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" />
                      <span>Success</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-xs">May 17, 2025 10:30 AM</td>
                  <td className="px-4 py-2 text-xs">Leica TS16 Total Station</td>
                  <td className="px-4 py-2 text-xs">2.1 GB</td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" />
                      <span>Success</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
