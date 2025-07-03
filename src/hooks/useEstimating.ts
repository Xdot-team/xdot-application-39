import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Use Supabase generated types
type Estimate = Database['public']['Tables']['estimates']['Row'];
type EstimateItem = Database['public']['Tables']['estimate_items']['Row'];
type EstimateVersion = Database['public']['Tables']['estimate_versions']['Row'];
type VendorBid = Database['public']['Tables']['vendor_bids']['Row'];
type VendorBidItem = Database['public']['Tables']['vendor_bid_items']['Row'];
type TakeoffMeasurement = Database['public']['Tables']['takeoff_measurements']['Row'];
type EstimateTemplate = Database['public']['Tables']['estimate_templates']['Row'];
type MaterialCost = Database['public']['Tables']['material_costs']['Row'];
type LaborRate = Database['public']['Tables']['labor_rates']['Row'];
type SiteVisitReport = Database['public']['Tables']['site_visit_reports']['Row'];
type BuyoutPackage = Database['public']['Tables']['buyout_packages']['Row'];

// Insert types for creating new records
type EstimateInsert = Database['public']['Tables']['estimates']['Insert'];
type EstimateItemInsert = Database['public']['Tables']['estimate_items']['Insert'];
type VendorBidInsert = Database['public']['Tables']['vendor_bids']['Insert'];
type TakeoffMeasurementInsert = Database['public']['Tables']['takeoff_measurements']['Insert'];
type SiteVisitReportInsert = Database['public']['Tables']['site_visit_reports']['Insert'];
type BuyoutPackageInsert = Database['public']['Tables']['buyout_packages']['Insert'];

