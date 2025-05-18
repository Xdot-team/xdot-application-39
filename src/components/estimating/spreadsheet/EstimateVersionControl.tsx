
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { toast } from "sonner";
import { EstimateVersionInfo } from '@/types/estimates';
import { Check, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EstimateVersionControlProps {
  versions: EstimateVersionInfo[];
  onVersionChange?: (versionId: string) => void;
}

export default function EstimateVersionControl({ versions, onVersionChange }: EstimateVersionControlProps) {
  const [open, setOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>(
    versions.length > 0 ? versions[versions.length - 1].id : ''
  );

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
    setOpen(false);
    if (onVersionChange) {
      onVersionChange(versionId);
    }
    toast.info(`Switched to version ${versions.find(v => v.id === versionId)?.versionNumber}`);
  };

  const getCurrentVersion = () => {
    return versions.find(v => v.id === selectedVersion);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Version:</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center justify-between w-[180px]"
            size="sm"
          >
            {getCurrentVersion()?.versionNumber || 'Select version...'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search versions..." />
            <CommandEmpty>No versions found.</CommandEmpty>
            <CommandGroup>
              {versions.map((version) => (
                <CommandItem
                  key={version.id}
                  value={version.versionNumber}
                  onSelect={() => handleVersionSelect(version.id)}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="mr-2">{version.versionNumber}</span>
                      {version.isBaseline && (
                        <span className="bg-blue-100 text-blue-800 text-xs rounded px-1">
                          Baseline
                        </span>
                      )}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedVersion === version.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between mt-1">
                      <span>{version.createdBy}</span>
                      <span>
                        {format(new Date(version.createdAt), 'MMM d, h:mma')}
                      </span>
                    </div>
                    {version.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {version.notes}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
