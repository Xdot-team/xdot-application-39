-- Add RLS policies for utility_conflicts table
CREATE POLICY "Allow all operations on utility_conflicts" 
ON public.utility_conflicts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add RLS policies for utility_meetings table  
CREATE POLICY "Allow all operations on utility_meetings"
ON public.utility_meetings
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable realtime for utility_conflicts
ALTER TABLE public.utility_conflicts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.utility_conflicts;

-- Enable realtime for utility_meetings
ALTER TABLE public.utility_meetings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.utility_meetings;