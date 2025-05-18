
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const CostCompletionTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="font-medium">{formatCurrency(12500000)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Forecast</p>
              <p className="font-medium">{formatCurrency(12200000)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spent to Date</p>
              <p className="font-medium">{formatCurrency(8375000)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Variance</p>
              <p className="font-medium text-green-600">+2.4%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostCompletionTab;
