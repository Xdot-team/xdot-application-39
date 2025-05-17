
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const ProjectHeader = () => {
  const { authState } = useAuth();
  const canCreateProject = ['admin', 'project_manager'].includes(authState.user?.role || '');
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your roadway construction projects
        </p>
      </div>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full sm:w-[200px] md:w-[300px] pl-8"
          />
        </div>
        
        {canCreateProject && (
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