export function useEstimating() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const [vendorBids, setVendorBids] = useState<VendorBid[]>([]);
  const [templates, setTemplates] = useState<EstimateTemplate[]>([]);
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [laborRates, setLaborRates] = useState<LaborRate[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisitReport[]>([]);
  const [buyoutPackages, setBuyoutPackages] = useState<BuyoutPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all estimating data
  const fetchEstimatingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        estimatesResult,
        estimateItemsResult,
        vendorBidsResult,
        templatesResult,
        materialCostsResult,
        laborRatesResult,
        siteVisitsResult,
        buyoutPackagesResult
      ] = await Promise.all([
        supabase.from('estimates').select('*').order('created_at', { ascending: false }),
        supabase.from('estimate_items').select('*').order('created_at', { ascending: false }),
        supabase.from('vendor_bids').select('*').order('created_at', { ascending: false }),
        supabase.from('estimate_templates').select('*').order('created_at', { ascending: false }),
        supabase.from('material_costs').select('*').order('name', { ascending: true }),
        supabase.from('labor_rates').select('*').order('trade', { ascending: true }),
        supabase.from('site_visit_reports').select('*').order('visit_date', { ascending: false }),
        supabase.from('buyout_packages').select('*').order('created_at', { ascending: false })
      ]);

      if (estimatesResult.error) throw estimatesResult.error;
      if (estimateItemsResult.error) throw estimateItemsResult.error;
      if (vendorBidsResult.error) throw vendorBidsResult.error;
      if (templatesResult.error) throw templatesResult.error;
      if (materialCostsResult.error) throw materialCostsResult.error;
      if (laborRatesResult.error) throw laborRatesResult.error;
      if (siteVisitsResult.error) throw siteVisitsResult.error;
      if (buyoutPackagesResult.error) throw buyoutPackagesResult.error;

      setEstimates(estimatesResult.data || []);
      setEstimateItems(estimateItemsResult.data || []);
      setVendorBids(vendorBidsResult.data || []);
      setTemplates(templatesResult.data || []);
      setMaterialCosts(materialCostsResult.data || []);
      setLaborRates(laborRatesResult.data || []);
      setSiteVisits(siteVisitsResult.data || []);
      setBuyoutPackages(buyoutPackagesResult.data || []);
    } catch (err) {
      console.error('Error fetching estimating data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Failed to load estimating data');
    } finally {
      setLoading(false);
    }
  };

  // Estimate operations
  const createEstimate = async (estimateData: EstimateInsert) => {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .insert([estimateData])
        .select()
        .single();

      if (error) throw error;

      setEstimates(prev => [data, ...prev]);
      toast.success('Estimate created successfully');
      return data;
    } catch (err) {
      console.error('Error creating estimate:', err);
      toast.error('Failed to create estimate');
      throw err;
    }
  };

  const updateEstimate = async (id: string, updates: Partial<Estimate>) => {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEstimates(prev => prev.map(est => est.id === id ? data : est));
      toast.success('Estimate updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating estimate:', err);
      toast.error('Failed to update estimate');
      throw err;
    }
  };

  // Estimate Item operations
  const createEstimateItem = async (itemData: EstimateItemInsert) => {
    try {
      const { data, error } = await supabase
        .from('estimate_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      setEstimateItems(prev => [data, ...prev]);
      
      // Update estimate total
      if (itemData.estimate_id) {
        await updateEstimateTotal(itemData.estimate_id);
      }
      
      toast.success('Estimate item added successfully');
      return data;
    } catch (err) {
      console.error('Error creating estimate item:', err);
      toast.error('Failed to add estimate item');
      throw err;
    }
  };

  const updateEstimateItem = async (id: string, updates: Partial<EstimateItem>) => {
    try {
      const { data, error } = await supabase
        .from('estimate_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEstimateItems(prev => prev.map(item => item.id === id ? data : item));
      
      // Update estimate total
      if (data.estimate_id) {
        await updateEstimateTotal(data.estimate_id);
      }
      
      toast.success('Estimate item updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating estimate item:', err);
      toast.error('Failed to update estimate item');
      throw err;
    }
  };

  const deleteEstimateItem = async (id: string) => {
    try {
      const item = estimateItems.find(item => item.id === id);
      
      const { error } = await supabase
        .from('estimate_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEstimateItems(prev => prev.filter(item => item.id !== id));
      
      // Update estimate total
      if (item?.estimate_id) {
        await updateEstimateTotal(item.estimate_id);
      }
      
      toast.success('Estimate item deleted successfully');
    } catch (err) {
      console.error('Error deleting estimate item:', err);
      toast.error('Failed to delete estimate item');
      throw err;
    }
  };

  // Helper function to update estimate total
  const updateEstimateTotal = async (estimateId: string) => {
    const items = estimateItems.filter(item => item.estimate_id === estimateId);
    const total = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
    
    await updateEstimate(estimateId, { total_cost: total });
  };

  // Vendor Bid operations
  const createVendorBid = async (bidData: VendorBidInsert) => {
    try {
      const { data, error } = await supabase
        .from('vendor_bids')
        .insert([bidData])
        .select()
        .single();

      if (error) throw error;

      setVendorBids(prev => [data, ...prev]);
      toast.success('Vendor bid created successfully');
      return data;
    } catch (err) {
      console.error('Error creating vendor bid:', err);
      toast.error('Failed to create vendor bid');
      throw err;
    }
  };

  const updateVendorBid = async (id: string, updates: Partial<VendorBid>) => {
    try {
      const { data, error } = await supabase
        .from('vendor_bids')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVendorBids(prev => prev.map(bid => bid.id === id ? data : bid));
      toast.success('Vendor bid updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating vendor bid:', err);
      toast.error('Failed to update vendor bid');
      throw err;
    }
  };

  // Site Visit operations
  const createSiteVisit = async (visitData: SiteVisitReportInsert) => {
    try {
      const { data, error } = await supabase
        .from('site_visit_reports')
        .insert([visitData])
        .select()
        .single();

      if (error) throw error;

      setSiteVisits(prev => [data, ...prev]);
      toast.success('Site visit report created successfully');
      return data;
    } catch (err) {
      console.error('Error creating site visit:', err);
      toast.error('Failed to create site visit report');
      throw err;
    }
  };

  // Buyout Package operations
  const createBuyoutPackage = async (packageData: BuyoutPackageInsert) => {
    try {
      const { data, error } = await supabase
        .from('buyout_packages')
        .insert([packageData])
        .select()
        .single();

      if (error) throw error;

      setBuyoutPackages(prev => [data, ...prev]);
      toast.success('Buyout package created successfully');
      return data;
    } catch (err) {
      console.error('Error creating buyout package:', err);
      toast.error('Failed to create buyout package');
      throw err;
    }
  };

  const updateBuyoutPackage = async (id: string, updates: Partial<BuyoutPackage>) => {
    try {
      const { data, error } = await supabase
        .from('buyout_packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBuyoutPackages(prev => prev.map(pkg => pkg.id === id ? data : pkg));
      toast.success('Buyout package updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating buyout package:', err);
      toast.error('Failed to update buyout package');
      throw err;
    }
  };

  // Get estimate with items
  const getEstimateWithItems = (estimateId: string) => {
    const estimate = estimates.find(est => est.id === estimateId);
    const items = estimateItems.filter(item => item.estimate_id === estimateId);
    
    return {
      estimate,
      items,
      bids: vendorBids.filter(bid => bid.estimate_id === estimateId),
      buyoutPackages: buyoutPackages.filter(pkg => pkg.estimate_id === estimateId)
    };
  };

  // Calculate estimate summary
  const getEstimateSummary = () => {
    const totalEstimatedValue = estimates.reduce((sum, est) => sum + (est.total_cost || 0), 0);
    
    const getCountByStatus = (status: string) => 
      estimates.filter(est => est.status === status).length;

    return {
      totalEstimatedValue,
      totalEstimates: estimates.length,
      draftCount: getCountByStatus('draft'),
      submittedCount: getCountByStatus('submitted'),
      approvedCount: getCountByStatus('approved'),
      rejectedCount: getCountByStatus('rejected')
    };
  };

  useEffect(() => {
    fetchEstimatingData();
  }, []);

  return {
    // Data
    estimates,
    estimateItems,
    vendorBids,
    templates,
    materialCosts,
    laborRates,
    siteVisits,
    buyoutPackages,
    loading,
    error,
    
    // Operations
    createEstimate,
    updateEstimate,
    createEstimateItem,
    updateEstimateItem,
    deleteEstimateItem,
    createVendorBid,
    updateVendorBid,
    createSiteVisit,
    createBuyoutPackage,
    updateBuyoutPackage,
    
    // Computed values
    getEstimateWithItems,
    getEstimateSummary,
    
    // Utility
    refetch: fetchEstimatingData
  };
}