'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push('/sign-in');
    }
  }, [isMounted, isLoading, user, router]);

  // Show loading state while checking authentication
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null (will be redirected by the effect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar className="" />
        
        {/* Main content with padding for sidebar */}
        <main className="flex-1 md:ml-72">
          <div className="container mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 