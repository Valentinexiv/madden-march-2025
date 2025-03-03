'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useSignOut } from '@/lib/auth/hooks';
import { DiscordAuthButton } from './discord-auth-button';
import { Button } from '@/components/ui/button';
import { FaDiscord } from 'react-icons/fa';

export function AuthStatus() {
  const { user, isLoading } = useAuth();
  const { handleSignOut, isLoading: isSigningOut } = useSignOut();

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading authentication status...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Sign in to continue</h2>
        <p className="text-gray-500 mb-4">Connect with Discord to access your Madden leagues</p>
        <DiscordAuthButton />
      </div>
    );
  }

  // Get user details from metadata if available
  const discordUsername = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Discord avatar" className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <FaDiscord className="text-[#5865F2] w-6 h-6" />
          </div>
        )}
        <div>
          <div className="font-medium">{discordUsername}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      
      <Button
        onClick={() => handleSignOut()}
        disabled={isSigningOut}
        className="mt-2 border border-gray-300 hover:bg-gray-100"
      >
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </Button>
    </div>
  );
} 