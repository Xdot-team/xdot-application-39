
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label?: string;
  status?: string;
  colorMap?: Record<string, string>;
  color?: string;
  className?: string;
}

export function StatusBadge({ status, label, colorMap, color, className }: StatusBadgeProps) {
  // Use the provided color directly if available, otherwise try to get it from colorMap
  const badgeColor = color || (colorMap && status ? colorMap[status] : 'bg-gray-100 text-gray-800');
  
  // Use label if provided, otherwise format the status
  const displayText = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '');
  
  return (
    <Badge 
      className={cn(badgeColor, className)}
      variant="outline"
    >
      {displayText}
    </Badge>
  );
}
