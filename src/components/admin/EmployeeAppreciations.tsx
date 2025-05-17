
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Award, Search, ThumbsUp, Heart, PlusCircle, Calendar, Users, Lightbulb, Shield } from 'lucide-react';
import { mockEmployeeAppreciations } from '@/data/mockAdminData';
import { EmployeeAppreciation } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { MOCK_USERS } from '@/contexts/AuthContext';
import { mockAdditionalUsers } from '@/data/mockAdminData';
import { ProgressCircle } from '../organization/ProgressCircle';

export function EmployeeAppreciations() {
  const [appreciations, setAppreciations] = useState<EmployeeAppreciation[]>(mockEmployeeAppreciations);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAppreciation, setNewAppreciation] = useState<Partial<EmployeeAppreciation>>({
    category: 'exceptional_work',
    public: true,
    likes: 0
  });
  
  const { authState } = useAuth();
  const currentUser = authState.user;
  
  // Combine users from both sources
  const allUsers = [...MOCK_USERS, ...mockAdditionalUsers];

  // Filter appreciations based on search query and category
  const filteredAppreciations = appreciations.filter(appreciation => {
    const matchesCategory = categoryFilter === 'all' || appreciation.category === categoryFilter;
    
    const searchFields = [
      appreciation.recipientName,
      appreciation.senderName,
      appreciation.message
    ].join(' ').toLowerCase();
    
    const matchesSearch = searchQuery === '' || searchFields.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Count appreciations by category for stats
  const appreciationStats = {
    exceptional_work: appreciations.filter(a => a.category === 'exceptional_work').length,
    teamwork: appreciations.filter(a => a.category === 'teamwork').length,
    innovation: appreciations.filter(a => a.category === 'innovation').length,
    safety: appreciations.filter(a => a.category === 'safety').length,
    customer_service: appreciations.filter(a => a.category === 'customer_service').length,
  };
  
  const totalAppreciations = appreciations.length;
  const safetyPercentage = Math.round((appreciationStats.safety / totalAppreciations) * 100) || 0;

  const handleCreateAppreciation = () => {
    if (!newAppreciation.recipientId || !newAppreciation.message) {
      toast.error("Please select a recipient and write a message");
      return;
    }

    const selectedUser = allUsers.find(user => user.id === newAppreciation.recipientId);
    
    if (!selectedUser) {
      toast.error("Selected recipient not found");
      return;
    }

    const createdAppreciation: EmployeeAppreciation = {
      id: `appreciation_${Date.now()}`,
      recipientId: newAppreciation.recipientId,
      recipientName: selectedUser.name,
      senderId: currentUser?.id || '1',
      senderName: currentUser?.name || 'Anonymous',
      message: newAppreciation.message || '',
      createdAt: new Date().toISOString(),
      public: newAppreciation.public || false,
      likes: 0,
      category: newAppreciation.category as 'exceptional_work' | 'teamwork' | 'innovation' | 'safety' | 'customer_service',
    };

    setAppreciations([createdAppreciation, ...appreciations]);
    setNewAppreciation({
      category: 'exceptional_work',
      public: true,
      likes: 0
    });
    setDialogOpen(false);
    toast.success("Appreciation sent successfully");
  };

  const handleLike = (appreciationId: string) => {
    const updatedAppreciations = appreciations.map(appreciation => {
      if (appreciation.id === appreciationId) {
        return { ...appreciation, likes: appreciation.likes + 1 };
      }
      return appreciation;
    });
    
    setAppreciations(updatedAppreciations);
    toast.success("Liked!");
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'exceptional_work':
        return <Badge className="bg-blue-500">Exceptional Work</Badge>;
      case 'teamwork':
        return <Badge className="bg-green-500">Teamwork</Badge>;
      case 'innovation':
        return <Badge className="bg-purple-500">Innovation</Badge>;
      case 'safety':
        return <Badge className="bg-red-500">Safety</Badge>;
      case 'customer_service':
        return <Badge className="bg-yellow-500">Customer Service</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exceptional_work': return 'text-blue-500';
      case 'teamwork': return 'text-green-500';
      case 'innovation': return 'text-purple-500';
      case 'safety': return 'text-red-500';
      case 'customer_service': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exceptional_work': return <Award className={`h-8 w-8 ${getCategoryColor(category)}`} />;
      case 'teamwork': return <Users className={`h-8 w-8 ${getCategoryColor(category)}`} />;
      case 'innovation': return <Lightbulb className={`h-8 w-8 ${getCategoryColor(category)}`} />;
      case 'safety': return <Shield className={`h-8 w-8 ${getCategoryColor(category)}`} />;
      case 'customer_service': return <Heart className={`h-8 w-8 ${getCategoryColor(category)}`} />;
      default: return <Award className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Appreciations</CardTitle>
            <CardDescription>
              Recognitions across the organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalAppreciations}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <ProgressCircle 
                    percentage={safetyPercentage} 
                    size={60} 
                    strokeWidth={6}
                    progressColor="#ef4444"
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-2">Safety Recognition</div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exceptional Work</span>
                <span>{appreciationStats.exceptional_work}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Teamwork</span>
                <span>{appreciationStats.teamwork}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Innovation</span>
                <span>{appreciationStats.innovation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Safety</span>
                <span>{appreciationStats.safety}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Customer Service</span>
                <span>{appreciationStats.customer_service}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Employee Appreciations</CardTitle>
                <CardDescription>
                  Recognize and celebrate achievements
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Send Appreciation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Appreciation</DialogTitle>
                    <DialogDescription>
                      Recognize a team member for their contribution
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipient*</label>
                      <Select 
                        value={newAppreciation.recipientId} 
                        onValueChange={(value) => setNewAppreciation({...newAppreciation, recipientId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {allUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="exceptional_work">Exceptional Work</SelectItem>
                          <SelectItem value="teamwork">Teamwork</SelectItem>
                          <SelectItem value="innovation">Innovation</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="customer_service">Customer Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message*</label>
                      <Textarea
                        placeholder="Write a message of appreciation..."
                        rows={4}
                        value={newAppreciation.message || ''}
                        onChange={(e) => setNewAppreciation({...newAppreciation, message: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="make-public"
                        checked={newAppreciation.public}
                        onCheckedChange={(checked) => setNewAppreciation({...newAppreciation, public: checked})}
                      />
                      <label htmlFor="make-public">Make visible to everyone</label>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateAppreciation}>Send</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appreciations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="exceptional_work">Exceptional Work</SelectItem>
                  <SelectItem value="teamwork">Teamwork</SelectItem>
                  <SelectItem value="innovation">Innovation</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="customer_service">Customer Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredAppreciations.length > 0 ? (
                filteredAppreciations.map((appreciation) => (
                  <div key={appreciation.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{appreciation.recipientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start">
                          <div>
                            <h3 className="font-medium">{appreciation.recipientName}</h3>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>From: {appreciation.senderName}</span>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(appreciation.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {getCategoryBadge(appreciation.category)}
                        </div>
                        <p className="mt-2">{appreciation.message}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center text-muted-foreground"
                            onClick={() => handleLike(appreciation.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {appreciation.likes > 0 && <span>{appreciation.likes}</span>}
                          </Button>
                          {!appreciation.public && (
                            <span className="text-xs text-muted-foreground">Private recognition</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Award className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No appreciations found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
