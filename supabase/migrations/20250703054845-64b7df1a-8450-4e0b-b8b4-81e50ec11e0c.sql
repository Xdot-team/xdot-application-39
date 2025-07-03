-- Create comprehensive admin module database schema

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name text,
  email text,
  role text NOT NULL DEFAULT 'user',
  department text,
  phone text,
  avatar_url text,
  status text NOT NULL DEFAULT 'active',
  last_login timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  tags text[] DEFAULT '{}',
  likes text[] DEFAULT '{}', -- Array of user IDs who liked
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  parent_id uuid REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  likes text[] DEFAULT '{}', -- Array of user IDs who liked
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Head office tasks table
CREATE TABLE IF NOT EXISTS public.head_office_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_name text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date date,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Front desk logs table
CREATE TABLE IF NOT EXISTS public.front_desk_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('visitor', 'delivery', 'pickup', 'other')),
  visitor_name text,
  company text,
  contact_person text,
  purpose text,
  delivery_company text,
  package_description text,
  recipient_name text,
  checked_in boolean NOT NULL DEFAULT true,
  checked_out timestamp with time zone,
  notes text,
  logged_by_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_by_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Employee appreciations table
CREATE TABLE IF NOT EXISTS public.employee_appreciations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'exceptional_work' CHECK (category IN ('exceptional_work', 'teamwork', 'innovation', 'safety', 'customer_service')),
  public boolean NOT NULL DEFAULT true,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- System settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('api', 'email', 'security', 'general', 'notifications')),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Kickoff meetings table
CREATE TABLE IF NOT EXISTS public.kickoff_meetings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid,
  project_name text NOT NULL,
  title text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'postponed')),
  minutes text,
  documents text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Meeting attendees table
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id uuid REFERENCES public.kickoff_meetings(id) ON DELETE CASCADE,
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL,
  attendance text DEFAULT 'confirmed' CHECK (attendance IN ('confirmed', 'tentative', 'declined', 'attended', 'no-show')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Agenda items table
CREATE TABLE IF NOT EXISTS public.agenda_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id uuid REFERENCES public.kickoff_meetings(id) ON DELETE CASCADE,
  topic text NOT NULL,
  description text,
  duration integer, -- in minutes
  presenter text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Action items table
CREATE TABLE IF NOT EXISTS public.action_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id uuid REFERENCES public.kickoff_meetings(id) ON DELETE CASCADE,
  description text NOT NULL,
  assigned_to text NOT NULL,
  due_date date NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  comments text,
  completed_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- API configurations table
CREATE TABLE IF NOT EXISTS public.api_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  api_key text,
  endpoint_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'testing')),
  last_tested timestamp with time zone,
  test_results jsonb DEFAULT '{}',
  configuration jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.head_office_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.front_desk_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_appreciations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kickoff_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for forum_posts
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for forum_replies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for head_office_tasks (admin only for now)
CREATE POLICY "Allow all operations on head_office_tasks" ON public.head_office_tasks FOR ALL USING (true);

-- Create RLS policies for front_desk_logs
CREATE POLICY "Allow all operations on front_desk_logs" ON public.front_desk_logs FOR ALL USING (true);

-- Create RLS policies for employee_appreciations
CREATE POLICY "Anyone can view public appreciations" ON public.employee_appreciations FOR SELECT USING (public = true);
CREATE POLICY "Users can view appreciations they sent or received" ON public.employee_appreciations FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Authenticated users can create appreciations" ON public.employee_appreciations FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own appreciations" ON public.employee_appreciations FOR UPDATE USING (auth.uid() = sender_id);

-- Create RLS policies for system_settings (admin only for now)
CREATE POLICY "Allow all operations on system_settings" ON public.system_settings FOR ALL USING (true);

-- Create RLS policies for kickoff_meetings
CREATE POLICY "Allow all operations on kickoff_meetings" ON public.kickoff_meetings FOR ALL USING (true);

-- Create RLS policies for meeting_attendees
CREATE POLICY "Allow all operations on meeting_attendees" ON public.meeting_attendees FOR ALL USING (true);

-- Create RLS policies for agenda_items
CREATE POLICY "Allow all operations on agenda_items" ON public.agenda_items FOR ALL USING (true);

-- Create RLS policies for action_items
CREATE POLICY "Allow all operations on action_items" ON public.action_items FOR ALL USING (true);

-- Create RLS policies for api_configurations (admin only for now)
CREATE POLICY "Allow all operations on api_configurations" ON public.api_configurations FOR ALL USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_head_office_tasks_updated_at BEFORE UPDATE ON public.head_office_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kickoff_meetings_updated_at BEFORE UPDATE ON public.kickoff_meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON public.action_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_configurations_updated_at BEFORE UPDATE ON public.api_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();