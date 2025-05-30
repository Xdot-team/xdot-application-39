
import React, { useState } from 'react';
import { useOutlookPlugin } from './OutlookPluginProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Mail, Copy, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EmailAssistantProps {
  searchQuery: string;
}

export function EmailAssistant({ searchQuery }: EmailAssistantProps) {
  const { emailTemplates, generateEmailContent, searchProjects } = useOutlookPlugin();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    const loadProjects = async () => {
      const projectsList = await searchProjects('');
      setProjects(projectsList);
    };
    loadProjects();
  }, [searchProjects]);

  const filteredTemplates = searchQuery 
    ? emailTemplates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emailTemplates;

  const handleGenerateEmail = async () => {
    if (!selectedTemplate || !selectedProject) return;
    
    setIsGenerating(true);
    try {
      const content = await generateEmailContent(selectedTemplate, selectedProject, recipient);
      setEmailContent(content);
    } catch (error) {
      console.error('Error generating email content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    // Would add toast notification here in a real app
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-3">Email Assistant</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Select Template</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {filteredTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Select Project</label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Recipient Name (Optional)</label>
            <Input 
              placeholder="Enter recipient name" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleGenerateEmail} 
            disabled={!selectedTemplate || !selectedProject || isGenerating}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Generate Email
          </Button>
        </div>
      </div>

      {emailContent && (
        <Card className="p-3 mt-4">
          <h4 className="text-sm font-medium mb-2">Generated Email</h4>
          <Textarea 
            value={emailContent} 
            rows={8}
            className="resize-none mb-3"
            readOnly
          />
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>
            <Button size="sm">
              <Send className="mr-1 h-4 w-4" /> Create in Outlook
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
