'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';
import { getServerUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUserLeagues } from '@/lib/actions/league-actions';
import { FaPlus, FaUsers, FaArrowRight } from 'react-icons/fa';

export default async function DashboardPage() {
  const user = await getServerUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Get user's leagues
  const leagues = await getUserLeagues(user.id);
  const hasLeagues = leagues && leagues.length > 0;
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to your Madden March 2025 dashboard</p>
        </div>
      </div>
      
      {!hasLeagues && (
        <Card className="border-dashed border-2 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Get Started with Madden March 2025</CardTitle>
            <CardDescription>
              It looks like you haven't set up any leagues yet. Let's get you started!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Madden March 2025 lets you track and visualize your Madden franchise data. 
              You can create your own league as a commissioner or join an existing league.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/onboarding">
                Go to Onboarding <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard/leagues">
                View League Management
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Your Leagues</CardTitle>
            <CardDescription>
              Manage your Madden leagues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <p className="text-center py-2 text-gray-500">
                {hasLeagues 
                  ? `You have ${leagues.length} league${leagues.length === 1 ? '' : 's'}`
                  : 'No leagues yet'}
              </p>
            </Suspense>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/leagues">
                View Leagues
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Create a League</CardTitle>
            <CardDescription>
              Start a new Madden league
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <FaPlus className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/onboarding?action=create">
                Create League
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Join a League</CardTitle>
            <CardDescription>
              Join an existing Madden league
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <FaUsers className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/onboarding?action=join">
                Join League
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

async function getUserLeagues(userId: string) {
  try {
    const result = await getCurrentUserLeagues(userId);
    if (result.success) {
      return result.leagues || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    return [];
  }
} 