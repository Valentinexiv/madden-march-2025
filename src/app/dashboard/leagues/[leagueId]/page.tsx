'use server';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerUser } from '@/lib/auth/server-auth';
import { getLeagueById } from '@/lib/db/leagues';
import { getLeagueStats } from '@/lib/db/league-stats';
import { LeagueHeader } from '@/components/leagues/league-header';
import { LeagueStatsSummary } from '@/components/leagues/league-stats-summary';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HiInformationCircle, HiRefresh, HiPlus } from 'react-icons/hi';

export default async function LeagueDashboardPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const user = await getServerUser();
  
  if (!user) {
    // This shouldn't happen due to middleware protection, but just in case
    return notFound();
  }
  
  // Get the league details
  const league = await getLeagueById(params.leagueId);
  
  if (!league) {
    return notFound();
  }
  
  // Get league stats
  const stats = await getLeagueStats(params.leagueId);
  
  // Check if there's been an import yet
  const hasImported = !!league.last_import_at;
  
  return (
    <div className="container mx-auto py-6">
      <LeagueHeader league={league} />
      
      {!hasImported && (
        <Alert className="mb-6">
          <HiInformationCircle className="h-4 w-4" />
          <AlertTitle>No data imported yet</AlertTitle>
          <AlertDescription>
            Use the Madden Companion App to export your league data to this dashboard.
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              asChild
            >
              <Link href={`/dashboard/leagues/${league.id}/import`}>
                View import instructions
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>}>
        <LeagueStatsSummary stats={stats} />
      </Suspense>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest happenings in your league</CardDescription>
          </CardHeader>
          <CardContent>
            {hasImported ? (
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">Week advanced to Week {stats.currentWeek}</p>
                  <p className="text-sm text-gray-500">Yesterday at 10:23 PM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">League data imported</p>
                  <p className="text-sm text-gray-500">Yesterday at 10:20 PM</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No activity to display yet.</p>
                <p className="text-sm">Import your league data to see activity here.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={!hasImported}>
              <HiRefresh className="mr-2 h-4 w-4" />
              Refresh Activity
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your league</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href={`/dashboard/leagues/${league.id}/import`}>
                  <HiRefresh className="mr-2 h-4 w-4" />
                  Import League Data
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href={`/dashboard/leagues/${league.id}/teams`}>
                  <HiPlus className="mr-2 h-4 w-4" />
                  View Teams
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href={`/dashboard/leagues/${league.id}/settings`}>
                  <HiPlus className="mr-2 h-4 w-4" />
                  League Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 