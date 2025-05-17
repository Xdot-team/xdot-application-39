
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { ProjectList } from '@/components/projects/ProjectList';
import ProjectHeader from '@/components/projects/ProjectHeader';

const Projects = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  return (
    <div className="space-y-6">
      <ProjectHeader />

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4 mt-6">
          <ProjectList status="active" />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-6">
          <ProjectList status="completed" />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <ProjectList status="upcoming" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default requireAuth(['admin', 'project_manager', 'accountant'])(Projects);
