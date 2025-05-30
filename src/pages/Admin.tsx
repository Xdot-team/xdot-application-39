
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
import KickoffMeetings from '@/components/admin/KickoffMeetings';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');

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
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 lg:w-full mb-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="forum">Community Forum</TabsTrigger>
          <TabsTrigger value="tasks">Head Office Tasks</TabsTrigger>
          <TabsTrigger value="frontdesk">Front Desk</TabsTrigger>
          <TabsTrigger value="appreciations">Appreciations</TabsTrigger>
          <TabsTrigger value="kickoff">Kickoff Meetings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
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

        <TabsContent value="kickoff" className="space-y-4">
          <KickoffMeetings />
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

export default Admin;
