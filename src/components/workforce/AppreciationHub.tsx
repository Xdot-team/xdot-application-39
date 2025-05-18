
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Check, Heart, Medal, Star, ThumbsUp, Trophy } from 'lucide-react';

export function AppreciationHub() {
  return (
    <div className="container p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employee Appreciation</h2>
          <p className="text-muted-foreground">Recognize and celebrate team achievements</p>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="recognition">Recognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AchievementCard 
              icon={Trophy} 
              title="Performance Champion" 
              description="Exceeded project completion targets by 15% for Q3"
              recipient="Michael Chen"
              date="2023-10-15"
            />
            <AchievementCard 
              icon={Star} 
              title="Safety Star" 
              description="1000 days without a recordable incident on Highway 20 project"
              recipient="Crew 5 - Robert Johnson"
              date="2023-10-01"
            />
            <AchievementCard 
              icon={Medal} 
              title="Quality Excellence" 
              description="Perfect inspection score on Georgia DOT bridge project"
              recipient="Engineering Team"
              date="2023-09-22"
            />
            <AchievementCard 
              icon={Heart} 
              title="Team Player" 
              description="Volunteered to cover multiple shifts during crew shortage"
              recipient="Sarah Martinez"
              date="2023-09-10"
            />
            <AchievementCard 
              icon={ThumbsUp} 
              title="Client Satisfaction" 
              description="Received commendation letter from Atlanta Public Works"
              recipient="Project Team B"
              date="2023-08-30"
            />
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          {/* Badges content */}
        </TabsContent>

        <TabsContent value="recognition" className="space-y-4">
          {/* Recognition content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AchievementCardProps {
  icon: React.FC<any>;
  title: string;
  description: string;
  recipient: string;
  date: string;
}

function AchievementCard({ icon: Icon, title, description, recipient, date }: AchievementCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">{recipient}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
        <div className="flex items-center">
          <Check className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-xs">Verified</span>
        </div>
      </CardFooter>
    </Card>
  );
}
