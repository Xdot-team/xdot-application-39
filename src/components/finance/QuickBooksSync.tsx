
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface QuickBooksSyncProps {
  lastSync?: string;
}

export function QuickBooksSync({ lastSync }: QuickBooksSyncProps) {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);
  const [syncError, setSyncError] = useState(false);
  
  const handleSync = () => {
    setSyncing(true);
    setSyncComplete(false);
    setSyncError(false);
    setProgress(0);
    
    // Simulate sync process
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setSyncing(false);
          setSyncComplete(true);
          toast.success("QuickBooks sync completed successfully!");
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };
  
  const handleSyncError = () => {
    setSyncing(true);
    setSyncComplete(false);
    setSyncError(false);
    setProgress(0);
    
    // Simulate error
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 60) {
          clearInterval(interval);
          setSyncing(false);
          setSyncError(true);
          toast.error("QuickBooks sync encountered an error.");
          return 60;
        }
        return prevProgress + 10;
      });
    }, 500);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CreditCard className="mr-2 h-4 w-4" />
          QuickBooks Sync
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QuickBooks Integration</DialogTitle>
          <DialogDescription>
            Synchronize your financial data with QuickBooks
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last successful sync:</span>
              <span className="text-sm text-muted-foreground">{formatDate(lastSync)}</span>
            </div>
            
            {syncing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Syncing...</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {syncComplete && (
              <div className="rounded-md bg-green-50 p-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-700">Sync completed successfully</span>
              </div>
            )}
            
            {syncError && (
              <div className="rounded-md bg-red-50 p-3 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-700">Sync encountered an error. Please try again.</span>
              </div>
            )}
            
            <div className="rounded-md border p-3">
              <h4 className="text-sm font-medium mb-2">What will be synced:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Client Invoices</li>
                <li>• Vendor Invoices</li>
                <li>• Purchase Orders</li>
                <li>• Chart of Accounts</li>
                <li>• Transactions</li>
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleSyncError}
            disabled={syncing}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Test Error
          </Button>
          <Button 
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? "Syncing..." : "Sync Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
