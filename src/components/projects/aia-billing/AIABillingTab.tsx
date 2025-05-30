
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIABillingList from './AIABillingList';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlusCircle, ClipboardList } from 'lucide-react';

interface AIABillingTabProps {
  projectId: string;
}

const AIABillingTab = ({ projectId }: AIABillingTabProps) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">AIA Billing</h3>
          <p className="text-muted-foreground">
            Manage AIA G702/G703 applications for payment and billing cycles
          </p>
        </div>
        <Button 
          className="mt-2 sm:mt-0" 
          onClick={() => setActiveTab(activeTab === 'list' ? 'add' : 'list')}
        >
          {activeTab === 'list' ? (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Application
            </>
          ) : (
            <>
              <ClipboardList className="mr-2 h-4 w-4" />
              View Applications
            </>
          )}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <AIABillingList projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIABillingTab;
