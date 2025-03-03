'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not redirected yet, show a message
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-500">You need to be signed in to view this page.</p>
        </div>
      </div>
    );
  }

  // Get user details from metadata if available
  const discordUsername = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Madden March Dashboard</h1>
          <div className="flex items-center gap-2">
            {avatarUrl && (
              <img src={avatarUrl} alt="Discord avatar" className="w-8 h-8 rounded-full" />
            )}
            <span>{discordUsername}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Your Leagues</h2>
            <p className="text-gray-500">You haven't joined any leagues yet.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create or Join League
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-500">No recent activity to display.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Discord Integration</h2>
            <p className="text-gray-500">Connect your Discord server to enable notifications.</p>
            <button className="mt-4 px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752C4]">
              Connect Discord Server
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-4 text-center text-gray-500">
        <p>© 2025 Madden March. All rights reserved.</p>
      </footer>
    </div>
  );
} 