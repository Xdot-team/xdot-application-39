import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OutlookPluginAPI {
  callAPI: (action: string, data?: any) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useOutlookPlugin(): OutlookPluginAPI {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const callAPI = useCallback(async (action: string, data?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('outlook-plugin-api', {
        body: {
          action,
          data,
          userId: session.user.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'API call failed');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    callAPI,
    isLoading,
    error
  };
}