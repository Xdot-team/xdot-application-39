import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, Plus, Star, FileText, MoreHorizontal, Edit, Trash2, Building2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SubcontractorForm } from './SubcontractorForm';
import { formatDate, formatCurrency } from '@/lib/formatters';

interface Subcontractor {
  id: string;
  company_name: string;
  trade_specialty: string;
  contact_person: string;
  contact_phone: string;
  contact_email?: string;
  address?: string;
  license_number?: string;
  license_expiry?: string;
  insurance_certificate?: string;
  insurance_expiry?: string;
  bond_amount?: number;
  bond_expiry?: string;
  safety_rating?: number;
  quality_rating?: number;
  schedule_rating?: number;
  overall_rating?: number;
  status: string;
  prequalified: boolean;
  prequalification_expiry?: string;
  contract_value?: number;
  work_completed_value?: number;
  current_projects?: string[];
  certifications?: string[];
  equipment_owned?: string[];
  notes?: string;
  prequalification_score?: number;
  created_at: string;
  updated_at: string;
}

export function SubcontractorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSubcontractors();
  }, []);

  const fetchSubcontractors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setSubcontractors(data || []);
    } catch (error) {
      console.error('Error fetching subcontractors:', error);
      toast({
        title: "Error",
        description: "Failed to load subcontractors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubcontractors = subcontractors.filter(
    (subcontractor) =>
      subcontractor.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcontractor.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcontractor.trade_specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (subcontractor: Subcontractor) => {
    // Convert string dates to Date objects for the form
    const formData = {
      ...subcontractor,
      license_expiry: subcontractor.license_expiry ? new Date(subcontractor.license_expiry) : undefined,
      insurance_expiry: subcontractor.insurance_expiry ? new Date(subcontractor.insurance_expiry) : undefined,
      bond_expiry: subcontractor.bond_expiry ? new Date(subcontractor.bond_expiry) : undefined,
      prequalification_expiry: subcontractor.prequalification_expiry ? new Date(subcontractor.prequalification_expiry) : undefined,
    };
    setSelectedSubcontractor(formData);
    setIsFormOpen(true);
  };

  const handleDelete = async (subcontractor: Subcontractor) => {
    if (!confirm('Are you sure you want to delete this subcontractor?')) return;

    try {
      const { error } = await supabase
        .from('subcontractors')
        .delete()
        .eq('id', subcontractor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subcontractor deleted successfully",
      });
      
      fetchSubcontractors();
    } catch (error) {
      console.error('Error deleting subcontractor:', error);
      toast({
        title: "Error",
        description: "Failed to delete subcontractor",
        variant: "destructive",
      });
    }
  };

  const handleFormSave = () => {
    fetchSubcontractors();
    setSelectedSubcontractor(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedSubcontractor(null);
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-muted-foreground">Not rated</span>;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.round(rating / 2) ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2">{rating}/10</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
      pending: "outline",
    };
    
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading subcontractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <div>
            <h2 className="text-2xl font-bold">Subcontractor Management</h2>
            <p className="text-muted-foreground">
              Manage subcontractor relationships and performance
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subcontractors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subcontractor
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subcontractors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subcontractors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subcontractors.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prequalified</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subcontractors.filter(s => s.prequalified).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(subcontractors.reduce((sum, s) => sum + (s.contract_value || 0), 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subcontractors List */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredSubcontractors.map((subcontractor) => (
            <Card key={subcontractor.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{subcontractor.company_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {subcontractor.contact_person}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subcontractor.trade_specialty}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(subcontractor.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(subcontractor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(subcontractor)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p>{subcontractor.contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <div className="flex items-center">
                      {renderRating(subcontractor.overall_rating)}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projects</p>
                    <p>{subcontractor.current_projects?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Value</p>
                    <p>{formatCurrency(subcontractor.contract_value || 0)}</p>
                  </div>
                </div>

                {subcontractor.prequalified && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Prequalified
                    </Badge>
                    {subcontractor.prequalification_expiry && (
                      <span className="text-xs text-muted-foreground">
                        Expires: {formatDate(subcontractor.prequalification_expiry)}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubcontractors.map((subcontractor) => (
                  <TableRow key={subcontractor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{subcontractor.company_name}</p>
                        {subcontractor.prequalified && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Prequalified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{subcontractor.contact_person}</p>
                        <p className="text-xs text-muted-foreground">
                          {subcontractor.contact_phone}
                        </p>
                        {subcontractor.contact_email && (
                          <p className="text-xs text-muted-foreground">
                            {subcontractor.contact_email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subcontractor.trade_specialty}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(subcontractor.status)}</TableCell>
                    <TableCell>{renderRating(subcontractor.overall_rating)}</TableCell>
                    <TableCell>{subcontractor.current_projects?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(subcontractor.contract_value || 0)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(subcontractor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(subcontractor)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredSubcontractors.length === 0 && !loading && (
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No subcontractors found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search terms' : 'Add your first subcontractor to get started'}
          </p>
        </div>
      )}

      {/* Subcontractor Form */}
      <SubcontractorForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        subcontractor={selectedSubcontractor}
        onSave={handleFormSave}
      />
    </div>
  );
}