
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScopeWipList from "./ScopeWipList";

interface ScopeWipTabProps {
  projectId: string;
}

const ScopeWipTab = ({ projectId }: ScopeWipTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope Work in Progress</CardTitle>
          <CardDescription>
            Track and manage scope-specific work progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScopeWipList projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScopeWipTab;
