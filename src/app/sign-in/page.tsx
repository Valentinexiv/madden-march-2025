import { Metadata } from 'next';
import { DiscordAuthButton } from '@/components/auth/discord-auth-button';
import { Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const metadata: Metadata = {
  title: 'Sign In | Madden March 2025',
  description: 'Sign in to your Madden March 2025 account using Discord',
};

function AuthError({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Check if there's an error parameter
  const error = searchParams.error as string;
  
  if (!error) return null;
  
  let errorMessage = 'An error occurred during authentication.';
  
  // Handle specific error cases
  switch (error) {
    case 'auth_error':
      errorMessage = 'There was a problem checking your authentication. Please try again.';
      break;
    case 'no-session':
      errorMessage = 'No session was found after authentication. Please try again.';
      break;
    case 'session-error':
      errorMessage = 'There was a problem with your session. Please try again.';
      break;
    default:
      errorMessage = `Authentication error: ${error}`;
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}

export default function SignInPage({ searchParams }: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // The redirect path if user is being redirected from a protected route
  const redirectPath = searchParams.redirect as string;
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Sign in to access your Madden leagues and stats
          </p>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <AuthError searchParams={searchParams} />
        </Suspense>
        
        {redirectPath && (
          <Alert className="mb-6">
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>Please sign in to access {redirectPath}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Connect with Discord</h2>
              <p className="text-gray-500 mt-1 text-sm">
                We use Discord for authentication since most Madden leagues are run on Discord
              </p>
            </div>
            
            <DiscordAuthButton className="w-full" />
            
            <div className="text-center text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 text-left text-xs bg-gray-50 border border-gray-200 rounded-md">
            <p className="font-bold mb-2">Debug Information:</p>
            <p>Redirect: {redirectPath || 'None'}</p>
            <p>Error: {searchParams.error || 'None'}</p>
          </div>
        )}
      </div>
    </div>
  );
} 