
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FieldMap() {
  return (
    <div className="relative w-full h-full bg-slate-100">
      {/* Map placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Interactive map will be available once Supabase integration is complete.</p>
          <p className="text-xs text-muted-foreground mt-2">Will show real-time location of workers, equipment, and project sites</p>
        </div>
      </div>
    </div>
  );
}
