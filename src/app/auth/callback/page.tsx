'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>('Processing authentication...');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({
    flowStartTime: localStorage.getItem('auth_flow_started') || 'unknown',
    processStartTime: new Date().toISOString()
  });

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      console.log('Auth callback handling started');
      
      // Log all URL parameters for debugging
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });
      console.log('Auth callback URL parameters:', allParams);
      console.log('Full callback URL:', window.location.href);
      setDebugInfo(prev => ({ ...prev, urlParams: allParams, fullUrl: window.location.href }));
      
      try {
        // First check if error was returned in the URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('Error returned from OAuth provider:', error, errorDescription);
          setError(`Authentication error: ${error}: ${errorDescription || 'Unknown error'}`);
          setStatus('Authentication failed');
          setTimeout(() => {
            router.push(`/?error=${error}`);
          }, 2000);
          return;
        }
        
        // Extract the code from URL if present - this confirms we're in the right callback flow
        const code = searchParams.get('code');
        if (!code) {
          console.warn('No auth code found in URL, this might not be the right callback.');
          setDebugInfo(prev => ({ ...prev, warning: 'No auth code in URL' }));
        } else {
          console.log('Auth code found in URL, proceeding with authentication');
          setDebugInfo(prev => ({ ...prev, hasCode: true }));
        }
        
        // With Supabase auth handling, we need to get the session using getSession()
        setStatus('Getting session from Supabase...');
        console.log('Getting session from Supabase...');
        
        // Force a refresh of the session before checking it
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.warn('Session refresh failed, continuing with getSession:', refreshError);
          setDebugInfo(prev => ({ ...prev, refreshError: refreshError.message }));
        } else {
          console.log('Session refreshed successfully:', !!data.session);
          if (data.session) {
            console.log('User authenticated after refresh:', data.session.user.id);
            setDebugInfo(prev => ({ ...prev, refreshedSession: { 
              userId: data.session?.user.id,
              email: data.session?.user.email,
              expiresAt: data.session?.expires_at
            }}));
          }
        }
        
        // Try a second time with getSession()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Debug cookie state
        console.log('Cookies after auth:', document.cookie);
        setDebugInfo(prev => ({ ...prev, 
          cookies: document.cookie,
          hasSession: !!session,
          sessionError: sessionError?.message
        }));
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(`Authentication error: ${sessionError.message}`);
          setStatus('Session retrieval failed');
          setTimeout(() => {
            router.push(`/?error=session-error&message=${encodeURIComponent(sessionError.message)}`);
          }, 2000);
          return;
        }
        
        if (!session) {
          console.error('No session found. This may indicate the OAuth flow was not completed.');
          
          // Try one more approach - explicitly get the auth code from the URL
          // and exchange it for a session
          if (code) {
            setStatus('Attempting to directly process auth code...');
            console.log("No session found, trying to process auth code directly");
            
            // We don't have direct code exchange in the client SDK, so this is informational only
            setDebugInfo(prev => ({ ...prev, directCodeAttempt: true }));
          }
          
          setError('No session found after authentication');
          setStatus('Authentication incomplete');
          setTimeout(() => {
            router.push('/?error=no-session');
          }, 2000);
          return;
        }
        
        setStatus('Successfully authenticated. Processing user data...');
        console.log('Successfully obtained session:', session.user.id);
        
        // Store auth token in localStorage as a backup
        localStorage.setItem('supabase_auth_token', session.access_token);
        localStorage.setItem('supabase_user_id', session.user.id);
        
        // Rest of the authentication handling with your user sync logic
        const userData = {
          id: session.user.id,
          email: session.user.email,
          metadata: session.user.user_metadata
        };
        
        console.log('Auth user data:', JSON.stringify(userData));
        setDebugInfo(prev => ({ ...prev, userData }));
        
        try {
          setStatus('Synchronizing user data...');
          
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ 
              user: {
                id: session.user.id,
                email: session.user.email,
                user_metadata: session.user.user_metadata,
                raw_user_meta_data: session.user.user_metadata,
                app_metadata: session.user.app_metadata,
                identities: session.user.identities
              } 
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error syncing user data:', errorText);
            setStatus('User data sync failed. Redirecting to onboarding...');
            setDebugInfo(prev => ({ ...prev, syncError: errorText }));
            
            // On error, force redirect to onboarding
            setTimeout(() => {
              router.push('/onboarding');
            }, 1000);
            return;
          } else {
            const result = await response.json();
            console.log('Sync user result:', result);
            setDebugInfo(prev => ({ ...prev, syncResult: result }));
            
            // Check if this is a new user
            const isNewUser = result.isNewUser;
            
            if (isNewUser) {
              // Redirect new users to onboarding
              setStatus('New user detected! Redirecting to onboarding...');
              console.log('New user detected! Redirecting to onboarding page...');
              setTimeout(() => {
                // Directly navigate to onboarding without going through middleware
                window.location.href = '/onboarding';
              }, 1000);
            } else {
              // Redirect existing users to dashboard
              setStatus('Existing user detected. Redirecting to dashboard...');
              console.log('Existing user detected. Redirecting to dashboard...');
              
              // Check if there was a redirect param in the original sign-in URL
              const redirectTo = localStorage.getItem('authRedirectUrl') || '/dashboard';
              localStorage.removeItem('authRedirectUrl'); // Clear it after use
              
              setTimeout(() => {
                // Force a hard navigation to ensure cookies are sent
                window.location.href = redirectTo;
              }, 1000);
            }
            return;
          }
        } catch (syncError) {
          console.error('Error calling sync user API:', syncError);
          setStatus('Error synchronizing user data. Redirecting to onboarding...');
          setDebugInfo(prev => ({ ...prev, apiError: syncError instanceof Error ? syncError.message : String(syncError) }));
          
          // Even on error, redirect to onboarding to be safe
          setTimeout(() => {
            window.location.href = '/onboarding';
          }, 1000);
          return;
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError('An unexpected error occurred during authentication');
        setStatus('Authentication failed');
        setDebugInfo(prev => ({ ...prev, fatalError: error instanceof Error ? error.message : String(error) }));
        
        setTimeout(() => {
          router.push('/?error=auth');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="animate-pulse mb-8">
          <div className="h-12 w-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary animate-spin"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">
          {error ? 'Authentication Error' : 'Authenticating...'}
        </h1>
        
        <p className="text-gray-500 mb-4">{status}</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-4">
            {error}
          </div>
        )}
        
        {/* Always show debug info in development to help troubleshoot */}
        <div className="mt-8 p-4 text-left text-xs bg-gray-50 border border-gray-200 rounded-md">
          <p className="font-bold mb-2">Debug Info:</p>
          <pre className="overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 