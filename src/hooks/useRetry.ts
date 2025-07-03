import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number) => void;
  onFailure?: (error: Error) => void;
}

interface RetryState {
  isLoading: boolean;
  attempt: number;
  error: Error | null;
}

export function useRetry<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  options: RetryOptions = {}
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry,
    onFailure
  } = options;

  const [state, setState] = useState<RetryState>({
    isLoading: false,
    attempt: 0,
    error: null
  });

  const execute = useCallback(async (...args: T): Promise<R | null> => {
    setState({ isLoading: true, attempt: 0, error: null });

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setState(prev => ({ ...prev, attempt }));
        const result = await operation(...args);
        setState({ isLoading: false, attempt, error: null });
        return result;
      } catch (error) {
        const err = error as Error;
        
        if (attempt === maxAttempts) {
          setState({ isLoading: false, attempt, error: err });
          onFailure?.(err);
          toast.error(`Operation failed after ${maxAttempts} attempts: ${err.message}`);
          return null;
        }

        // Calculate delay with optional backoff
        const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        
        onRetry?.(attempt);
        toast.warning(`Attempt ${attempt} failed, retrying in ${currentDelay / 1000}s...`);
        
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    return null;
  }, [operation, maxAttempts, delay, backoff, onRetry, onFailure]);

  const reset = useCallback(() => {
    setState({ isLoading: false, attempt: 0, error: null });
  }, []);

  return {
    execute,
    reset,
    ...state
  };
}

// Specialized hook for data fetching with retry
export function useRetryFetch<T>(
  fetcher: () => Promise<T>,
  options: RetryOptions = {}
) {
  return useRetry(fetcher, {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    ...options
  });
}