/**
 * API Hooks
 * 
 * This file contains React hooks for data fetching using React's built-in fetch API.
 * These hooks provide a consistent way to fetch data from the API with error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../api-response';
import { buildApiUrl } from './routes';

interface ApiError extends Error {
  status?: number;
  details?: any;
}

interface ApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isValidating: boolean;
}

interface ApiHookResult<T> extends ApiState<T> {
  mutate: () => Promise<void>;
}

/**
 * Custom hook for fetching data from the API
 * 
 * @param url - The API endpoint URL
 * @param params - Query parameters
 * @returns API hook result
 */
export function useApi<T>(
  url: string | null,
  params?: Record<string, string | number | boolean>
): ApiHookResult<T> {
  const fullUrl = url ? buildApiUrl(url, params) : null;
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: !!fullUrl,
    isValidating: false,
  });

  const fetchData = useCallback(async () => {
    if (!fullUrl) return;
    
    setState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const response = await fetch(fullUrl);
      const result: ApiResponse<T> = await response.json();
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error?.message || 'An error occurred') as ApiError;
        error.status = response.status;
        error.details = result.error?.details;
        throw error;
      }
      
      setState({
        data: result.data as T,
        error: null,
        isLoading: false,
        isValidating: false,
      });
    } catch (err) {
      const error = err as ApiError;
      setState({
        data: null,
        error,
        isLoading: false,
        isValidating: false,
      });
    }
  }, [fullUrl]);

  useEffect(() => {
    if (fullUrl) {
      fetchData();
    } else {
      setState({
        data: null,
        error: null,
        isLoading: false,
        isValidating: false,
      });
    }
  }, [fullUrl, fetchData]);

  const mutate = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { ...state, mutate };
}

interface MutationState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

interface MutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Custom hook for POST requests
 */
export function useApiPost<T, P = any>(
  url: string | null,
  params?: Record<string, string | number | boolean>,
  options?: MutationOptions
) {
  const fullUrl = url ? buildApiUrl(url, params) : null;
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (data: P) => {
    if (!fullUrl) return null;
    
    setState({ data: null, error: null, isLoading: true });
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error?.message || 'An error occurred') as ApiError;
        error.status = response.status;
        error.details = result.error?.details;
        throw error;
      }
      
      const responseData = result.data as T;
      setState({
        data: responseData,
        error: null,
        isLoading: false,
      });
      
      options?.onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const error = err as ApiError;
      setState({
        data: null,
        error,
        isLoading: false,
      });
      
      options?.onError?.(error);
      return null;
    }
  }, [fullUrl, options]);

  return {
    ...state,
    execute,
  };
}

/**
 * Custom hook for PUT requests
 */
export function useApiPut<T, P = any>(
  url: string | null,
  params?: Record<string, string | number | boolean>,
  options?: MutationOptions
) {
  const fullUrl = url ? buildApiUrl(url, params) : null;
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (data: P) => {
    if (!fullUrl) return null;
    
    setState({ data: null, error: null, isLoading: true });
    
    try {
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error?.message || 'An error occurred') as ApiError;
        error.status = response.status;
        error.details = result.error?.details;
        throw error;
      }
      
      const responseData = result.data as T;
      setState({
        data: responseData,
        error: null,
        isLoading: false,
      });
      
      options?.onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const error = err as ApiError;
      setState({
        data: null,
        error,
        isLoading: false,
      });
      
      options?.onError?.(error);
      return null;
    }
  }, [fullUrl, options]);

  return {
    ...state,
    execute,
  };
}

/**
 * Custom hook for DELETE requests
 */
export function useApiDelete<T>(
  url: string | null,
  params?: Record<string, string | number | boolean>,
  options?: MutationOptions
) {
  const fullUrl = url ? buildApiUrl(url, params) : null;
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async () => {
    if (!fullUrl) return null;
    
    setState({ data: null, error: null, isLoading: true });
    
    try {
      const response = await fetch(fullUrl, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error?.message || 'An error occurred') as ApiError;
        error.status = response.status;
        error.details = result.error?.details;
        throw error;
      }
      
      const responseData = result.data as T;
      setState({
        data: responseData,
        error: null,
        isLoading: false,
      });
      
      options?.onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const error = err as ApiError;
      setState({
        data: null,
        error,
        isLoading: false,
      });
      
      options?.onError?.(error);
      return null;
    }
  }, [fullUrl, options]);

  return {
    ...state,
    execute,
  };
} 