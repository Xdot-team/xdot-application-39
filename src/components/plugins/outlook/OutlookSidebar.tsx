
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FolderOpen, Bell, Mail } from 'lucide-react';
import { useOutlookPlugin } from './OutlookPluginProvider';
import { ProjectFolderView } from './ProjectFolderView';
import { NotificationsView } from './NotificationsView';
import { EmailAssistant } from './EmailAssistant';

type OutlookTabType = 'folders' | 'notifications' | 'email';

export function OutlookSidebar() {
  const { isAuthenticated } = useOutlookPlugin();
  const [activeTab, setActiveTab] = useState<OutlookTabType>('folders');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <Card className="w-full h-full max-w-xs bg-slate-50">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">You need to be logged in to use the xDOT Plugin</p>
            <Button>Log In</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full max-w-xs overflow-hidden flex flex-col bg-slate-50">
      <CardHeader className="px-4 py-3 bg-[#0b1d35] text-white border-b border-gray-200">
        <CardTitle className="text-lg font-semibold flex items-center">
          <span className="mr-2">xDOTContractor</span>
          <span className="text-xs bg-construction-primary px-2 py-1 rounded-full">Outlook</span>
        </CardTitle>
      </CardHeader>

      <div className="relative p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects or documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <Button
          variant={activeTab === 'folders' ? 'default' : 'ghost'}
          className={`flex-1 rounded-none ${activeTab === 'folders' ? 'bg-[#0b1d35] text-white' : ''}`}
          onClick={() => setActiveTab('folders')}
        >
          <FolderOpen className="h-4 w-4 mr-1" />
          Folders
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'ghost'}
          className={`flex-1 rounded-none ${activeTab === 'notifications' ? 'bg-[#0b1d35] text-white' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell className="h-4 w-4 mr-1" />
          Notifications
        </Button>
        <Button
          variant={activeTab === 'email' ? 'default' : 'ghost'}
          className={`flex-1 rounded-none ${activeTab === 'email' ? 'bg-[#0b1d35] text-white' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          <Mail className="h-4 w-4 mr-1" />
          Email
        </Button>
      </div>

      <CardContent className="flex-1 p-0 overflow-auto">
        {activeTab === 'folders' && <ProjectFolderView searchQuery={searchQuery} />}
        {activeTab === 'notifications' && <NotificationsView searchQuery={searchQuery} />}
        {activeTab === 'email' && <EmailAssistant searchQuery={searchQuery} />}
      </CardContent>

      <div className="p-2 border-t border-gray-200 text-xs text-center text-muted-foreground">
        xDOTContractor Outlook Plugin v1.0
      </div>
    </Card>
  );
}
