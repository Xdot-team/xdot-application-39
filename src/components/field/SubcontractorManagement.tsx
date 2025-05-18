
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Plus, Star, FileText } from "lucide-react";
import { mockSubcontractors } from "@/data/mockWorkforceData";
import { Subcontractor } from "@/types/workforce";
import { formatDate, formatCurrency } from "@/lib/formatters";

export function SubcontractorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(mockSubcontractors);

  const filteredSubcontractors = subcontractors.filter(
    (subcontractor) =>
      subcontractor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcontractor.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcontractor.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subcontractors..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Subcontractor
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredSubcontractors.map((subcontractor) => (
            <div
              key={subcontractor.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div>
                <p className="font-medium">{subcontractor.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {subcontractor.contactName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Contract</p>
                  <p>{formatDate(subcontractor.contractStart)} - {subcontractor.contractEnd ? formatDate(subcontractor.contractEnd) : 'Ongoing'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rate</p>
                  <p>{formatCurrency(subcontractor.rate.amount)}/{subcontractor.rate.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Projects</p>
                  <p>{subcontractor.currentProjects.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <div className="flex items-center">
                    {renderRating(subcontractor.performance.rating)}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {subcontractor.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {subcontractor.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{subcontractor.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Contract Period</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Active Projects</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcontractors.map((subcontractor) => (
                <TableRow key={subcontractor.id}>
                  <TableCell className="font-medium">
                    {subcontractor.companyName}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{subcontractor.contactName}</p>
                      <p className="text-xs text-muted-foreground">{subcontractor.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subcontractor.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {subcontractor.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{subcontractor.specialties.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(subcontractor.contractStart)} - {subcontractor.contractEnd ? formatDate(subcontractor.contractEnd) : 'Ongoing'}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(subcontractor.rate.amount)}/{subcontractor.rate.unit}
                  </TableCell>
                  <TableCell>{subcontractor.currentProjects.length}</TableCell>
                  <TableCell>{renderRating(subcontractor.performance.rating)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
