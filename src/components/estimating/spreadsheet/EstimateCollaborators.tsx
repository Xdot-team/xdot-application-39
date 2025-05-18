
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Users } from 'lucide-react';

interface CollaboratorProps {
  id: string;
  name: string;
  role: string;
}

interface EstimateCollaboratorsProps {
  collaborators: CollaboratorProps[];
  onAddCollaborator?: (email: string, role: string) => void;
}

export default function EstimateCollaborators({
  collaborators,
  onAddCollaborator
}: EstimateCollaboratorsProps) {
  const [open, setOpen] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-blue-100 text-blue-800';
      case 'editor':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddCollaborator = () => {
    toast.info("Invite collaborator feature coming soon");
  };

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
      >
        <Users className="h-3.5 w-3.5" />
        <span>Collaborators</span>
        <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 rounded-full">
          {collaborators.length}
        </Badge>
      </Button>
      
      <div className="flex -space-x-2 ml-2">
        {collaborators.map((collaborator, i) => (
          <Popover key={collaborator.id}>
            <PopoverTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-background cursor-pointer hover:scale-105 transition-transform">
                <AvatarFallback className="text-xs">
                  {collaborator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3" align="start">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {collaborator.id === 'user-1' ? 'email@example.com' : 'user2@example.com'}
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Badge className={getRoleColor(collaborator.role)}>{collaborator.role}</Badge>
                  {collaborator.role === 'owner' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Can edit and manage all aspects of the estimate.
                    </div>
                  )}
                  {collaborator.role === 'editor' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Can edit the estimate but cannot delete or share it.
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {collaborator.id === 'user-1' ? 'Currently viewing' : 'Last active 2 minutes ago'}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 rounded-full" 
          onClick={handleAddCollaborator}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
