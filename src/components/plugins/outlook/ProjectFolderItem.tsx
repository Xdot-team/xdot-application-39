
import React from 'react';
import { FolderOpen, ChevronRight } from 'lucide-react';
import { ProjectFolder } from '@/types/outlook';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectFolderItemProps {
  folder: ProjectFolder;
  expanded: boolean;
  onToggle: () => void;
}

export function ProjectFolderItem({ folder, expanded, onToggle }: ProjectFolderItemProps) {
  const getFolderTypeStyle = () => {
    switch (folder.type) {
      case 'rfi':
        return 'text-blue-600';
      case 'submittal':
        return 'text-green-600';
      case 'change_order':
        return 'text-amber-600';
      case 'document':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mb-1">
      <Button
        variant="ghost"
        className="w-full justify-start text-sm"
        onClick={onToggle}
      >
        <ChevronRight 
          className={`h-4 w-4 mr-1 transition-transform ${expanded ? 'transform rotate-90' : ''}`} 
        />
        <FolderOpen className={`h-4 w-4 mr-2 ${getFolderTypeStyle()}`} />
        <span className="flex-1 text-left">{folder.name}</span>
        <Badge variant="outline" className="ml-2 text-[10px]">{folder.itemCount}</Badge>
      </Button>
    </div>
  );
}
