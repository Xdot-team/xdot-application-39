
import { ReactNode } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ProjectStatusCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  iconColorClass?: string;
  compact?: boolean;
}

const ProjectStatusCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColorClass = 'text-muted-foreground',
  compact = false
}: ProjectStatusCardProps) => {
  return (
    <Card>
      <CardHeader className={`flex flex-row items-center justify-between ${compact ? 'py-2 px-3' : 'pb-2'}`}>
        <CardTitle className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>{title}</CardTitle>
        <div className={iconColorClass}>{icon}</div>
      </CardHeader>
      <CardContent className={compact ? 'py-2 px-3' : ''}>
        <div className={`${compact ? 'text-lg' : 'text-2xl'} font-bold`}>{value}</div>
        <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
