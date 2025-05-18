
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectNoteList from "./ProjectNoteList";

interface ProjectNotesTabProps {
  projectId: string;
}

const ProjectNotesTab = ({ projectId }: ProjectNotesTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Notes</CardTitle>
          <CardDescription>
            View, search, and manage notes for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectNoteList projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectNotesTab;
