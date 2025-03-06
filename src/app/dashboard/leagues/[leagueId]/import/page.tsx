'use server';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerUser } from '@/lib/auth/server-auth';
import { getLeagueById } from '@/lib/db/leagues';
import { LeagueHeader } from '@/components/leagues/league-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  HiInformationCircle,
  HiClipboardCopy,
  HiCheck,
} from 'react-icons/hi';
import Image from 'next/image';

export default async function LeagueImportPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const user = await getServerUser();
  
  if (!user) {
    return notFound();
  }
  
  // Get the league details
  const league = await getLeagueById(params.leagueId);
  
  if (!league) {
    return notFound();
  }

  // The league import URL that users need to enter in the Madden Companion App
  const importUrl = league.import_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/leagues/${league.league_identifier}/import`;
  
  return (
    <div className="container mx-auto py-6">
      <LeagueHeader league={league} />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Import League Data</CardTitle>
            <CardDescription>
              Follow these steps to import your Madden league data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <HiInformationCircle className="h-4 w-4" />
              <AlertTitle>You'll need the Madden Companion App</AlertTitle>
              <AlertDescription>
                Download the official EA Madden Companion App from the App Store or Google Play Store to export your league data.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 1: Open the Madden Companion App</h3>
              <p className="text-sm text-gray-500">
                Launch the Madden Companion App on your mobile device and sign in with your EA account.
              </p>
              
              <div className="aspect-video relative max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">
                  Screenshot of Madden Companion App
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 2: Select Your League</h3>
              <p className="text-sm text-gray-500">
                Choose the league you want to export data from.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 3: Export Data</h3>
              <p className="text-sm text-gray-500">
                Tap on "Export" and then select "Export League Information".
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 4: Enter this Export URL</h3>
              <p className="text-sm text-gray-500">
                Copy and paste this URL into the Madden Companion App:
              </p>
              
              <div className="relative flex items-center p-4 bg-gray-50 rounded-md border">
                <code className="text-sm font-mono flex-1 truncate">{importUrl}</code>
                <button
                  className="ml-2 p-2 hover:bg-gray-200 rounded-md transition-colors"
                  title="Copy to clipboard"
                  onClick={() => navigator.clipboard.writeText(importUrl)}
                >
                  <HiClipboardCopy className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 5: Complete the Export</h3>
              <p className="text-sm text-gray-500">
                Once the URL is entered, tap "Export" and wait for the export to complete. You'll see a success message when it's done.
              </p>
              
              <Alert className="bg-green-50 border-green-200">
                <HiCheck className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800">What happens next?</AlertTitle>
                <AlertDescription className="text-green-700">
                  After export, your league data will be processed automatically. You'll be able to view all your league's teams, players, and statistics on your dashboard.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/leagues/${league.id}`}>
              Back to Dashboard
            </Link>
          </Button>
          
          <Button variant="default" asChild>
            <Link href={`/dashboard/leagues/${league.id}/teams`}>
              View Teams
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 