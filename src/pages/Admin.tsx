
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { UserManagement } from '@/components/admin/UserManagement';
import { ForumDiscussions } from '@/components/admin/ForumDiscussions';
import { HeadOfficeTasks } from '@/components/admin/HeadOfficeTasks';
import { FrontDeskManager } from '@/components/admin/FrontDeskManager';
import { EmployeeAppreciations } from '@/components/admin/EmployeeAppreciations';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { useAuth } from '@/contexts/AuthContext';
import { requireAuth } from '@/contexts/AuthContext';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  const isFrontDesk = authState.user?.role === 'hr'; // Using HR as proxy for front desk

  return (
    <div className="space-y-6">
      {/* Header with Construct for Centuries text */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <PageHeader 
          heading="Administration"
          subheading="System management and user engagement tools"
        />
        <div className="py-2 px-4 bg-slate-100 rounded-md text-sm text-slate-600 font-medium">
          Construct for Centuries
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[900px] mb-4">
          <TabsTrigger value="users" disabled={!isAdmin}>User Management</TabsTrigger>
          <TabsTrigger value="forum">Community Forum</TabsTrigger>
          <TabsTrigger value="tasks" disabled={!isAdmin}>Head Office Tasks</TabsTrigger>
          <TabsTrigger value="frontdesk" disabled={!isAdmin && !isFrontDesk}>Front Desk</TabsTrigger>
          <TabsTrigger value="appreciations">Appreciations</TabsTrigger>
          <TabsTrigger value="settings" disabled={!isAdmin}>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="forum" className="space-y-4">
          <ForumDiscussions />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <HeadOfficeTasks />
        </TabsContent>

        <TabsContent value="frontdesk" className="space-y-4">
          <FrontDeskManager />
        </TabsContent>

        <TabsContent value="appreciations" className="space-y-4">
          <EmployeeAppreciations />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default requireAuth(['admin', 'hr'])(Admin);
