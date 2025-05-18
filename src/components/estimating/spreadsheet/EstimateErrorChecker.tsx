
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EstimateItem } from '@/types/estimates';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface EstimateErrorCheckerProps {
  errors: {id: string, message: string}[];
  items: EstimateItem[];
  onFixError?: (itemId: string, field: string) => void;
}

export default function EstimateErrorChecker({
  errors,
  items,
  onFixError
}: EstimateErrorCheckerProps) {
  if (errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            No Issues Found
          </CardTitle>
          <CardDescription>
            Your estimate looks good! All items have been checked for errors and none were found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between px-4 py-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">All quantities are properly defined</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Passed</Badge>
            </div>
            
            <div className="flex items-center justify-between px-4 py-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">All unit prices are properly defined</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Passed</Badge>
            </div>
            
            <div className="flex items-center justify-between px-4 py-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">All descriptions are properly defined</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Passed</Badge>
            </div>
            
            <div className="flex items-center justify-between px-4 py-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">All formulas are valid</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Passed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group errors by type
  const errorGroups = {
    quantity: errors.filter(e => e.message.includes('quantity')),
    unitPrice: errors.filter(e => e.message.includes('unit price')),
    description: errors.filter(e => e.message.includes('Description')),
    formula: errors.filter(e => e.message.includes('Formula')),
    other: errors.filter(e => 
      !e.message.includes('quantity') && 
      !e.message.includes('unit price') && 
      !e.message.includes('Description') &&
      !e.message.includes('Formula')
    )
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-yellow-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {errors.length} Issue{errors.length > 1 ? 's' : ''} Found
        </CardTitle>
        <CardDescription>
          Please fix the following issues before submitting your estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {Object.entries(errorGroups).map(([groupType, groupErrors]) => {
              if (groupErrors.length === 0) return null;
              
              return (
                <div key={groupType} className="space-y-2">
                  <h3 className="font-medium capitalize">{groupType} Issues</h3>
                  <div className="space-y-2">
                    {groupErrors.map((error, index) => {
                      const item = items.find(i => i.id === error.id);
                      
                      if (!item) return null;
                      
                      return (
                        <div 
                          key={`${error.id}-${index}`}
                          className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{item.description}</div>
                            <div className="text-sm text-yellow-700">{error.message}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => onFixError && onFixError(error.id, groupType)}
                          >
                            Fix Issue
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Pre-Submission Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="check-1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="check-1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All quantities and unit prices have been verified
                  </label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="check-2" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="check-2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vendor quotes have been compared to self-perform costs
                  </label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="check-3" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="check-3"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Material pricing is current and accurate
                  </label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="check-4" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="check-4"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Overhead and profit calculations are correct
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
