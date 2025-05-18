
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChangeOrderList from './ChangeOrderList';
import ChangeOrderForm from './ChangeOrderForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ChangeOrdersTabProps {
  projectId: string;
}

const ChangeOrdersTab = ({ projectId }: ChangeOrdersTabProps) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">Change Orders</h3>
          <p className="text-muted-foreground">
            Manage project scope, cost and schedule changes
          </p>
        </div>
        {canEdit && (
          <Button 
            className="mt-2 sm:mt-0" 
            onClick={() => setActiveTab(activeTab === 'list' ? 'add' : 'list')}
          >
            {activeTab === 'list' ? (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Change Order
              </>
            ) : (
              <>
                <ClipboardList className="mr-2 h-4 w-4" />
                View Change Orders
              </>
            )}
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {activeTab === 'list' ? (
            <ChangeOrderList projectId={projectId} />
          ) : (
            <ChangeOrderForm projectId={projectId} onComplete={() => setActiveTab('list')} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeOrdersTab;
