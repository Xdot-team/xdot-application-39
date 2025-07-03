import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useFormValidation, ValidationRules } from "@/hooks/useFormValidation";
import { Package, Calendar, MapPin } from 'lucide-react';

interface MaterialFormData {
  material_name: string;
  material_code?: string;
  category: string;
  unit: string;
  quantity_on_hand: number;
  unit_cost: number;
  minimum_stock?: number;
  supplier?: string;
  location_on_site?: string;
  storage_requirements?: string;
  expiry_date?: string;
  lot_number?: string;
  notes?: string;
  project_id?: string;
  site_id?: string;
}

interface MaterialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: any;
  onSave: () => void;
}

export function MaterialForm({ open, onOpenChange, material, onSave }: MaterialFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MaterialFormData>({
    material_name: '',
    category: 'general',
    unit: 'each',
    quantity_on_hand: 0,
    unit_cost: 0,
    minimum_stock: 0
  });

  React.useEffect(() => {
    if (material) {
      setFormData({
        material_name: material.material_name || '',
        material_code: material.material_code || '',
        category: material.category || 'general',
        unit: material.unit || 'each',
        quantity_on_hand: material.quantity_on_hand || 0,
        unit_cost: material.unit_cost || 0,
        minimum_stock: material.minimum_stock || 0,
        supplier: material.supplier || '',
        location_on_site: material.location_on_site || '',
        storage_requirements: material.storage_requirements || '',
        expiry_date: material.expiry_date || '',
        lot_number: material.lot_number || '',
        notes: material.notes || '',
        project_id: material.project_id || '',
        site_id: material.site_id || ''
      });
    } else {
      setFormData({
        material_name: '',
        category: 'general',
        unit: 'each',
        quantity_on_hand: 0,
        unit_cost: 0,
        minimum_stock: 0
      });
    }
  }, [material, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        total_value: formData.quantity_on_hand * formData.unit_cost,
        quantity_available: formData.quantity_on_hand
      };

      if (material?.id) {
        // Update existing material
        const { error } = await supabase
          .from('material_inventory')
          .update(submitData)
          .eq('id', material.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Material updated successfully",
        });
      } else {
        // Create new material
        const { error } = await supabase
          .from('material_inventory')
          .insert([submitData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Material created successfully",
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        title: "Error",
        description: "Failed to save material",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'general', 'asphalt', 'concrete', 'aggregate', 'steel', 'tools', 'safety', 'chemicals', 'electrical'
  ];

  const units = [
    'each', 'tons', 'yards', 'feet', 'pounds', 'gallons', 'pallets', 'boxes', 'bags'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {material ? 'Edit Material' : 'Add New Material'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="material_name">Material Name *</Label>
                  <Input
                    id="material_name"
                    value={formData.material_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, material_name: e.target.value }))}
                    placeholder="e.g., Asphalt Mix Type B"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material_code">Material Code</Label>
                  <Input
                    id="material_code"
                    value={formData.material_code || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, material_code: e.target.value }))}
                    placeholder="e.g., MAT-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity_on_hand">Quantity on Hand *</Label>
                  <Input
                    id="quantity_on_hand"
                    type="number"
                    value={formData.quantity_on_hand}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity_on_hand: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_cost">Unit Cost ($) *</Label>
                  <Input
                    id="unit_cost"
                    type="number"
                    value={formData.unit_cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_stock">Minimum Stock</Label>
                  <Input
                    id="minimum_stock"
                    type="number"
                    value={formData.minimum_stock || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Total Value:</strong> ${((formData.quantity_on_hand || 0) * (formData.unit_cost || 0)).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="e.g., ABC Materials Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location_on_site">Location on Site</Label>
                  <Input
                    id="location_on_site"
                    value={formData.location_on_site || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_on_site: e.target.value }))}
                    placeholder="e.g., North Yard, Bay 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lot_number">Lot Number</Label>
                  <Input
                    id="lot_number"
                    value={formData.lot_number || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lot_number: e.target.value }))}
                    placeholder="e.g., LOT-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage_requirements">Storage Requirements</Label>
                <Textarea
                  id="storage_requirements"
                  value={formData.storage_requirements || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, storage_requirements: e.target.value }))}
                  placeholder="e.g., Keep dry, store at room temperature"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this material"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : material ? 'Update' : 'Create'} Material
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}