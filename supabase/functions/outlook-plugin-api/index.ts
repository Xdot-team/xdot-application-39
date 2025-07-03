import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface OutlookPluginRequest {
  action: string;
  data?: any;
  userId?: string;
  projectId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, userId, projectId }: OutlookPluginRequest = await req.json();
    
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Set auth for supabase client
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    let result;

    switch (action) {
      case 'getProjects':
        result = await getProjects();
        break;
      case 'getProjectDetails':
        result = await getProjectDetails(data.projectId);
        break;
      case 'getNotifications':
        result = await getNotifications(user.id);
        break;
      case 'createRFI':
        result = await createRFI(data);
        break;
      case 'createSubmittal':
        result = await createSubmittal(data);
        break;
      case 'createChangeOrder':
        result = await createChangeOrder(data);
        break;
      case 'getDocuments':
        result = await getDocuments(data.projectId);
        break;
      case 'uploadDocument':
        result = await uploadDocument(data);
        break;
      case 'getScheduleEvents':
        result = await getScheduleEvents(data.startDate, data.endDate);
        break;
      case 'createScheduleEvent':
        result = await createScheduleEvent(data);
        break;
      case 'getSafetyIncidents':
        result = await getSafetyIncidents();
        break;
      case 'createSafetyIncident':
        result = await createSafetyIncident(data);
        break;
      case 'getEmployees':
        result = await getEmployees();
        break;
      case 'getFinancialSummary':
        result = await getFinancialSummary(data.projectId);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Outlook Plugin API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// API Functions
async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return { projects: data };
}

async function getProjectDetails(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      rfis:request_for_information(*),
      submittals:submittals(*),
      change_orders:change_orders(*),
      documents:documents(*)
    `)
    .eq('id', projectId)
    .single();
  
  if (error) throw error;
  return { project: data };
}

async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return { notifications: data };
}

async function createRFI(data: any) {
  const { data: rfi, error } = await supabase
    .from('request_for_information')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return { rfi };
}

async function createSubmittal(data: any) {
  const { data: submittal, error } = await supabase
    .from('submittals')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return { submittal };
}

async function createChangeOrder(data: any) {
  const { data: changeOrder, error } = await supabase
    .from('change_orders')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return { changeOrder };
}

async function getDocuments(projectId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .order('uploaded_at', { ascending: false });
  
  if (error) throw error;
  return { documents: data };
}

async function uploadDocument(data: any) {
  // Handle file upload logic here
  const { data: document, error } = await supabase
    .from('documents')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return { document };
}

async function getScheduleEvents(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('schedule_events')
    .select('*')
    .gte('start_date', startDate)
    .lte('end_date', endDate)
    .order('start_date');
  
  if (error) throw error;
  return { events: data };
}

async function createScheduleEvent(data: any) {
  const { data: event, error } = await supabase
    .from('schedule_events')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return { event };
}

async function getSafetyIncidents() {
  const { data, error } = await supabase
    .from('safety_incidents')
    .select('*')
    .order('incident_date', { ascending: false })
    .limit(20);
  
  if (error) throw error;
  return { incidents: data };
}

async function createSafetyIncident(data: any) {
  const { data: incident, error } = await supabase
    .from('safety_incidents')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return { incident };
}

async function getEmployees() {
  const { data, error } = await supabase
    .from('employee_profiles')
    .select('*')
    .eq('status', 'active')
    .order('last_name');
  
  if (error) throw error;
  return { employees: data };
}

async function getFinancialSummary(projectId: string) {
  const { data: budget, error: budgetError } = await supabase
    .from('budgets')
    .select('*')
    .eq('project_id', projectId)
    .single();

  const { data: invoices, error: invoicesError } = await supabase
    .from('client_invoices')
    .select('*')
    .eq('project_id', projectId);

  if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;
  if (invoicesError) throw invoicesError;

  return { budget, invoices };
}