
-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS project_manager TEXT,
ADD COLUMN IF NOT EXISTS rfi_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS delay_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_allocated DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS budget_spent DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0;

-- Create project_team_members table
CREATE TABLE IF NOT EXISTS public.project_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  role TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completion_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_budget_items table
CREATE TABLE IF NOT EXISTS public.project_budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  budgeted_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing projects to have default values for new columns
UPDATE public.projects 
SET 
  client_name = COALESCE(client_name, 'TBD'),
  project_manager = COALESCE(project_manager, 'TBD'),
  rfi_count = COALESCE(rfi_count, 0),
  delay_days = COALESCE(delay_days, 0),
  budget_allocated = COALESCE(budget_allocated, contract_value),
  budget_spent = COALESCE(budget_spent, 0),
  progress_percentage = COALESCE(progress_percentage, 0)
WHERE client_name IS NULL OR project_manager IS NULL OR rfi_count IS NULL OR delay_days IS NULL OR budget_allocated IS NULL OR budget_spent IS NULL OR progress_percentage IS NULL;
