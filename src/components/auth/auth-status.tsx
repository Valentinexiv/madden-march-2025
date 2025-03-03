'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useSignOut } from '@/lib/auth/hooks';

export function AuthStatus() {
  const { user, isLoading } = useAuth();
  const { handleSignOut, isLoading: isSigningOut } = useSignOut();

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <strong>Signed in as:</strong> {user.email}
      </div>
      <button
        onClick={() => handleSignOut()}
        disabled={isSigningOut}
        className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
      >
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  );
} 