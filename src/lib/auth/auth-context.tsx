'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

// Define the shape of the auth context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

// AuthProvider component to wrap the application
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on component mount
  useEffect(() => {
    // Get the initial session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User already authenticated:', session.user.id);
        } else {
          console.log('No authenticated user found');
        }

        // Set up auth state change listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event);
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
          }
        );

        // Clean up the subscription when the component unmounts
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in with Discord OAuth
  const signInWithDiscord = async () => {
    try {
      console.log('Initiating Discord sign in...');
      
      // This is the URL we want the user to end up at after the entire auth flow
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('Final redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: redirectTo,
          scopes: 'identify email guilds',
          // Keep PKCE flow type for security
          flowType: 'pkce',
        },
      });
      
      if (error) {
        console.error('Error initiating Discord sign in:', error);
        throw error;
      }
      
      // This is Supabase's generated sign-in URL that includes the Supabase callback URL
      console.log('Discord sign in initiated, redirecting to Supabase auth URL:', data?.url);
    } catch (error) {
      console.error('Error signing in with Discord:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('Signing out user...');
      await supabase.auth.signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Create the context value
  const value = {
    user,
    session,
    isLoading,
    signInWithDiscord,
    signOut,
  };

  // Provide the auth context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 