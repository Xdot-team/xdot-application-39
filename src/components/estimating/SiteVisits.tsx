
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from 'lucide-react';
import { toast } from "sonner";
import { SiteVisit } from '@/types/field';
import { cn } from '@/lib/utils';

// Mock data - can be moved to a separate file later
const mockSiteVisits: SiteVisit[] = [
  {
    id: "SV-1001",
    date: "2025-05-15",
    project: "GA-400 Repaving",
    inspector: "John Smith",
    notes: "Initial site survey completed. Area marked for utility locates.",
    status: 'completed'
  },
  {
    id: "SV-1002",
    date: "2025-05-14",
    project: "I-85 Bridge Repair",
    inspector: "Maria Rodriguez",
    notes: "Structural assessment completed. Identified 3 critical repair areas.",
    status: 'needs-review'
  },
  {
    id: "SV-1003",
    date: "2025-05-13",
    project: "Peachtree Street Improvements",
    inspector: "David Williams",
    notes: "Sidewalk condition assessment. Multiple ADA compliance issues identified.",
    status: 'completed'
  },
  {
    id: "SV-1004",
    date: "2025-05-16",
    project: "Gwinnett County Sidewalk Project",
    inspector: "Sarah Johnson",
    notes: "Pre-construction meeting with utilities. Need to relocate water main.",
    status: 'pending'
  },
  {
    id: "SV-1005",
    date: "2025-05-12",
    project: "Augusta Highway Extension",
    inspector: "Robert Chen",
    notes: "Environmental review completed. Wetland mitigation plan required.",
    status: 'completed'
  }
];

export default function SiteVisits() {
  const [siteVisits] = useState<SiteVisit[]>(mockSiteVisits);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter data based on search term
  const filteredSiteVisits = siteVisits.filter(visit => 
    visit.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    let badgeClasses = "";
    
    switch(status) {
      case 'pending':
        badgeClasses = "bg-yellow-100 text-yellow-800";
        break;
      case 'in-progress':
        badgeClasses = "bg-blue-100 text-blue-800";
        break;
      case 'completed':
        badgeClasses = "bg-green-100 text-green-800";
        break;
      case 'needs-review':
        badgeClasses = "bg-red-100 text-red-800";
        break;
      default:
        badgeClasses = "bg-gray-100 text-gray-800";
    }
    
    return (
      <div className={cn(
        "w-fit rounded-full px-2 py-1 text-xs font-medium",
        badgeClasses
      )}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    );
  };
  
  const handleNewSiteVisit = () => {
    toast.info("Site visit functionality will be available once Supabase integration is set up.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Site Visits</CardTitle>
          <CardDescription>Track and manage site inspections for estimating</CardDescription>
        </div>
        <Button onClick={handleNewSiteVisit}>
          <MapPin className="mr-2 h-4 w-4" />
          New Site Visit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search site visits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Site Visits Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSiteVisits.length > 0 ? (
                filteredSiteVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>{visit.id}</TableCell>
                    <TableCell>{visit.date}</TableCell>
                    <TableCell>{visit.project}</TableCell>
                    <TableCell>{visit.inspector}</TableCell>
                    <TableCell className="max-w-xs truncate">{visit.notes}</TableCell>
                    <TableCell>{renderStatusBadge(visit.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No site visits found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
