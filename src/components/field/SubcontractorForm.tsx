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
  contact_name: string;
  email: string;
  phone: string;
  address?: string;
  specialties: string[];
  license_number?: string;
  insurance_expiry: string;
  bond_amount?: number;
  rating: number;
  status: string;
  notes?: string;
  documents?: string[];
  emergency_contact?: string;
  emergency_phone?: string;
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
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    specialties: [],
    license_number: '',
    insurance_expiry: '',
    bond_amount: 0,
    rating: 5,
    status: 'active',
    notes: '',
    documents: [],
    emergency_contact: '',
    emergency_phone: ''
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  React.useEffect(() => {
    if (subcontractor) {
      setFormData(subcontractor);
    } else {
      setFormData({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        specialties: [],
        license_number: '',
        insurance_expiry: '',
        bond_amount: 0,
        rating: 5,
        status: 'active',
        notes: '',
        documents: [],
        emergency_contact: '',
        emergency_phone: ''
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
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
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
        documents: [...(prev.documents || []), publicUrl]
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
        rating: formData.rating || 5
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
                  <Label htmlFor="contact_name">Primary Contact *</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                    disabled={!newSpecialty || formData.specialties.includes(newSpecialty)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="gap-2">
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
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

          {/* Emergency Contact */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-lg">Emergency Contact</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Emergency Phone</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_phone: e.target.value }))}
                  />
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
                  <Label htmlFor="rating">Performance Rating (1-5)</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
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