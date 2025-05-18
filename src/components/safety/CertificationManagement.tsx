
import { useState } from "react";
import { Search, Filter, FileText, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Certification, CertificationType } from "@/types/workforce";
import { format } from "date-fns";

// Mock data for certifications
const mockCertifications: Certification[] = [
  {
    id: "cert-001",
    type: "OSHA",
    issuedDate: "2024-11-15",
    expiryDate: "2025-11-15",
    issuingAuthority: "Occupational Safety and Health Administration",
    documentUrl: "https://example.com/cert-001",
    verified: true
  },
  {
    id: "cert-002",
    type: "First Aid",
    issuedDate: "2024-10-05",
    expiryDate: "2026-10-05",
    issuingAuthority: "American Red Cross",
    documentUrl: "https://example.com/cert-002",
    verified: true
  },
  {
    id: "cert-003",
    type: "CPR",
    issuedDate: "2024-10-05",
    expiryDate: "2026-10-05",
    issuingAuthority: "American Heart Association",
    documentUrl: "https://example.com/cert-003",
    verified: false
  },
  {
    id: "cert-004",
    type: "Crane Operation",
    issuedDate: "2024-07-20",
    expiryDate: "2025-07-20",
    issuingAuthority: "National Commission for the Certification of Crane Operators",
    documentUrl: "https://example.com/cert-004",
    verified: true
  },
  {
    id: "cert-005",
    type: "Scaffold",
    issuedDate: "2025-01-10",
    expiryDate: "2026-01-10",
    issuingAuthority: "Scaffold Training Institute",
    verified: false
  },
  {
    id: "cert-006",
    type: "Fall Protection",
    issuedDate: "2024-09-15",
    expiryDate: "2025-09-15",
    issuingAuthority: "Safety Training Solutions",
    documentUrl: "https://example.com/cert-006",
    verified: true
  },
  {
    id: "cert-007",
    type: "Hazmat",
    issuedDate: "2024-08-20",
    expiryDate: "2025-08-20",
    issuingAuthority: "Environmental Protection Agency",
    verified: true
  },
  {
    id: "cert-008",
    type: "Electrical",
    issuedDate: "2024-06-15",
    expiryDate: "2026-06-15",
    issuingAuthority: "National Electrical Contractors Association",
    documentUrl: "https://example.com/cert-008",
    verified: true
  },
  {
    id: "cert-009",
    type: "Confined Space",
    issuedDate: "2024-12-01",
    expiryDate: "2025-12-01",
    issuingAuthority: "Safety First Training",
    documentUrl: "https://example.com/cert-009",
    verified: false
  },
  {
    id: "cert-010",
    type: "Forklift",
    issuedDate: "2024-05-10",
    expiryDate: "2026-05-10",
    issuingAuthority: "Occupational Safety and Health Administration",
    documentUrl: "https://example.com/cert-010",
    verified: true
  }
];

// Helper to get all unique certification types
const certificationType: CertificationType[] = [
  'CDL',
  'OSHA',
  'First Aid',
  'CPR',
  'Welding',
  'Electrical',
  'Plumbing',
  'Crane Operation',
  'Forklift',
  'Scaffold',
  'Confined Space',
  'Fall Protection',
  'Hazmat',
  'Project Management',
  'SHRM-CP',
  'CPE',
  'CPA'
];

export function CertificationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [certifications, setCertifications] = useState<Certification[]>(mockCertifications);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter certifications based on search query and filters
  const filteredCertifications = certifications.filter((cert) => {
    // Search filter
    const matchesSearch = 
      cert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === "all" || cert.type === typeFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === "verified") {
      matchesStatus = cert.verified === true;
    } else if (statusFilter === "unverified") {
      matchesStatus = cert.verified === false;
    } else if (statusFilter === "expiringSoon") {
      matchesStatus = getDaysUntilExpiry(cert.expiryDate) <= 30 && getDaysUntilExpiry(cert.expiryDate) > 0;
    } else if (statusFilter === "expired") {
      matchesStatus = getDaysUntilExpiry(cert.expiryDate) <= 0;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Render certification status
  const renderCertStatus = (cert: Certification) => {
    const daysUntilExpiry = getDaysUntilExpiry(cert.expiryDate);
    
    if (daysUntilExpiry <= 0) {
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="w-4 h-4 mr-1" />
          <span>Expired</span>
        </div>
      );
    } else if (daysUntilExpiry <= 30) {
      return (
        <div className="flex items-center text-amber-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>Expires in {daysUntilExpiry} days</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Valid for {daysUntilExpiry} days</span>
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certifications..."
              className="pl-10 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {certificationType.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="expiringSoon">Expiring Soon (30 days)</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Issuing Authority</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertifications.length > 0 ? (
              filteredCertifications.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{cert.type}</Badge>
                  </TableCell>
                  <TableCell>{cert.issuingAuthority}</TableCell>
                  <TableCell>{format(new Date(cert.issuedDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(cert.expiryDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{renderCertStatus(cert)}</TableCell>
                  <TableCell>
                    {cert.verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No certifications found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>Showing {filteredCertifications.length} of {certifications.length} certifications</p>
        <p>Last updated: {format(new Date(), "MMMM d, yyyy")}</p>
      </div>
    </div>
  );
}
