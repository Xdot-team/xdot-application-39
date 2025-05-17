
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Copy, Eye, Plus } from 'lucide-react';
import { getReportsData } from '@/data/mockReportsData';

export function ReportTemplates() {
  const [searchTerm, setSearchTerm] = useState('');
  const { templates } = getReportsData();
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getTemplateTypeColor = (type: string) => {
    const colors = {
      project: "bg-blue-100 text-blue-800",
      financial: "bg-green-100 text-green-800",
      labor: "bg-yellow-100 text-yellow-800",
      safety: "bg-red-100 text-red-800",
      equipment: "bg-purple-100 text-purple-800",
      custom: "bg-indigo-100 text-indigo-800",
    };
    
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Report Templates</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-[250px]"
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Template
          </Button>
        </div>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No templates found matching your search criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <Badge className={getTemplateTypeColor(template.type)}>{template.type}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="font-medium">Metrics:</span> {template.metrics.length}
                </div>
                <div className="text-sm mt-1">
                  <span className="font-medium">Visualizations:</span> {template.defaultVisualizations.length}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {template.metrics.slice(0, 2).map((metric) => (
                    <Badge key={metric.id} variant="secondary" className="text-xs">
                      {metric.name}
                    </Badge>
                  ))}
                  {template.metrics.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.metrics.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </Button>
                <Button variant="secondary" size="sm">
                  <Copy className="h-4 w-4 mr-2" /> Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
