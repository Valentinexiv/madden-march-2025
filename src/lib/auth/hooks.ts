'use client';

import { useState } from 'react';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';

// Hook for handling sign in
export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (email: string, password: string, redirectTo: string = '/dashboard') => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      // Redirect on successful sign in
      router.push(redirectTo);
      return true;
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSignIn,
  };
}

// Hook for handling sign up
export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error, user } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      // Set success state if sign up was successful
      setSuccess(true);
      return true;
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    handleSignUp,
  };
}

// Hook for handling sign out
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async (redirectTo: string = '/sign-in') => {
    setIsLoading(true);

    try {
      await signOut();
      // Redirect after sign out
      router.push(redirectTo);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignOut,
  };
}

// Hook for handling password reset
export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      // Set success state if password reset email was sent
      setSuccess(true);
      return true;
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    handleResetPassword,
  };
}

// Hook for checking if user is authenticated
export function useRequireAuth(redirectTo: string = '/sign-in') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isLoading && !user) {
    router.push(redirectTo);
  }

  return { user, isLoading };
} 