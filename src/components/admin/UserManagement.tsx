
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/auth';
import { Search, UserPlus, UserMinus, Edit, Save, X } from 'lucide-react';
import { useUserProfiles } from '@/hooks/useAdminData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('admin');
  
  const { profiles, loading, updateProfile } = useUserProfiles();
  const { toast } = useToast();
  const { authState } = useAuth();
  
  // Filter users based on search query
  const filteredUsers = profiles.filter(user => 
    (user.display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (userId: string, role: UserRole) => {
    setEditingUserId(userId);
    setEditRole(role);
  };

  const handleSave = async (userId: string) => {
    try {
      await updateProfile(userId, { role: editRole });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setEditingUserId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  const handleAddUser = () => {
    toast({
      title: "Info",
      description: "User creation form will be implemented",
    });
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await updateProfile(userId, { status: 'inactive' });
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage system users, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleAddUser} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading users...</TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">No users found</TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.display_name || 'No name'}</TableCell>
                      <TableCell>{user.email || 'No email'}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select value={editRole} onValueChange={(value) => setEditRole(value as UserRole)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={editRole} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="project_manager">Project Manager</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                            <SelectItem value="field_worker">Field Worker</SelectItem>
                            <SelectItem value="hr">HR / Front Desk</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</TableCell>
                    <TableCell className="text-right">
                      {editingUserId === user.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleSave(user.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(user.id, user.role as UserRole)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeactivateUser(user.id)}>
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
