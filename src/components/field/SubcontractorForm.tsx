import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Plus, X, Upload } from 'lucide-react';

interface Subcontractor {
  id?: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  address?: string;
  trade_specialty: string;
  license_number?: string;
  license_expiry?: string;
  insurance_certificate?: string;
  insurance_expiry: string;
  bond_amount?: number;
  bond_expiry?: string;
  safety_rating?: number;
  quality_rating?: number;
  schedule_rating?: number;
  overall_rating?: number;
  status: string;
  prequalified?: boolean;
  prequalification_expiry?: string;
  contract_value?: number;
  work_completed_value?: number;
  current_projects?: string[];
  certifications?: string[];
  key_personnel?: any;
  equipment_owned?: string[];
  notes?: string;
}

interface SubcontractorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcontractor?: Subcontractor | null;
  onSave: () => void;
}

export function SubcontractorForm({ open, onOpenChange, subcontractor, onSave }: SubcontractorFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Subcontractor>({
    company_name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    trade_specialty: '',
    license_number: '',
    insurance_expiry: '',
    bond_amount: 0,
    overall_rating: 5,
    status: 'active',
    notes: '',
    certifications: [],
    current_projects: [],
    equipment_owned: []
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  React.useEffect(() => {
    if (subcontractor) {
      setFormData(subcontractor);
    } else {
      setFormData({
        company_name: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        trade_specialty: '',
        license_number: '',
        insurance_expiry: '',
        bond_amount: 0,
        overall_rating: 5,
        status: 'active',
        notes: '',
        certifications: [],
        current_projects: [],
        equipment_owned: []
      });
    }
  }, [subcontractor, open]);

  const predefinedSpecialties = [
    'Electrical',
    'Plumbing',
    'HVAC',
    'Concrete',
    'Roofing',
    'Flooring',
    'Painting',
    'Landscaping',
    'Excavation',
    'Masonry',
    'Drywall',
    'Insulation',
    'Windows & Doors',
    'Site Preparation',
    'Utilities',
    'Road Work',
    'Bridge Construction',
    'Demolition'
  ];

  const addSpecialty = (specialty: string) => {
    if (specialty && formData.trade_specialty !== specialty) {
      setFormData(prev => ({
        ...prev,
        trade_specialty: specialty
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = () => {
    setFormData(prev => ({
      ...prev,
      trade_specialty: ''
    }));
  };

  const uploadDocument = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `subcontractors/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), publicUrl]
      }));

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const subcontractorData = {
        ...formData,
        bond_amount: formData.bond_amount || 0,
        overall_rating: formData.overall_rating || 5
      };

      if (subcontractor?.id) {
        // Update existing subcontractor
        const { error } = await supabase
          .from('subcontractors')
          .update(subcontractorData)
          .eq('id', subcontractor.id);

        if (error) throw error;
        toast.success('Subcontractor updated successfully');
      } else {
        // Create new subcontractor
        const { error } = await supabase
          .from('subcontractors')
          .insert([subcontractorData]);

        if (error) throw error;
        toast.success('Subcontractor created successfully');
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subcontractor:', error);
      toast.error('Failed to save subcontractor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {subcontractor ? 'Edit Subcontractor' : 'Add New Subcontractor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Company Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Primary Contact *</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone *</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specialties & Skills */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Specialties & Skills</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedSpecialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => addSpecialty(newSpecialty)}
                    disabled={!newSpecialty || formData.trade_specialty === newSpecialty}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.trade_specialty && (
                    <Badge variant="secondary" className="gap-2">
                      {formData.trade_specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty()}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications & Legal */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Certifications & Legal</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance_expiry">Insurance Expiry *</Label>
                  <Input
                    id="insurance_expiry"
                    type="date"
                    value={formData.insurance_expiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, insurance_expiry: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bond_amount">Bond Amount ($)</Label>
                  <Input
                    id="bond_amount"
                    type="number"
                    value={formData.bond_amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bond_amount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blacklisted">Blacklisted</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Documents */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Performance & Documents</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="overall_rating">Performance Rating (1-5)</Label>
                  <Select
                    value={formData.overall_rating?.toString() || '5'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, overall_rating: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Poor</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Documents</Label>
                  <div className="flex flex-col items-center p-4 text-center border-2 border-dashed rounded-md">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload insurance, licenses, certifications
                    </p>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Upload Documents</span>
                      </Button>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(uploadDocument);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Performance notes, special requirements, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : subcontractor ? 'Update' : 'Create'} Subcontractor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}