
-- Add the missing description column to the documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS description TEXT;
