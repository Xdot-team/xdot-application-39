-- Add new fields to utility_conflicts table
ALTER TABLE public.utility_conflicts 
ADD COLUMN utility_name TEXT,
ADD COLUMN utility_project_duration INTEGER,
ADD COLUMN special_requirements TEXT;

-- Add new fields to utility_meetings table  
ALTER TABLE public.utility_meetings
ADD COLUMN utility_owner_company TEXT,
ADD COLUMN utility_contact_info TEXT,
ADD COLUMN meeting_comments TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.utility_conflicts.utility_name IS 'Specific utility company name';
COMMENT ON COLUMN public.utility_conflicts.utility_project_duration IS 'Duration in days for non-concurrent activities';
COMMENT ON COLUMN public.utility_conflicts.special_requirements IS 'Special requirements and comments';

COMMENT ON COLUMN public.utility_meetings.utility_owner_company IS 'Utility owner/company name';
COMMENT ON COLUMN public.utility_meetings.utility_contact_info IS 'Enhanced contact information';
COMMENT ON COLUMN public.utility_meetings.meeting_comments IS 'Meeting-specific comments';