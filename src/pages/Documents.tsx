
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { LibraryView } from '@/components/documents/LibraryView';

function Documents() {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <PageHeader 
          heading="Documents"
          subheading="Organize and manage project documentation"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 lg:w-[400px] mb-4">
          <TabsTrigger value="library">Document Library</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <LibraryView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Documents;
