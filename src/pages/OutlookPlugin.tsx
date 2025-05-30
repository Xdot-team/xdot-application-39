import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OutlookPluginProvider } from '@/components/plugins/outlook/OutlookPluginProvider';
import { OutlookSidebar } from '@/components/plugins/outlook/OutlookSidebar';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';

function OutlookPluginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outlook Plugin</h1>
        <p className="text-muted-foreground italic">
          Seamlessly integrate xDOTContractor with Microsoft Outlook
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-1 xl:col-span-2 xl:row-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Plugin Preview</CardTitle>
            <CardDescription>
              Experience how the xDOTContractor plugin looks inside Microsoft Outlook
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ maxWidth: '350px', height: '600px' }}>
              <OutlookPluginProvider>
                <OutlookSidebar />
              </OutlookPluginProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Folder Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access project-specific folders directly within Outlook. View RFIs, submittals, change orders, and other documents without leaving your email.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Browse project documents by category</li>
              <li>Search across all projects</li>
              <li>Quick access to recent files</li>
              <li>Role-specific document access</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Notification Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with project notifications synced to Outlook. Never miss a deadline or important update with automatic task creation.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Priority-based notification display</li>
              <li>Sync with Outlook calendar and tasks</li>
              <li>Direct links to xDOTContractor tasks</li>
              <li>Filter notifications by project or type</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Email Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Compose professional construction emails easily with AI-powered templates. Contextually aware of project data and recipient roles.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Pre-built templates for common scenarios</li>
              <li>Auto-fill with project information</li>
              <li>Document attachment from xDOTContractor</li>
              <li>Response suggestions based on email content</li>
            </ul>
            <div className="mt-4">
              <Button className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Install Outlook Plugin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Implementation details */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
          <CardDescription>
            How to deploy the xDOTContractor Outlook Plugin for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-lg mb-2">1. Installation</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy the plugin through Microsoft 365 admin center. Compatible with Outlook web, desktop, and mobile applications.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-lg mb-2">2. Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to your xDOTContractor instance using API keys. Configure role-based permissions and notification preferences.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-lg mb-2">3. User Onboarding</h3>
                <p className="text-sm text-muted-foreground">
                  Single sign-on enabled. Users login once with their xDOTContractor credentials for seamless access.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Technical Requirements</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>Microsoft 365 subscription with Outlook</li>
                <li>xDOTContractor version 2.5 or higher</li>
                <li>API access enabled for your xDOTContractor instance</li>
                <li>Administrator rights in Microsoft 365 admin center</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" className="mr-2">Download Documentation</Button>
              <Button>
                Request Installation <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OutlookPluginPage;
