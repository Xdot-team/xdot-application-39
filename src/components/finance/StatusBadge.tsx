
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
  className?: string;
}

export function StatusBadge({ status, colorMap, className }: StatusBadgeProps) {
  const color = colorMap[status] || 'bg-gray-100 text-gray-800';
  
  return (
    <Badge 
      className={cn(color, className)}
      variant="outline"
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
