
import { 
  BarChart2, 
  FileText, 
  MessageCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Bell,
  CalendarDays
} from "lucide-react";
import { formatCurrency } from '@/lib/formatters';
import ProjectStatusCard from './ProjectStatusCard';

interface ProjectStatusOverviewProps {
  activeProjects: number;
  completedProjects: number;
}

const ProjectStatusOverview = ({ 
  activeProjects, 
  completedProjects 
}: ProjectStatusOverviewProps) => {
  return (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
      <ProjectStatusCard
        title="Active Projects"
        value={activeProjects}
        subtitle="+2 from last month"
        icon={<BarChart2 className="h-4 w-4" />}
        compact
      />
      
      <ProjectStatusCard
        title="Completed Projects"
        value={completedProjects}
        subtitle="Since January 2023"
        icon={<FileText className="h-4 w-4" />}
        compact
      />
      
      <ProjectStatusCard
        title="Open RFIs"
        value={18}
        subtitle="5 require attention"
        icon={<MessageCircle className="h-4 w-4" />}
        compact
      />
      
      <ProjectStatusCard
        title="Pending Submittals"
        value={24}
        subtitle="7 awaiting approval"
        icon={<Clock className="h-4 w-4" />}
        compact
      />
      
      <ProjectStatusCard
        title="Notifications"
        value={12}
        subtitle="4 require attention"
        icon={<Bell className="h-4 w-4" />}
        iconColorClass="text-amber-600"
        compact
      />
      
      <ProjectStatusCard
        title="Utility Meetings"
        value={5}
        subtitle="2 scheduled this week"
        icon={<CalendarDays className="h-4 w-4" />}
        compact
      />
      
      <ProjectStatusCard
        title="Cost Performance"
        value="+2.3%"
        subtitle="Projects under budget"
        icon={<DollarSign className="h-4 w-4" />}
        iconColorClass="text-green-600"
        compact
      />
      
      <ProjectStatusCard
        title="Forecasted Value"
        value={formatCurrency(76500000)}
        subtitle="Total project value"
        icon={<TrendingUp className="h-4 w-4" />}
        compact
      />
    </div>
  );
};

export default ProjectStatusOverview;
