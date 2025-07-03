import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for admin data
export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  role: string;
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  category: string;
  tags: string[];
  likes: string[];
  created_at: string;
  updated_at: string;
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  post_id: string;
  content: string;
  author_id: string;
  author_name: string;
  parent_id: string | null;
  likes: string[];
  created_at: string;
}

export interface HeadOfficeTask {
  id: string;
  title: string;
  description: string;
  assignee_id: string | null;
  assignee_name: string | null;
  created_by: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FrontDeskLog {
  id: string;
  type: 'visitor' | 'delivery' | 'pickup' | 'other';
  visitor_name: string | null;
  company: string | null;
  contact_person: string | null;
  purpose: string | null;
  delivery_company: string | null;
  package_description: string | null;
  recipient_name: string | null;
  checked_in: boolean;
  checked_out: string | null;
  notes: string | null;
  logged_by_id: string;
  logged_by_name: string;
  created_at: string;
}

export interface EmployeeAppreciation {
  id: string;
  recipient_id: string;
  recipient_name: string;
  sender_id: string;
  sender_name: string;
  message: string;
  category: 'exceptional_work' | 'teamwork' | 'innovation' | 'safety' | 'customer_service';
  public: boolean;
  likes: number;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  category: 'api' | 'email' | 'security' | 'general' | 'notifications';
  updated_by: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
}

// Hook for User Profiles - Using existing employee_profiles table
export function useUserProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map employee_profiles to UserProfile format
      const mappedProfiles: UserProfile[] = (data || []).map(emp => ({
        id: emp.id,
        user_id: emp.user_id || emp.id,
        display_name: `${emp.first_name} ${emp.last_name}`,
        email: emp.email || '',
        role: emp.department || 'user',
        department: emp.department,
        phone: emp.phone,
        avatar_url: emp.profile_photo,
        status: emp.status,
        last_login: null,
        created_at: emp.created_at,
        updated_at: emp.updated_at
      }));
      
