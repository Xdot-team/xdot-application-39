
import DocumentsManager from '@/components/documents/DocumentsManager';

interface DocumentsTabProps {
  projectId: string;
}

const DocumentsTab = ({ projectId }: DocumentsTabProps) => {
  return <DocumentsManager projectId={projectId} />;
};

export default DocumentsTab;
