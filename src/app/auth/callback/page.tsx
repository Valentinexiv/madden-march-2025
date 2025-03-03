'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the code and state from the URL
      const code = searchParams.get('code');
      
      if (code) {
        try {
          // Exchange the code for a session
          await supabase.auth.exchangeCodeForSession(code);
          
          // Redirect to the dashboard or home page
          router.push('/dashboard');
        } catch (error) {
          console.error('Error exchanging code for session:', error);
          router.push('/?error=auth');
        }
      } else {
        // If there's no code, redirect to the home page
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="animate-pulse text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <p className="text-gray-500">Please wait while we authenticate your Discord account.</p>
      </div>
    </div>
  );
} 