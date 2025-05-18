
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AIABillingList from './AIABillingList';
import AIABillingForm from './AIABillingForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlusCircle, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface AIABillingTabProps {
  projectId: string;
}

const AIABillingTab = ({ projectId }: AIABillingTabProps) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">AIA Billing</h3>
          <p className="text-muted-foreground">
            Manage AIA G702/G703 pay applications
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
                New Pay Application
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                View Applications
              </>
            )}
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {activeTab === 'list' ? (
            <AIABillingList projectId={projectId} />
          ) : (
            <AIABillingForm projectId={projectId} onComplete={() => setActiveTab('list')} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIABillingTab;
