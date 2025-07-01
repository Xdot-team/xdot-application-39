
import { useState } from 'react';
import { useProjectTeamMembers, useAddTeamMember, useRemoveTeamMember } from '@/hooks/useProjectTeam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Mail, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProjectTeamTabProps {
  projectId: string;
}

const ProjectTeamTab = ({ projectId }: ProjectTeamTabProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('team_member');

  const { data: teamMembers = [], isLoading, error } = useProjectTeamMembers(projectId);
  const addTeamMember = useAddTeamMember();
  const removeTeamMember = useRemoveTeamMember();

  const handleAddMember = async () => {
    if (!userName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await addTeamMember.mutateAsync({
        project_id: projectId,
        user_name: userName.trim(),
        user_email: userEmail.trim() || undefined,
        role: userRole,
        permissions: getRolePermissions(userRole)
      });
      
      // Reset form
      setUserName('');
      setUserEmail('');
      setUserRole('team_member');
      setIsAddOpen(false);
      
      toast.success('Team member added successfully');
    } catch (error) {
      console.error('Add team member error:', error);
      toast.error('Failed to add team member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await removeTeamMember.mutateAsync(memberId);
      } catch (error) {
        console.error('Remove team member error:', error);
        toast.error('Failed to remove team member');
      }
    }
  };

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case 'project_manager':
        return ['read', 'write', 'delete', 'manage_team'];
      case 'supervisor':
        return ['read', 'write', 'manage_tasks'];
      case 'team_member':
        return ['read', 'write'];
      case 'viewer':
        return ['read'];
      default:
        return ['read'];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'bg-purple-500';
      case 'supervisor':
        return 'bg-blue-500';
      case 'team_member':
        return 'bg-green-500';
      case 'viewer':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">Loading team members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Error loading team members: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Team</h3>
          <p className="text-sm text-muted-foreground">
            Manage team members and their roles for this project
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Name *</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter team member name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="userRole">Role</Label>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project_manager">Project Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="team_member">Team Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAddMember} 
                  disabled={addTeamMember.isPending}
                  className="flex-1"
                >
                  {addTeamMember.isPending ? 'Adding...' : 'Add Member'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members List */}
      {teamMembers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{member.user_name}</CardTitle>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {member.user_email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {member.user_email}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Added: {new Date(member.added_at).toLocaleDateString()}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={removeTeamMember.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No team members found</h3>
          <p className="text-muted-foreground mb-4">
            Add team members to collaborate on this project
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamTab;
