import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedPunchlistManager } from '@/components/field/EnhancedPunchlistManager';
import { InteractiveFieldMap } from '@/components/field/InteractiveFieldMap';
import { DispatchManager } from '@/components/field/DispatchManager';
import { SiteWalkthrough } from '@/components/field/SiteWalkthrough';
import { SubcontractorManagement } from '@/components/subcontractors/SubcontractorManagement';
import { FieldDataCollectionDialog } from '@/components/field/FieldDataCollectionDialog';
import UtilityConflictsTab from '@/components/utility/UtilityConflictsTab';
import UtilityMeetingsTab from '@/components/projects/utility-meetings/UtilityMeetingsTab';
import { 
  usePunchlistItems, 
  useWorkOrders, 
  useFieldWorkers, 
  useSubcontractors,
  useUtilityAdjustments,
  useEquipmentTracking,
  useDispatchAssignments
} from '@/hooks/useFieldOperations';
import { 
  MapPin, 
  AlertTriangle, 
  Wrench, 
  Users, 
  Building, 
  Calendar,
  Truck,
  ClipboardList,
  Activity,
  TrendingUp
} from 'lucide-react';

const Field = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [isFieldDataDialogOpen, setIsFieldDataDialogOpen] = useState(false);
  
  // Get all field data
  const { punchlistItems, isLoading: punchlistLoading } = usePunchlistItems(selectedProjectId);
  const { workOrders, isLoading: workOrdersLoading } = useWorkOrders(selectedProjectId);
  const { fieldWorkers, activeWorkers } = useFieldWorkers();
  const { subcontractors, activeSubcontractors } = useSubcontractors();
  const { utilityAdjustments } = useUtilityAdjustments(selectedProjectId);
  const { equipment } = useEquipmentTracking(selectedProjectId);
  const { assignments } = useDispatchAssignments(selectedProjectId);

  // Calculate statistics
  const stats = {
    totalPunchlistItems: punchlistItems.length,
    openPunchlistItems: punchlistItems.filter((item: any) => item.status === 'open').length,
    criticalIssues: punchlistItems.filter((item: any) => item.severity === 'critical').length,
    activeWorkOrders: workOrders.filter((order: any) => order.status === 'in-progress').length,
    totalWorkOrders: workOrders.length,
    activeWorkers: activeWorkers.length,
    totalWorkers: fieldWorkers.length,
    activeSubcontractors: activeSubcontractors.length,
    equipmentInUse: equipment.filter((eq: any) => eq.status === 'in-use').length,
    totalEquipment: equipment.length,
    pendingUtilityWork: utilityAdjustments.filter((ua: any) => ua.status === 'scheduled').length,
    activeAssignments: assignments.filter((a: any) => a.status === 'in-progress').length
  };

  const isLoading = punchlistLoading || workOrdersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading field data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Field Operations</h1>
            <p className="text-muted-foreground">
              Manage field activities, track progress, and coordinate teams
            </p>
          </div>
          <FieldDataCollectionDialog 
            open={isFieldDataDialogOpen} 
            onOpenChange={setIsFieldDataDialogOpen} 
          />
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openPunchlistItems}</div>
              <p className="text-xs text-muted-foreground">
                {stats.criticalIssues} critical
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant={stats.criticalIssues > 0 ? "destructive" : "secondary"}>
                  {stats.totalPunchlistItems} total
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeWorkOrders}</div>
              <p className="text-xs text-muted-foreground">
                in progress
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline">
                  {stats.totalWorkOrders} total
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Field Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeWorkers}</div>
              <p className="text-xs text-muted-foreground">
                currently active
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline">
                  {stats.totalWorkers} total
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.equipmentInUse}</div>
              <p className="text-xs text-muted-foreground">
                currently in use
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline">
                  {stats.totalEquipment} total
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Live Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.activeAssignments} active assignments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Productivity</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.activeWorkOrders / Math.max(stats.totalWorkOrders, 1)) * 100)}% completion rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Upcoming</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingUtilityWork} utility adjustments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="walkthrough" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 bg-transparent p-0 h-auto">
            <TabsTrigger value="walkthrough" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="h-4 w-4" />
              Walkthrough
            </TabsTrigger>
            <TabsTrigger value="utility-conflicts" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <AlertTriangle className="h-4 w-4" />
              Utility Conflicts
            </TabsTrigger>
            <TabsTrigger value="utility-meetings" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4" />
              Utility Meetings
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="h-4 w-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="dispatch" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4" />
              Dispatch
            </TabsTrigger>
            <TabsTrigger value="subcontractors" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building className="h-4 w-4" />
              Subcontractors
            </TabsTrigger>
            <TabsTrigger value="workers" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              Workers
            </TabsTrigger>
            <TabsTrigger value="punchlist" className="flex items-center gap-2 bg-background border hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <AlertTriangle className="h-4 w-4" />
              Punchlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <InteractiveFieldMap projectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="punchlist" className="space-y-4">
            <EnhancedPunchlistManager projectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="dispatch" className="space-y-4">
            <DispatchManager />
          </TabsContent>

          <TabsContent value="walkthrough" className="space-y-4">
            <SiteWalkthrough />
          </TabsContent>

          <TabsContent value="utility-conflicts" className="space-y-4">
            <UtilityConflictsTab projectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="utility-meetings" className="space-y-4">
            <UtilityMeetingsTab projectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="subcontractors" className="space-y-4">
            <SubcontractorManagement />
          </TabsContent>

          <TabsContent value="workers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fieldWorkers.map((worker: any) => (
                <Card key={worker.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{worker.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{worker.role}</p>
                      </div>
                      <Badge variant={worker.status === 'active' ? 'default' : 'secondary'}>
                        {worker.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Employee ID:</span>
                        <span className="font-mono">{worker.employee_id}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Specialties:</span>
                        <div className="flex flex-wrap gap-1">
                          {worker.specialty?.slice(0, 2).map((spec: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {worker.contact_phone && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Phone:</span>
                          <span>{worker.contact_phone}</span>
                        </div>
                      )}
                      {worker.current_location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span className="text-muted-foreground">Location tracked</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {fieldWorkers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No field workers found</h3>
                <p className="text-muted-foreground">
                  Field workers will appear here once they're added to the system
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default Field;
