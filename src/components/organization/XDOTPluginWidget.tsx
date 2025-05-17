
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { XDOTPluginData } from '@/types/organization';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface XDOTPluginWidgetProps {
  data: XDOTPluginData;
}

export function XDOTPluginWidget({ data }: XDOTPluginWidgetProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${data.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
          <span className="text-sm font-medium">{data.status === 'active' ? 'Live Data' : 'Syncing...'}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(data.lastSyncDate).toLocaleString()}
        </div>
      </div>
      
      <div className="space-y-3">
        {data.metrics.map(metric => {
          const hasTarget = metric.target !== undefined;
          const percentComplete = hasTarget ? Math.min(100, Math.round((metric.value / metric.target!) * 100)) : 0;
          const isGood = hasTarget && 
            ((metric.name.toLowerCase().includes('waste') && metric.value < metric.target!) || 
             (!metric.name.toLowerCase().includes('waste') && metric.value >= metric.target!));
          
          return (
            <div key={metric.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{metric.name}</span>
                <span className="flex items-center">
                  {metric.value} {metric.unit}
                  {hasTarget && (
                    isGood ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 ml-1" />
                    )
                  )}
                </span>
              </div>
              
              {hasTarget && (
                <>
                  <Progress value={percentComplete} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {metric.target} {metric.unit}</span>
                    <span>{percentComplete}%</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
