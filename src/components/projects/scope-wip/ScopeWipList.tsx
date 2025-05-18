
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScopeWIP } from '@/types/projects';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, BarChart2, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockScopeWIP } from '@/data/mockProjectNotes';

interface ScopeWipListProps {
  projectId: string;
}

function ScopeWipStatusBadge({ status }: { status: ScopeWIP['status'] }) {
  switch (status) {
    case 'completed':
      return <Badge variant="success" className="bg-green-600">Completed</Badge>;
    case 'in_progress':
      return <Badge variant="warning" className="bg-amber-500">In Progress</Badge>;
    case 'on_hold':
      return <Badge variant="default" className="bg-gray-500">On Hold</Badge>;
    default:
      return <Badge variant="secondary">Not Started</Badge>;
  }
}

function ProgressBar({ percentage }: { percentage: number }) {
  const getColorClass = (percentage: number) => {
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-amber-500";
    if (percentage < 75) return "bg-blue-500";
    return "bg-green-600";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${getColorClass(percentage)}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

const ScopeWipList = ({ projectId }: ScopeWipListProps) => {
  const [scopeItems, setScopeItems] = useState<ScopeWIP[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  
  useEffect(() => {
    // Get scope WIP items for this project
    const projectScopeItems = mockScopeWIP.filter(item => item.projectId === projectId);
    setScopeItems(projectScopeItems);
  }, [projectId]);

  const filteredItems = searchTerm 
    ? scopeItems.filter(item => 
        item.scopeDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.taskId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : scopeItems;

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scope items..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {canEdit && (
            <Button size="sm" className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium">No scope items found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Try adjusting your search term" : "Add your first scope item to get started"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{item.scopeDescription}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.taskId}
                    </p>
                  </div>
                  <ScopeWipStatusBadge status={item.status} />
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span>{item.progressPercentage}%</span>
                  </div>
                  <ProgressBar percentage={item.progressPercentage} />
                  <div className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    <BarChart2 className="h-4 w-4 mr-1" /> Details
                  </Button>
                  {canEdit && (
                    <Button size="sm">
                      <Clock className="h-4 w-4 mr-1" /> Update
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scope items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canEdit && (
          <Button>
            <Plus className="h-4 w-4 mr-1" /> Add Scope Item
          </Button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium">No scope items found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search term" : "Add your first scope item to get started"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Target End</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.taskId}</TableCell>
                  <TableCell className="font-medium">{item.scopeDescription}</TableCell>
                  <TableCell>
                    <div className="w-full max-w-[100px] space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{item.progressPercentage}%</span>
                      </div>
                      <ProgressBar percentage={item.progressPercentage} />
                    </div>
                  </TableCell>
                  <TableCell><ScopeWipStatusBadge status={item.status} /></TableCell>
                  <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.estimatedEndDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline">
                      <BarChart2 className="h-4 w-4 mr-1" /> Details
                    </Button>
                    {canEdit && (
                      <Button size="sm">
                        <Clock className="h-4 w-4 mr-1" /> Update
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ScopeWipList;
