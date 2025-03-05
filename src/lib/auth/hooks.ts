'use client';

import { useState } from 'react';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';

// Hook for handling Discord sign in
export function useDiscordAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithDiscord } = useAuth();
  const router = useRouter();

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    try {
      // Save the current URL's redirect parameter to localStorage if it exists
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      if (redirectParam) {
        console.log(`Saving redirect URL: ${redirectParam}`);
        localStorage.setItem('authRedirectUrl', redirectParam);
      }

      // Clear any existing error params from the URL before sign in
      if (urlParams.has('error')) {
        console.log('Clearing error parameters before sign in');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('error');
        window.history.replaceState({}, '', newUrl);
      }

      console.log('Initiating Discord sign in');
      await signInWithDiscord();
      // Note: The actual redirect is handled by Supabase OAuth flow
    } catch (err) {
      console.error('Error initiating Discord sign in:', err);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDiscordSignIn,
  };
}

// Hook for handling sign out
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async (redirectTo: string = '/') => {
    setIsLoading(true);

    try {
      console.log('Starting sign out process');
      await signOut();
      
      // Clear any stored auth data
      localStorage.removeItem('authRedirectUrl');
      localStorage.removeItem('supabase_auth_token');
      localStorage.removeItem('supabase_user_id');
      
      console.log(`Redirecting to ${redirectTo} after sign out`);
      
      // Force a full page reload to clear any state
      window.location.href = redirectTo;
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignOut,
  };
}

// Hook for checking if user is authenticated
export function useRequireAuth(redirectTo: string = '/') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isLoading && !user) {
    router.push(redirectTo);
  }

  return { user, isLoading };
} 