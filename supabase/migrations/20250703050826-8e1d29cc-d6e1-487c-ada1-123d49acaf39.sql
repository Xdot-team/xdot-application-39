-- Create missing tables for comprehensive implementation

-- AI prediction logs table
CREATE TABLE public.ai_prediction_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('risk', 'schedule_delay', 'resource_conflict', 'safety_incident', 'budget_overrun')),
  confidence_score DECIMAL NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  prediction_data JSONB NOT NULL,
  related_entity_type TEXT NOT NULL,
  related_entity_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'validated', 'false_positive', 'resolved')),
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather data table for schedule integration
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  temperature_high DECIMAL,
  temperature_low DECIMAL,
  humidity DECIMAL,
  precipitation DECIMAL DEFAULT 0,
  wind_speed DECIMAL,
  weather_conditions TEXT,
  visibility DECIMAL,
  work_suitability TEXT CHECK (work_suitability IN ('excellent', 'good', 'fair', 'poor', 'unsafe')),
  project_impact TEXT,
  data_source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_prediction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on ai_prediction_logs" ON public.ai_prediction_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on weather_data" ON public.weather_data FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_ai_prediction_logs_updated_at BEFORE UPDATE ON public.ai_prediction_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();