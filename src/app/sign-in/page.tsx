import { Metadata } from 'next';
import { DiscordAuthButton } from '@/components/auth/discord-auth-button';

export const metadata: Metadata = {
  title: 'Sign In | Madden March 2025',
  description: 'Sign in to your Madden March 2025 account using Discord',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Sign in to access your Madden leagues and stats
          </p>
        </div>
        
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
      </div>
    </div>
  );
} 