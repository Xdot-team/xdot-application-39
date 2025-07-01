
import DocumentsManager from './DocumentsManager';

interface DocumentsTabProps {
  projectId: string;
}

const DocumentsTab = ({ projectId }: DocumentsTabProps) => {
  return <DocumentsManager projectId={projectId} />;
};

export default DocumentsTab;
