import { notFound, redirect } from 'next/navigation';
import { LeagueSettings } from '@/components/leagues/league-settings';
import { PageHeader } from '@/components/layout/page-header';
import { getLeagueById, userHasLeagueAccess } from '@/lib/db/leagues';
import { getServerUser } from '@/lib/auth/server-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LeagueSettingsPageProps {
  params: {
    leagueId: string;
  };
}

export default async function LeagueSettingsPage({ params }: LeagueSettingsPageProps) {
  const user = await getServerUser();
  
  if (!user || !user.id) {
    redirect('/sign-in');
  }
  
  const { leagueId } = params;
  const league = await getLeagueById(leagueId);
  
  if (!league) {
    notFound();
  }
  
  // Check if user has access to this league
  const hasAccess = await userHasLeagueAccess(user.id, leagueId);
  
  if (!hasAccess) {
    // If user doesn't have access, redirect to league page
    redirect(`/dashboard/leagues/${leagueId}`);
  }
  
  // For now, we'll use placeholder data for the user's team and Discord info
  // In a real implementation, you would fetch this data from your database
  const userTeam = null; // Placeholder for user's team data
  const discordInfo = null; // Placeholder for Discord info
  
  return (
    <div className="container py-6 max-w-5xl">
      <PageHeader
        title={`${league.name} Settings`}
        description="Manage your league settings and configuration"
      >
        <Link href={`/dashboard/leagues/${leagueId}`} passHref>
          <Button variant="outline">Back to League</Button>
        </Link>
      </PageHeader>
      
      <div className="mt-8">
        <LeagueSettings 
          league={league} 
          userId={user.id} 
          userTeam={userTeam}
          discordInfo={discordInfo}
        />
      </div>
    </div>
  );
} 