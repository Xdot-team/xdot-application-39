
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Award, Users, Lightbulb, Shield, Star } from 'lucide-react';
import { mockEmployeeAppreciations } from '@/data/mockAdminData';
import { EmployeeAppreciation } from '@/data/mockAdminData';
import { toast } from '@/components/ui/sonner';

export function EmployeeAppreciations() {
  const [appreciations, setAppreciations] = useState<EmployeeAppreciation[]>(mockEmployeeAppreciations);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAppreciation, setNewAppreciation] = useState<Partial<EmployeeAppreciation>>({
    title: '',
    message: '',
    category: 'achievement',
    isPublic: true
  });

  // Mock current user for demonstration
  const currentUser = { id: '1', name: 'Demo User' };

  const handleCreateAppreciation = () => {
    if (!newAppreciation.title || !newAppreciation.message || !newAppreciation.recipientName) {
      toast.error("Please fill in all required fields");
      return;
    }

    const appreciation: EmployeeAppreciation = {
      id: `appreciation_${Date.now()}`,
      recipientId: 'recipient_id',
      recipientName: newAppreciation.recipientName!,
      senderId: currentUser?.id || '1',
      senderName: currentUser?.name || 'Anonymous',
      title: newAppreciation.title,
      message: newAppreciation.message,
      category: newAppreciation.category as any,
      createdAt: new Date().toISOString(),
      isPublic: newAppreciation.isPublic || false
    };

    setAppreciations([appreciation, ...appreciations]);
    setNewAppreciation({
      title: '',
      message: '',
      category: 'achievement',
      isPublic: true
    });
    setDialogOpen(false);
    toast.success("Appreciation sent successfully!");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'teamwork': return <Users className="h-5 w-5 text-blue-500" />;
      case 'innovation': return <Lightbulb className="h-5 w-5 text-purple-500" />;
      case 'safety': return <Shield className="h-5 w-5 text-green-500" />;
      case 'leadership': return <Star className="h-5 w-5 text-orange-500" />;
      default: return <Heart className="h-5 w-5 text-red-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      case 'teamwork': return 'bg-blue-100 text-blue-800';
      case 'innovation': return 'bg-purple-100 text-purple-800';
      case 'safety': return 'bg-green-100 text-green-800';
      case 'leadership': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Employee Appreciations</CardTitle>
              <CardDescription>
                Recognize and celebrate team member achievements and contributions
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Heart className="mr-2 h-4 w-4" />
                  Send Appreciation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Employee Appreciation</DialogTitle>
                  <DialogDescription>
                    Recognize a team member's outstanding contribution
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Employee Name*</label>
                    <Input
                      placeholder="Enter employee name"
                      value={newAppreciation.recipientName || ''}
                      onChange={(e) => setNewAppreciation({...newAppreciation, recipientName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title*</label>
                    <Input
                      placeholder="Brief title for the appreciation"
                      value={newAppreciation.title}
                      onChange={(e) => setNewAppreciation({...newAppreciation, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message*</label>
                    <Textarea
                      placeholder="Write your appreciation message..."
                      rows={4}
                      value={newAppreciation.message}
                      onChange={(e) => setNewAppreciation({...newAppreciation, message: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select 
                      value={newAppreciation.category} 
                      onValueChange={(value) => setNewAppreciation({...newAppreciation, category: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="teamwork">Teamwork</SelectItem>
                        <SelectItem value="innovation">Innovation</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateAppreciation}>Send Appreciation</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {appreciations.length > 0 ? (
              appreciations.map((appreciation) => (
                <div key={appreciation.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {getCategoryIcon(appreciation.category)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{appreciation.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>For: <strong>{appreciation.recipientName}</strong></span>
                            <span>•</span>
                            <span>From: {appreciation.senderName}</span>
                            <span>•</span>
                            <span>{new Date(appreciation.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(appreciation.category)}>
                          {appreciation.category}
                        </Badge>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm">{appreciation.message}</p>
                      </div>
                      
                      {appreciation.isPublic && (
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">Public Recognition</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Heart className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">No appreciations yet</h3>
                <p className="text-muted-foreground">Start recognizing your team members' great work!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
