
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DispatchManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch Manager</CardTitle>
        <CardDescription>Assign tasks and track field crew movements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-72">
          <div className="text-center">
            <p className="text-muted-foreground">Dispatch functionality will be available once Supabase integration is complete.</p>
            <p className="text-xs text-muted-foreground mt-2">
              Will allow assignment of work orders, tracking of field personnel, and management of equipment dispatch
            </p>
            <Button className="mt-4" variant="outline" disabled>Coming Soon</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
