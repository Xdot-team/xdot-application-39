
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
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
  Save,
  RotateCcw
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

// Default navigation items order
const defaultNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    allowedRoles: ['admin', 'project_manager', 'accountant', 'field_worker', 'hr'],
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FileText,
    allowedRoles: ['admin', 'project_manager', 'accountant', 'field_worker'],
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FolderOpen,
    allowedRoles: ['admin', 'project_manager', 'accountant', 'field_worker'],
  },
  {
    title: 'Estimating',
    href: '/estimating',
    icon: BarChart,
    allowedRoles: ['admin', 'project_manager', 'accountant'],
  },
  {
    title: 'Field',
    href: '/field',
    icon: MapPin,
    allowedRoles: ['admin', 'project_manager', 'field_worker'],
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
    allowedRoles: ['admin', 'project_manager', 'accountant'],
  },
  {
    title: 'Assets',
    href: '/assets',
    icon: Truck,
    allowedRoles: ['admin', 'project_manager', 'field_worker'],
  },
  {
    title: 'Workforce',
    href: '/workforce',
    icon: UserRound,
    allowedRoles: ['admin', 'hr', 'project_manager'],
  },
  {
    title: 'Safety & Risk',
    href: '/safety',
    icon: ShieldAlert,
    allowedRoles: ['admin', 'project_manager', 'field_worker', 'hr'],
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: Calendar,
    allowedRoles: ['admin', 'project_manager', 'field_worker'],
  },
  {
    title: 'Survey',
    href: '/survey',
    icon: Satellite,
    allowedRoles: ['admin', 'project_manager', 'field_worker'],
  },
  {
    title: 'Organization',
    href: '/organization',
    icon: LineChart,
    allowedRoles: ['admin', 'project_manager'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart2,
    allowedRoles: ['admin', 'project_manager', 'accountant'],
  },
  {
    title: 'Administration',
    href: '/admin',
    icon: Settings,
    allowedRoles: ['admin', 'hr'],
  },
];

const LOCAL_STORAGE_KEY = 'sidebar_nav_order';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { authState } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [navItems, setNavItems] = useState<NavItem[]>([...defaultNavItems]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Load saved order from local storage on component mount
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedOrder && authState.user) {
        const parsedOrder = JSON.parse(savedOrder);
        // Ensure we have the same user
        if (parsedOrder.userId === authState.user.id) {
          // Apply saved order
          const orderedIndexes = parsedOrder.order;
          
          // Only apply if the saved order length matches the default items
          if (orderedIndexes.length === defaultNavItems.length) {
            const newOrder = orderedIndexes.map((index: number) => defaultNavItems[index]);
            setNavItems(newOrder);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error loading sidebar order:", error);
    }
    
    // Default to original order if no saved order or error
    setNavItems([...defaultNavItems]);
  }, [authState.user]);
  
  // If no user, don't render sidebar
  if (!authState.user) return null;
  
  const { role } = authState.user;
  
  // Filter menu items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.allowedRoles.includes(role)
  );
  
  // Handle drag end event
  const onDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedItems = [...navItems];
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setNavItems(reorderedItems);
  };
  
  // Save current order to local storage
  const saveOrder = () => {
    try {
      // Save the index mapping to original array
      const orderMapping = navItems.map(item => 
        defaultNavItems.findIndex(defaultItem => defaultItem.href === item.href)
      );
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        userId: authState.user?.id,
        order: orderMapping
      }));
      
      toast({
        title: "Layout saved",
        description: "Your sidebar arrangement has been saved"
      });
      
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving sidebar order:", error);
      toast({
        title: "Error",
        description: "Failed to save your sidebar arrangement",
        variant: "destructive"
      });
    }
  };
  
  // Reset to default order
  const resetOrder = () => {
    setNavItems([...defaultNavItems]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({
      title: "Reset complete",
      description: "Sidebar has been reset to default order"
    });
    setIsEditMode(false);
  };

  // Handle navigation
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
              <ShieldAlert size={24} className="text-construction-primary" />
              <span className="text-xl font-bold text-white">xDOTContractor</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="flex justify-between items-center px-3 mb-2">
              <h2 className="text-sidebar-foreground/70 text-sm font-medium">Navigation</h2>
              {isEditMode ? (
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={saveOrder}
                    className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={resetOrder}
                    className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="text-xs h-7 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                >
                  Reorder
                </Button>
              )}
            </div>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sidebarItems" isDropDisabled={!isEditMode}>
                {(provided) => (
                  <ul 
                    className="space-y-1 px-3" 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {filteredNavItems.map((item, index) => (
                      <Draggable 
                        key={item.href} 
                        draggableId={item.href} 
                        index={index}
                        isDragDisabled={!isEditMode}
                      >
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              snapshot.isDragging ? "opacity-70" : ""
                            )}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => handleNavigation(item.href)}
                              className={cn(
                                "flex w-full items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                location.pathname === item.href
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                                isEditMode && "cursor-move"
                              )}
                            >
                              <item.icon className="mr-2 h-5 w-5" />
                              {item.title}
                            </Button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent overflow-hidden">
                {authState.user?.profilePicture ? (
                  <img 
                    src={authState.user.profilePicture} 
                    alt={authState.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-sidebar-accent text-sidebar-accent-foreground">
                    {authState.user?.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {authState.user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate capitalize">
                  {authState.user?.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
