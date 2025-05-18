
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";

const ChangeOrdersTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">CO #5 - Sound Barrier</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(125000)}</p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">Pending</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">CO #4 - Foundation Adj.</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(87500)}</p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeOrdersTab;
