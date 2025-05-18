
import { ReactNode } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ProjectStatusCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  iconColorClass?: string;
}

const ProjectStatusCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColorClass = 'text-muted-foreground'
}: ProjectStatusCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={iconColorClass}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
