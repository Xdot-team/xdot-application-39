
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LucideIcon,
  Home, 
  BarChart2, 
  FileText, 
  Calendar, 
  Truck, 
  Settings, 
  Menu, 
  X,
  FolderOpen,
  BarChart,
  MapPin,
  DollarSign,
  UserRound,
  LineChart,
  Satellite,
  ShieldAlert,
  Mail
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FileText,
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FolderOpen,
  },
  {
    title: 'Estimating',
    href: '/estimating',
    icon: BarChart,
  },
  {
    title: 'Field',
    href: '/field',
    icon: MapPin,
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
  },
  {
    title: 'Assets',
    href: '/assets',
    icon: Truck,
  },
  {
    title: 'Workforce',
    href: '/workforce',
    icon: UserRound,
  },
  {
    title: 'Safety & Risk',
    href: '/safety',
    icon: ShieldAlert,
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: Calendar,
  },
  {
    title: 'Survey',
    href: '/survey',
    icon: Satellite,
  },
  {
    title: 'Organization',
    href: '/organization',
    icon: LineChart,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart2,
  },
  {
    title: 'Outlook Plugin',
    href: '/outlook-plugin',
    icon: Mail,
  },
  {
    title: 'Administration',
    href: '/admin',
    icon: Settings,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:h-screen"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <ShieldAlert size={24} className="text-sidebar-primary" />
              <span className="text-xl font-bold text-sidebar-foreground">xDOTContractor</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="px-3 mb-2">
              <h2 className="text-sidebar-foreground/70 text-sm font-medium">Navigation</h2>
            </div>
            
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex w-full items-center justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.title}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
