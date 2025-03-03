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
      await signInWithDiscord();
      // Note: The actual redirect is handled by Supabase OAuth flow
    } catch (err) {
      console.error('Error initiating Discord sign in:', err);
    } finally {
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