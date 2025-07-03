-- Finance Module Tables

-- Client Invoices
CREATE TABLE public.client_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES public.projects(id),
  client_name TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor Invoices
CREATE TABLE public.vendor_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'disputed')),
  approval_date DATE,
  payment_date DATE,
  po_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase Orders
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  vendor_name TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  total_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'received', 'cancelled')),
  approved_by TEXT,
  approved_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase Order Items
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'partial', 'complete')),
  received_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Financial Transactions
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  account_name TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'reconciled', 'void')),
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Budgets
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id),
  total_budget DECIMAL(15,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Budget Categories
CREATE TABLE public.budget_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budgeted_amount DECIMAL(15,2) NOT NULL,
  spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Financial Reports
CREATE TABLE public.financial_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income_statement', 'balance_sheet', 'cash_flow', 'wip', 'custom', 'profit_loss', 'ar_aging', 'ap_aging', 'job_cost', 'tax')),
  period TEXT NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  generated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  created_by TEXT,
  format TEXT DEFAULT 'pdf' CHECK (format IN ('pdf', 'xlsx', 'csv', 'excel'))
);

-- Cash Flow
CREATE TABLE public.cash_flow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  inflows DECIMAL(15,2) NOT NULL DEFAULT 0,
  outflows DECIMAL(15,2) NOT NULL DEFAULT 0,
  net_cash_flow DECIMAL(15,2) NOT NULL,
  running_balance DECIMAL(15,2) NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tax Filings
CREATE TABLE public.tax_filings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_number TEXT NOT NULL,
  form_name TEXT NOT NULL,
  tax_year TEXT NOT NULL,
  due_date DATE NOT NULL,
  filing_date DATE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'ready_for_review', 'filed')),
  assigned_to TEXT,
  notes TEXT,
  attachment_url TEXT,
  amount DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estimating Module Tables

-- Estimates
CREATE TABLE public.estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_number TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES public.projects(id),
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  total_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  notes TEXT,
  template_id UUID,
  is_template BOOLEAN DEFAULT false,
  current_version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estimate Items
CREATE TABLE public.estimate_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'ea',
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('material', 'labor', 'equipment', 'subcontractor', 'overhead')),
  formula TEXT,
  takeoff_reference TEXT,
  vendor_name TEXT,
  cost_code TEXT,
  markup_percentage DECIMAL(5,2),
  production_rate DECIMAL(10,2),
  parent_id UUID REFERENCES public.estimate_items(id),
  created_by TEXT,
  modified_by TEXT,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estimate Versions
CREATE TABLE public.estimate_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  created_by TEXT NOT NULL,
  notes TEXT,
  total_cost DECIMAL(15,2) NOT NULL,
  is_baseline BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor Bids
CREATE TABLE public.vendor_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  bid_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE,
  contact_info TEXT,
  notes TEXT,
  files TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor Bid Items
CREATE TABLE public.vendor_bid_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bid_id UUID NOT NULL REFERENCES public.vendor_bids(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Communication Logs
CREATE TABLE public.communication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bid_id UUID NOT NULL REFERENCES public.vendor_bids(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  contact_name TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('email', 'phone', 'meeting', 'other')),
  summary TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Takeoff Measurements
CREATE TABLE public.takeoff_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  drawing_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('length', 'area', 'count', 'volume')),
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  coordinates TEXT, -- JSON string of coordinates
  linked_item_id UUID REFERENCES public.estimate_items(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estimate Templates
CREATE TABLE public.estimate_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_by TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estimate Template Items
CREATE TABLE public.estimate_template_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.estimate_templates(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('material', 'labor', 'equipment', 'subcontractor', 'overhead')),
  unit TEXT,
  formula TEXT,
  notes TEXT,
  parent_id UUID REFERENCES public.estimate_template_items(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Material Costs Database
CREATE TABLE public.material_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  region TEXT,
  supplier TEXT,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Labor Rates
CREATE TABLE public.labor_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trade TEXT NOT NULL,
  classification TEXT NOT NULL,
  base_rate DECIMAL(8,2) NOT NULL,
  overtime_rate DECIMAL(8,2),
  region TEXT,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site Visit Reports
CREATE TABLE public.site_visit_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID REFERENCES public.estimates(id),
  project_id UUID REFERENCES public.projects(id),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visited_by TEXT NOT NULL,
  duration_hours DECIMAL(4,2),
  weather_conditions TEXT,
  site_conditions TEXT,
  access_notes TEXT,
  measurements JSONB DEFAULT '{}',
  photos TEXT[],
  recommendations TEXT,
  risks_identified TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Buyout Packages
CREATE TABLE public.buyout_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  description TEXT,
  scope TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'awarded')),
  vendor_name TEXT,
  vendor_contact TEXT,
  amount DECIMAL(15,2) NOT NULL,
  original_estimate DECIMAL(15,2) NOT NULL,
  variance DECIMAL(15,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  award_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estimate Collaborators (for real-time editing)
CREATE TABLE public.estimate_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'editor', 'approver', 'owner')),
  last_active TIMESTAMP WITH TIME ZONE,
  active_section TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.takeoff_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyout_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_collaborators ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables (allowing all operations for now)
CREATE POLICY "Allow all operations on client_invoices" ON public.client_invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vendor_invoices" ON public.vendor_invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on purchase_orders" ON public.purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on purchase_order_items" ON public.purchase_order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on financial_transactions" ON public.financial_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on budgets" ON public.budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on budget_categories" ON public.budget_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on financial_reports" ON public.financial_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cash_flow" ON public.cash_flow FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tax_filings" ON public.tax_filings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on estimates" ON public.estimates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on estimate_items" ON public.estimate_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on estimate_versions" ON public.estimate_versions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vendor_bids" ON public.vendor_bids FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vendor_bid_items" ON public.vendor_bid_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on communication_logs" ON public.communication_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on takeoff_measurements" ON public.takeoff_measurements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on estimate_templates" ON public.estimate_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on estimate_template_items" ON public.estimate_template_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on material_costs" ON public.material_costs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on labor_rates" ON public.labor_rates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on site_visit_reports" ON public.site_visit_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on buyout_packages" ON public.buyout_packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on estimate_collaborators" ON public.estimate_collaborators FOR ALL USING (true) WITH CHECK (true);

-- Add update triggers
CREATE TRIGGER update_client_invoices_updated_at BEFORE UPDATE ON public.client_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_invoices_updated_at BEFORE UPDATE ON public.vendor_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tax_filings_updated_at BEFORE UPDATE ON public.tax_filings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON public.estimates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estimate_items_updated_at BEFORE UPDATE ON public.estimate_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_bids_updated_at BEFORE UPDATE ON public.vendor_bids FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estimate_templates_updated_at BEFORE UPDATE ON public.estimate_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_material_costs_updated_at BEFORE UPDATE ON public.material_costs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_labor_rates_updated_at BEFORE UPDATE ON public.labor_rates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_visit_reports_updated_at BEFORE UPDATE ON public.site_visit_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buyout_packages_updated_at BEFORE UPDATE ON public.buyout_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();