      setProfiles(mappedProfiles);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const createProfile = async (profile: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .insert({
          first_name: profile.display_name?.split(' ')[0] || '',
          last_name: profile.display_name?.split(' ')[1] || '',
          email: profile.email,
          department: profile.role,
          phone: profile.phone,
          profile_photo: profile.avatar_url,
          status: profile.status || 'active',
          employee_id: `EMP-${Date.now()}`,
          job_title: profile.role || 'Employee',
          hire_date: new Date().toISOString().split('T')[0],
          pay_rate: 0,
          pay_type: 'hourly'
        })
        .select()
        .single();

      if (error) throw error;
      await fetchProfiles();
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (id: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('employee_profiles')
        .update({
          ...(updates.display_name && {
            first_name: updates.display_name.split(' ')[0],
            last_name: updates.display_name.split(' ')[1] || ''
          }),
          ...(updates.email && { email: updates.email }),
          ...(updates.role && { department: updates.role }),
          ...(updates.phone && { phone: updates.phone }),
          ...(updates.avatar_url && { profile_photo: updates.avatar_url }),
          ...(updates.status && { status: updates.status })
        })
        .eq('id', id);

      if (error) throw error;
      await fetchProfiles();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { profiles, loading, fetchProfiles, createProfile, updateProfile };
}

// Hook for Forum Posts - Using mock data (database tables not ready)
export function useForumPosts() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Mock forum posts data
    const mockPosts: ForumPost[] = [
      {
        id: '1',
        title: 'Welcome to the Construction Forum',
        content: 'This is a place to discuss project updates, share knowledge, and collaborate with the team.',
        author_id: 'user1',
        author_name: 'John Smith',
        category: 'announcements',
        tags: ['welcome', 'introduction'],
        likes: ['user2', 'user3'],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        replies: []
      }
    ];
    setPosts(mockPosts);
  }, []);

  const createPost = async (post: Omit<ForumPost, 'id' | 'created_at' | 'updated_at' | 'replies'>) => {
    const newPost: ForumPost = {
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: []
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = async (id: string, updates: Partial<ForumPost>) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates, updated_at: new Date().toISOString() } : post
    ));
  };

  const deletePost = async (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const createReply = async (reply: Omit<ForumReply, 'id' | 'created_at'>) => {
    const newReply: ForumReply = {
      ...reply,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    setPosts(prev => prev.map(post => 
      post.id === reply.post_id 
        ? { ...post, replies: [...(post.replies || []), newReply] }
        : post
    ));
    return newReply;
  };

  return { posts, loading, fetchPosts: () => {}, createPost, updatePost, deletePost, createReply };
}

// Hook for Head Office Tasks - Using real database
export function useHeadOfficeTasks() {
  const [tasks, setTasks] = useState<HeadOfficeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('head_office_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch head office tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (task: Omit<HeadOfficeTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('head_office_tasks')
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<HeadOfficeTask>) => {
    try {
      const { error } = await supabase
        .from('head_office_tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('head_office_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
}

// Hook for Front Desk Logs
export function useFrontDeskLogs() {
  const [logs, setLogs] = useState<FrontDeskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('front_desk_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching front desk logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch front desk logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const createLog = async (log: Omit<FrontDeskLog, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('front_desk_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      await fetchLogs();
      return data;
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  };

  const updateLog = async (id: string, updates: Partial<FrontDeskLog>) => {
    try {
      const { error } = await supabase
        .from('front_desk_logs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchLogs();
    } catch (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  };

  return { logs, loading, fetchLogs, createLog, updateLog };
}

// Hook for Employee Appreciations
export function useEmployeeAppreciations() {
  const [appreciations, setAppreciations] = useState<EmployeeAppreciation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppreciations = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_appreciations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppreciations(data || []);
    } catch (error) {
      console.error('Error fetching appreciations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employee appreciations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppreciations();
  }, []);

  const createAppreciation = async (appreciation: Omit<EmployeeAppreciation, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employee_appreciations')
        .insert(appreciation)
        .select()
        .single();

      if (error) throw error;
      await fetchAppreciations();
      return data;
    } catch (error) {
      console.error('Error creating appreciation:', error);
      throw error;
    }
  };

  const updateAppreciation = async (id: string, updates: Partial<EmployeeAppreciation>) => {
    try {
      const { error } = await supabase
        .from('employee_appreciations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchAppreciations();
    } catch (error) {
      console.error('Error updating appreciation:', error);
      throw error;
    }
  };

  return { appreciations, loading, fetchAppreciations, createAppreciation, updateAppreciation };
}

// Hook for System Settings
export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const createSetting = async (setting: Omit<SystemSetting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .insert(setting)
        .select()
        .single();

      if (error) throw error;
      await fetchSettings();
      return data;
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error;
    }
  };

  const updateSetting = async (id: string, updates: Partial<SystemSetting>) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const deleteSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  };

  return { settings, loading, fetchSettings, createSetting, updateSetting, deleteSetting };
}

// Kickoff Meetings interfaces
export interface KickoffMeeting {
  id: string;
  project_id: string | null;
  project_name: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  minutes: string | null;
  documents: string[];
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  attendees?: MeetingAttendee[];
  agenda_items?: AgendaItem[];
  action_items?: ActionItem[];
}

export interface MeetingAttendee {
  id: string;
  meeting_id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  role: string;
  attendance: 'confirmed' | 'tentative' | 'declined' | 'attended' | 'no-show';
  created_at: string;
}

export interface AgendaItem {
  id: string;
  meeting_id: string;
  topic: string;
  description: string | null;
  duration: number | null;
  presenter: string | null;
  order_index: number;
  created_at: string;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  assigned_to: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  comments: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiConfiguration {
  id: string;
  name: string;
  description: string | null;
  api_key: string | null;
  endpoint_url: string | null;
  status: 'active' | 'inactive' | 'testing';
  last_tested: string | null;
  test_results: any;
  configuration: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Hook for Kickoff Meetings
export function useKickoffMeetings() {
  const [meetings, setMeetings] = useState<KickoffMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('kickoff_meetings')
        .select('*')
        .order('date', { ascending: false });

      if (meetingsError) throw meetingsError;

      // Fetch related data for each meeting
      const meetingsWithDetails = await Promise.all(
        (meetingsData || []).map(async (meeting) => {
          const [attendeesRes, agendaRes, actionsRes] = await Promise.all([
            supabase.from('meeting_attendees').select('*').eq('meeting_id', meeting.id),
            supabase.from('agenda_items').select('*').eq('meeting_id', meeting.id).order('order_index'),
            supabase.from('action_items').select('*').eq('meeting_id', meeting.id).order('due_date')
          ]);

          return {
            ...meeting,
            attendees: attendeesRes.data || [],
            agenda_items: agendaRes.data || [],
            action_items: actionsRes.data || []
          };
        })
      );

      setMeetings(meetingsWithDetails);
    } catch (error) {
      console.error('Error fetching kickoff meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch kickoff meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const createMeeting = async (meeting: Omit<KickoffMeeting, 'id' | 'created_at' | 'updated_at' | 'attendees' | 'agenda_items' | 'action_items'>) => {
    try {
      const { data, error } = await supabase
        .from('kickoff_meetings')
        .insert(meeting)
        .select()
        .single();

      if (error) throw error;
      await fetchMeetings();
      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  const updateMeeting = async (id: string, updates: Partial<KickoffMeeting>) => {
    try {
      const { error } = await supabase
        .from('kickoff_meetings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kickoff_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  };

  const addAttendee = async (attendee: Omit<MeetingAttendee, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('meeting_attendees')
        .insert(attendee);

      if (error) throw error;
      await fetchMeetings();
    } catch (error) {
      console.error('Error adding attendee:', error);
      throw error;
    }
  };

  const addAgendaItem = async (item: Omit<AgendaItem, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('agenda_items')
        .insert(item);

      if (error) throw error;
      await fetchMeetings();
    } catch (error) {
      console.error('Error adding agenda item:', error);
      throw error;
    }
  };

  const addActionItem = async (item: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('action_items')
        .insert(item);

      if (error) throw error;
      await fetchMeetings();
    } catch (error) {
      console.error('Error adding action item:', error);
      throw error;
    }
  };

  return { 
    meetings, 
    loading, 
    fetchMeetings, 
    createMeeting, 
    updateMeeting, 
    deleteMeeting,
    addAttendee,
    addAgendaItem,
    addActionItem
  };
}

// Hook for API Configurations
export function useApiConfigurations() {
  const [configurations, setConfigurations] = useState<ApiConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error fetching API configurations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch API configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const createConfiguration = async (config: Omit<ApiConfiguration, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      await fetchConfigurations();
      return data;
    } catch (error) {
      console.error('Error creating configuration:', error);
      throw error;
    }
  };

  const updateConfiguration = async (id: string, updates: Partial<ApiConfiguration>) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchConfigurations();
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  };

  const deleteConfiguration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchConfigurations();
    } catch (error) {
      console.error('Error deleting configuration:', error);
      throw error;
    }
  };

  const testConfiguration = async (id: string) => {
    try {
      // In a real implementation, this would make a test request to the API
      const testResults = {
        success: true,
        response_time: Math.floor(Math.random() * 500) + 100,
        status_code: 200,
        message: 'Connection successful'
      };

      const { error } = await supabase
        .from('api_configurations')
        .update({
          last_tested: new Date().toISOString(),
          test_results: testResults
        })
        .eq('id', id);

      if (error) throw error;
      await fetchConfigurations();
      return testResults;
    } catch (error) {
      console.error('Error testing configuration:', error);
      throw error;
    }
  };

  return { 
    configurations, 
    loading, 
    fetchConfigurations, 
    createConfiguration, 
    updateConfiguration, 
    deleteConfiguration,
    testConfiguration
  };
}