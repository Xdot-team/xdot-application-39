
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { UserManagement } from '@/components/admin/UserManagement';
import { ForumDiscussions } from '@/components/admin/ForumDiscussions';
import { HeadOfficeTasks } from '@/components/admin/HeadOfficeTasks';
import { FrontDeskManager } from '@/components/admin/FrontDeskManager';
import { EmployeeAppreciations } from '@/components/admin/EmployeeAppreciations';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { ApiSettings } from '@/components/admin/ApiSettings';
import { useAuth } from '@/contexts/AuthContext';
import { requireAuth } from '@/contexts/AuthContext';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  const isFrontDesk = authState.user?.role === 'hr'; // Using HR as proxy for front desk

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <PageHeader 
          heading="Administration"
          subheading="System management and user engagement tools"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 lg:w-full mb-4">
          <TabsTrigger value="users" disabled={!isAdmin}>User Management</TabsTrigger>
          <TabsTrigger value="forum">Community Forum</TabsTrigger>
          <TabsTrigger value="tasks" disabled={!isAdmin}>Head Office Tasks</TabsTrigger>
          <TabsTrigger value="frontdesk" disabled={!isAdmin && !isFrontDesk}>Front Desk</TabsTrigger>
          <TabsTrigger value="appreciations">Appreciations</TabsTrigger>
          <TabsTrigger value="settings" disabled={!isAdmin}>Settings</TabsTrigger>
          <TabsTrigger value="api" disabled={!isAdmin}>API & Integrations</TabsTrigger>
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
        
        <TabsContent value="api" className="space-y-4">
          <ApiSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default requireAuth(['admin', 'hr'])(Admin);
