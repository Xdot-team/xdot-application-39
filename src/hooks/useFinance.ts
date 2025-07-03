import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Use Supabase generated types
type ClientInvoice = Database['public']['Tables']['client_invoices']['Row'];
type VendorInvoice = Database['public']['Tables']['vendor_invoices']['Row'];
type PurchaseOrder = Database['public']['Tables']['purchase_orders']['Row'];
type FinancialTransaction = Database['public']['Tables']['financial_transactions']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];
type TaxFiling = Database['public']['Tables']['tax_filings']['Row'];

// Insert types for creating new records
type ClientInvoiceInsert = Database['public']['Tables']['client_invoices']['Insert'];
type VendorInvoiceInsert = Database['public']['Tables']['vendor_invoices']['Insert'];
type PurchaseOrderInsert = Database['public']['Tables']['purchase_orders']['Insert'];
type FinancialTransactionInsert = Database['public']['Tables']['financial_transactions']['Insert'];
type TaxFilingInsert = Database['public']['Tables']['tax_filings']['Insert'];

export function useFinance() {
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>([]);
  const [vendorInvoices, setVendorInvoices] = useState<VendorInvoice[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [taxFilings, setTaxFilings] = useState<TaxFiling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all financial data
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        clientInvoicesResult,
        vendorInvoicesResult,
        purchaseOrdersResult,
        transactionsResult,
        budgetsResult,
        taxFilingsResult
      ] = await Promise.all([
        supabase.from('client_invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('vendor_invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('financial_transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('budgets').select('*').order('created_at', { ascending: false }),
        supabase.from('tax_filings').select('*').order('created_at', { ascending: false })
      ]);

      if (clientInvoicesResult.error) throw clientInvoicesResult.error;
      if (vendorInvoicesResult.error) throw vendorInvoicesResult.error;
      if (purchaseOrdersResult.error) throw purchaseOrdersResult.error;
      if (transactionsResult.error) throw transactionsResult.error;
      if (budgetsResult.error) throw budgetsResult.error;
      if (taxFilingsResult.error) throw taxFilingsResult.error;

      setClientInvoices(clientInvoicesResult.data || []);
      setVendorInvoices(vendorInvoicesResult.data || []);
      setPurchaseOrders(purchaseOrdersResult.data || []);
      setTransactions(transactionsResult.data || []);
      setBudgets(budgetsResult.data || []);
      setTaxFilings(taxFilingsResult.data || []);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  // Client Invoice operations
  const createClientInvoice = async (invoiceData: ClientInvoiceInsert) => {
    try {
      const { data, error } = await supabase
        .from('client_invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;

      setClientInvoices(prev => [data, ...prev]);
      toast.success('Client invoice created successfully');
      return data;
    } catch (err) {
      console.error('Error creating client invoice:', err);
      toast.error('Failed to create client invoice');
      throw err;
    }
  };

  const updateClientInvoice = async (id: string, updates: Partial<ClientInvoice>) => {
    try {
      const { data, error } = await supabase
        .from('client_invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClientInvoices(prev => prev.map(inv => inv.id === id ? data : inv));
      toast.success('Client invoice updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating client invoice:', err);
      toast.error('Failed to update client invoice');
      throw err;
    }
  };

  // Vendor Invoice operations
  const createVendorInvoice = async (invoiceData: VendorInvoiceInsert) => {
    try {
      const { data, error } = await supabase
        .from('vendor_invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;

      setVendorInvoices(prev => [data, ...prev]);
      toast.success('Vendor invoice created successfully');
      return data;
    } catch (err) {
      console.error('Error creating vendor invoice:', err);
      toast.error('Failed to create vendor invoice');
      throw err;
    }
  };

  const updateVendorInvoice = async (id: string, updates: Partial<VendorInvoice>) => {
    try {
      const { data, error } = await supabase
        .from('vendor_invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVendorInvoices(prev => prev.map(inv => inv.id === id ? data : inv));
      toast.success('Vendor invoice updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating vendor invoice:', err);
      toast.error('Failed to update vendor invoice');
      throw err;
    }
  };

  // Purchase Order operations
  const createPurchaseOrder = async (poData: PurchaseOrderInsert) => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert([poData])
        .select()
        .single();

      if (error) throw error;

      setPurchaseOrders(prev => [data, ...prev]);
      toast.success('Purchase order created successfully');
      return data;
    } catch (err) {
      console.error('Error creating purchase order:', err);
      toast.error('Failed to create purchase order');
      throw err;
    }
  };

  const updatePurchaseOrder = async (id: string, updates: Partial<PurchaseOrder>) => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPurchaseOrders(prev => prev.map(po => po.id === id ? data : po));
      toast.success('Purchase order updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating purchase order:', err);
      toast.error('Failed to update purchase order');
      throw err;
    }
  };

  // Transaction operations
  const createTransaction = async (transactionData: FinancialTransactionInsert) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      toast.success('Transaction created successfully');
      return data;
    } catch (err) {
      console.error('Error creating transaction:', err);
      toast.error('Failed to create transaction');
      throw err;
    }
  };

  // Tax Filing operations
  const createTaxFiling = async (taxData: TaxFilingInsert) => {
    try {
      const { data, error } = await supabase
        .from('tax_filings')
        .insert([taxData])
        .select()
        .single();

      if (error) throw error;

      setTaxFilings(prev => [data, ...prev]);
      toast.success('Tax filing created successfully');
      return data;
    } catch (err) {
      console.error('Error creating tax filing:', err);
      toast.error('Failed to create tax filing');
      throw err;
    }
  };

  const updateTaxFiling = async (id: string, updates: Partial<TaxFiling>) => {
    try {
      const { data, error } = await supabase
        .from('tax_filings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTaxFilings(prev => prev.map(filing => filing.id === id ? data : filing));
      toast.success('Tax filing updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating tax filing:', err);
      toast.error('Failed to update tax filing');
      throw err;
    }
  };

  // Calculate financial summary
  const getFinancialSummary = () => {
    const totalRevenue = clientInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalExpenses = vendorInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const grossProfit = totalRevenue - totalExpenses;
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const outstandingInvoices = clientInvoices
      .filter(inv => inv.status === 'sent')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const overdueInvoices = clientInvoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const accountsReceivable = clientInvoices
      .filter(inv => ['sent', 'overdue'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.amount, 0);

    const accountsPayable = vendorInvoices
      .filter(inv => ['pending', 'approved'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      totalRevenue,
      totalExpenses,
      grossProfit,
      grossProfitMargin,
      netProfit: grossProfit, // Simplified
      netProfitMargin: grossProfitMargin,
      outstandingInvoices,
      overdueInvoices,
      cashOnHand: totalRevenue - totalExpenses, // Simplified
      accountsReceivable,
      accountsPayable,
      period: 'month' as const,
      comparisonPercentage: 0 // TODO: Calculate month-over-month
    };
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  return {
    // Data
    clientInvoices,
    vendorInvoices,
    purchaseOrders,
    transactions,
    budgets,
    taxFilings,
    loading,
    error,
    
    // Operations
    createClientInvoice,
    updateClientInvoice,
    createVendorInvoice,
    updateVendorInvoice,
    createPurchaseOrder,
    updatePurchaseOrder,
    createTransaction,
    createTaxFiling,
    updateTaxFiling,
    
    // Computed values
    getFinancialSummary,
    
    // Utility
    refetch: fetchFinancialData
  };
}