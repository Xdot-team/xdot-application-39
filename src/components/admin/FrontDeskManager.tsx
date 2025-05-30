
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, Clock, User, Building } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export function FrontDeskManager() {
  const [visitors, setVisitors] = useState([
    {
      id: '1',
      name: 'John Smith',
      company: 'ABC Construction',
      purpose: 'Project Meeting',
      checkIn: '2023-10-23T09:00:00Z',
      checkOut: null,
      host: 'Project Manager'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      company: 'XYZ Supplies',
      purpose: 'Equipment Delivery',
      checkIn: '2023-10-23T10:30:00Z',
      checkOut: '2023-10-23T11:15:00Z',
      host: 'Warehouse Manager'
    }
  ]);

  const handleCheckOut = (visitorId: string) => {
    setVisitors(visitors.map(visitor => 
      visitor.id === visitorId 
        ? { ...visitor, checkOut: new Date().toISOString() }
        : visitor
    ));
    toast.success("Visitor checked out successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Front Desk Manager</CardTitle>
          <CardDescription>
            Manage visitor check-ins, appointments, and front desk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Visitors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Visitors</h3>
              <div className="space-y-3">
                {visitors.filter(v => !v.checkOut).map((visitor) => (
                  <div key={visitor.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{visitor.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Building className="h-3 w-3" />
                          <span>{visitor.company}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Checked in: {new Date(visitor.checkIn).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm mt-1">Purpose: {visitor.purpose}</p>
                        <p className="text-sm">Host: {visitor.host}</p>
                      </div>
                      <Button size="sm" onClick={() => handleCheckOut(visitor.id)}>
                        Check Out
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {visitors.filter(v => v.checkOut).map((visitor) => (
                  <div key={visitor.id} className="border rounded-lg p-3 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{visitor.name}</span>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {visitor.company} • {visitor.purpose}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(visitor.checkIn).toLocaleTimeString()} - {visitor.checkOut ? new Date(visitor.checkOut).toLocaleTimeString() : 'Still here'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-4">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                New Visitor
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Directory
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
