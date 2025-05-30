
import React, { useState, useEffect } from 'react';
import { useOutlookPlugin } from './OutlookPluginProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Mail, FileText, Paperclip, Send } from 'lucide-react';

interface EmailAssistantProps {
  searchQuery: string;
}

export function EmailAssistant({ searchQuery }: EmailAssistantProps) {
  const { emailTemplates, searchProjects, generateEmailContent } = useOutlookPlugin();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [projects, setProjects] = useState<{id: string; name: string}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await searchProjects('');
        setProjects(projectsData);
        if (projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [searchProjects]);

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    if (templateId && selectedProjectId) {
      setIsLoading(true);
      try {
        const template = emailTemplates.find(t => t.id === templateId);
        if (template) {
          setSubject(template.subject);
          
          // Replace project name placeholder in subject
          if (selectedProjectId) {
            const project = projects.find(p => p.id === selectedProjectId);
            if (project) {
              setSubject(prev => prev.replace('{projectName}', project.name));
            }
          }
          
          const content = await generateEmailContent(templateId, selectedProjectId, recipient);
          setEmailBody(content);
        }
      } catch (error) {
        console.error('Error generating email content:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId);
    
    if (selectedTemplateId && projectId) {
      setIsLoading(true);
      try {
        const project = projects.find(p => p.id === projectId);
        if (project && subject.includes('{projectName}')) {
          setSubject(prev => prev.replace('{projectName}', project.name));
        }
        
        const content = await generateEmailContent(selectedTemplateId, projectId, recipient);
        setEmailBody(content);
      } catch (error) {
        console.error('Error updating email content:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRecipientChange = async (value: string) => {
    setRecipient(value);
    
    if (selectedTemplateId && selectedProjectId && value) {
      // Update email content with new recipient
      try {
        const content = await generateEmailContent(selectedTemplateId, selectedProjectId, value);
        setEmailBody(content);
      } catch (error) {
        console.error('Error updating recipient in email:', error);
      }
    }
  };

  const handleInsertTemplate = () => {
    // In a real implementation, this would insert the template into Outlook
    alert('Template would be inserted into Outlook compose window');
  };

  return (
    <div className="p-3">
      <h3 className="font-medium text-sm mb-3">Email Assistant</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1">Email Template</label>
          <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {emailTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1">Project Context</label>
          <Select value={selectedProjectId} onValueChange={handleProjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
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
          <label className="block text-xs font-medium mb-1">Recipient</label>
          <Input 
            placeholder="Enter recipient name" 
            value={recipient} 
            onChange={(e) => handleRecipientChange(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-sm text-muted-foreground">Generating email template...</p>
          </div>
        ) : (
          <>
            {selectedTemplateId && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Email Body</label>
                  <Textarea 
                    rows={8} 
                    value={emailBody} 
                    onChange={(e) => setEmailBody(e.target.value)} 
                    className="resize-none"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4 space-x-3">
        <Button variant="outline" size="sm" className="w-full">
          <Paperclip className="h-4 w-4 mr-2" />
          Attach
        </Button>
        
        <Button onClick={handleInsertTemplate} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </div>
      
      <div className="mt-4 pt-3 border-t text-center">
        <div className="flex items-center justify-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Templates are context-aware and include project data
          </span>
        </div>
      </div>
    </div>
  );
}
