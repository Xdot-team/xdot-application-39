import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SubcontractorFormData {
  id?: string;
  company_name: string;
  trade_specialty: string;
  contact_person: string;
  contact_phone: string;
  contact_email?: string;
  address?: string;
  license_number?: string;
  license_expiry?: Date;
  insurance_certificate?: string;
  insurance_expiry?: Date;
  bond_amount?: number;
  bond_expiry?: Date;
  safety_rating?: number;
  quality_rating?: number;
  schedule_rating?: number;
  overall_rating?: number;
  status: string;
  prequalified: boolean;
  prequalification_expiry?: Date;
  contract_value?: number;
  work_completed_value?: number;
  current_projects?: string[];
  certifications?: string[];
  equipment_owned?: string[];
  notes?: string;
  prequalification_score?: number;
}

interface SubcontractorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcontractor?: any;
  onSave: () => void;
}

const tradeSpecialties = [
  'Excavation',
  'Concrete',
  'Asphalt Paving',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Masonry',
  'Roofing',
  'Landscaping',
  'Painting',
  'Flooring',
  'Framing',
  'Drywall',
  'Windows & Doors',
  'Site Work',
  'Utilities',
  'Steel Erection',
  'Demolition'
];

export function SubcontractorForm({ open, onOpenChange, subcontractor, onSave }: SubcontractorFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubcontractorFormData>({
    company_name: '',
    trade_specialty: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    license_number: '',
    insurance_certificate: '',
    bond_amount: 0,
    safety_rating: 0,
    quality_rating: 0,
    schedule_rating: 0,
    overall_rating: 0,
    status: 'active',
    prequalified: false,
    contract_value: 0,
    work_completed_value: 0,
    current_projects: [],
    certifications: [],
    equipment_owned: [],
    notes: '',
    prequalification_score: 0
  });

  const [newProject, setNewProject] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  useEffect(() => {
    if (subcontractor) {
      setFormData({
        ...subcontractor,
        license_expiry: subcontractor.license_expiry ? new Date(subcontractor.license_expiry) : undefined,
        insurance_expiry: subcontractor.insurance_expiry ? new Date(subcontractor.insurance_expiry) : undefined,
        bond_expiry: subcontractor.bond_expiry ? new Date(subcontractor.bond_expiry) : undefined,
        prequalification_expiry: subcontractor.prequalification_expiry ? new Date(subcontractor.prequalification_expiry) : undefined,
      });
    } else {
      // Reset form
      setFormData({
        company_name: '',
        trade_specialty: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        address: '',
        license_number: '',
        insurance_certificate: '',
        bond_amount: 0,
        safety_rating: 0,
        quality_rating: 0,
        schedule_rating: 0,
        overall_rating: 0,
        status: 'active',
        prequalified: false,
        contract_value: 0,
        work_completed_value: 0,
        current_projects: [],
        certifications: [],
        equipment_owned: [],
        notes: '',
        prequalification_score: 0
      });
    }
  }, [subcontractor, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const subcontractorData = {
        company_name: formData.company_name,
        trade_specialty: formData.trade_specialty,
        contact_person: formData.contact_person,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email || null,
        address: formData.address || null,
        license_number: formData.license_number || null,
        license_expiry: formData.license_expiry?.toISOString().split('T')[0] || null,
        insurance_certificate: formData.insurance_certificate || null,
        insurance_expiry: formData.insurance_expiry?.toISOString().split('T')[0] || null,
        bond_amount: formData.bond_amount || 0,
        bond_expiry: formData.bond_expiry?.toISOString().split('T')[0] || null,
        safety_rating: formData.safety_rating || 0,
        quality_rating: formData.quality_rating || 0,
        schedule_rating: formData.schedule_rating || 0,
        overall_rating: formData.overall_rating || 0,
        status: formData.status,
        prequalified: formData.prequalified,
        prequalification_expiry: formData.prequalification_expiry?.toISOString().split('T')[0] || null,
        contract_value: formData.contract_value || 0,
        work_completed_value: formData.work_completed_value || 0,
        current_projects: formData.current_projects || [],
        certifications: formData.certifications || [],
        equipment_owned: formData.equipment_owned || [],
        notes: formData.notes || null,
        prequalification_score: formData.prequalification_score || 0
      };

      if (subcontractor?.id) {
        // Update existing subcontractor
        const { error } = await supabase
          .from('subcontractors')
          .update(subcontractorData)
          .eq('id', subcontractor.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Subcontractor updated successfully",
        });
      } else {
        // Create new subcontractor
        const { error } = await supabase
          .from('subcontractors')
          .insert([subcontractorData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Subcontractor created successfully",
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subcontractor:', error);
      toast({
        title: "Error",
        description: "Failed to save subcontractor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    if (newProject.trim()) {
      setFormData(prev => ({
        ...prev,
        current_projects: [...(prev.current_projects || []), newProject.trim()]
      }));
      setNewProject('');
    }
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      current_projects: prev.current_projects?.filter((_, i) => i !== index) || []
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index) || []
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment_owned: [...(prev.equipment_owned || []), newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment_owned: prev.equipment_owned?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {subcontractor ? 'Edit Subcontractor' : 'Add New Subcontractor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="trade_specialty">Trade Specialty *</Label>
              <Select 
                value={formData.trade_specialty} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, trade_specialty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trade specialty" />
                </SelectTrigger>
                <SelectContent>
                  {tradeSpecialties.map((trade) => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone *</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
            />
          </div>

          {/* License & Insurance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">License & Insurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>License Expiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.license_expiry ? format(formData.license_expiry, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.license_expiry}
                      onSelect={(date) => setFormData(prev => ({ ...prev, license_expiry: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance_certificate">Insurance Certificate</Label>
                <Input
                  id="insurance_certificate"
                  value={formData.insurance_certificate}
                  onChange={(e) => setFormData(prev => ({ ...prev, insurance_certificate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Insurance Expiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.insurance_expiry ? format(formData.insurance_expiry, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.insurance_expiry}
                      onSelect={(date) => setFormData(prev => ({ ...prev, insurance_expiry: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bond_amount">Bond Amount</Label>
                <Input
                  id="bond_amount"
                  type="number"
                  value={formData.bond_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, bond_amount: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Bond Expiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.bond_expiry ? format(formData.bond_expiry, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.bond_expiry}
                      onSelect={(date) => setFormData(prev => ({ ...prev, bond_expiry: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Performance Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Ratings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="safety_rating">Safety Rating (1-10)</Label>
                <Input
                  id="safety_rating"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.safety_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, safety_rating: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality_rating">Quality Rating (1-10)</Label>
                <Input
                  id="quality_rating"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.quality_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, quality_rating: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule_rating">Schedule Rating (1-10)</Label>
                <Input
                  id="schedule_rating"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.schedule_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule_rating: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overall_rating">Overall Rating (1-10)</Label>
                <Input
                  id="overall_rating"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.overall_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, overall_rating: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* Prequalification */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prequalified"
                checked={formData.prequalified}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prequalified: checked as boolean }))}
              />
              <Label htmlFor="prequalified">Prequalified</Label>
            </div>

            {formData.prequalified && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prequalification Expiry</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.prequalification_expiry ? format(formData.prequalification_expiry, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.prequalification_expiry}
                        onSelect={(date) => setFormData(prev => ({ ...prev, prequalification_expiry: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prequalification_score">Prequalification Score</Label>
                  <Input
                    id="prequalification_score"
                    type="number"
                    value={formData.prequalification_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, prequalification_score: Number(e.target.value) }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract_value">Total Contract Value</Label>
                <Input
                  id="contract_value"
                  type="number"
                  value={formData.contract_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, contract_value: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_completed_value">Work Completed Value</Label>
                <Input
                  id="work_completed_value"
                  type="number"
                  value={formData.work_completed_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_completed_value: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* Current Projects */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Projects</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Project name"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProject())}
                />
                <Button type="button" onClick={addProject} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.current_projects?.map((project, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <span className="text-sm">{project}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certifications</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Certification name"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <Button type="button" onClick={addCertification} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <span className="text-sm">{cert}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment Owned */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Equipment Owned</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Equipment name"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                />
                <Button type="button" onClick={addEquipment} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.equipment_owned?.map((equipment, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <span className="text-sm">{equipment}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEquipment(index)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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