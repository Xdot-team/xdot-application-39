
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users } from "lucide-react";
import { Project } from '@/types/projects';

interface ProjectsGridProps {
  activeProjects: Project[];
  completedProjects: Project[];
  upcomingProjects: Project[];
}

const ProjectsGrid = ({ activeProjects, completedProjects, upcomingProjects }: ProjectsGridProps) => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="active">Active Projects</TabsTrigger>
        <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="space-y-4 mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeProjects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-green-500 hover:bg-green-600">Active</Badge>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription>{project.clientName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-muted">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Details
                </Button>
                <Button variant="outline" size="sm">Schedule</Button>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Dashboard
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedProjects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-500 hover:bg-blue-600">Completed</Badge>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription>{project.clientName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-muted">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Completed {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Details
                </Button>
                <Button variant="outline" size="sm">Archive</Button>
                <Button size="sm">Report</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="upcoming" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingProjects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-amber-500 hover:bg-amber-600">Upcoming</Badge>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription>{project.clientName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-medium">${(project.contractValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Details
                </Button>
                <Button size="sm">Setup</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectsGrid;
