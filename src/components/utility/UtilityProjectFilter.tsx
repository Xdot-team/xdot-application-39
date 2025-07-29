import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/projects';
import { X } from 'lucide-react';

interface UtilityProjectFilterProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectChange: (projectId: string | null) => void;
}

const UtilityProjectFilter = ({ 
  projects, 
  selectedProjectId, 
  onProjectChange 
}: UtilityProjectFilterProps) => {
  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Filter by Project
            </label>
            <Select
              value={selectedProjectId || 'all'}
              onValueChange={(value) => onProjectChange(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a project or view all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 px-3 py-2 rounded-md">
                <span className="text-sm font-medium">
                  Viewing: {selectedProject.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProjectChange(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {selectedProject && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2 capitalize">{selectedProject.status}</span>
              </div>
              <div>
                <span className="font-medium">Start Date:</span>
                <span className="ml-2">
                  {selectedProject.startDate ? 
                    new Date(selectedProject.startDate).toLocaleDateString() : 
                    'Not set'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium">End Date:</span>
                <span className="ml-2">
                  {selectedProject.endDate ? 
                    new Date(selectedProject.endDate).toLocaleDateString() : 
                    'Not set'
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilityProjectFilter;