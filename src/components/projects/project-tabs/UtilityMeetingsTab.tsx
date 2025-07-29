
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UtilityMeetingsTabProps {
  projectId?: string;
}

const UtilityMeetingsTab = ({ projectId }: UtilityMeetingsTabProps = {}) => {
  const navigate = useNavigate();
  
  const handleOpenUtilityModule = () => {
    const url = projectId ? `/utility?project=${projectId}` : '/utility';
    navigate(url);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">Utility Management</h3>
          <p className="text-muted-foreground">
            Utility conflicts and meetings are now managed in the dedicated Utility module for better organization and cross-project visibility.
          </p>
          <Button onClick={handleOpenUtilityModule}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Utility Module
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilityMeetingsTab;
