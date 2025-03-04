import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth/server-auth';
import { getLeaguesByUserId, getLeaguesMembershipsByUserId } from '@/lib/db/leagues';
import { PageHeader } from '@/components/layout/page-header';
import { LeagueCard } from '@/components/leagues/league-card';
import { CreateLeagueButton } from '@/components/leagues/create-league-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Trophy, Users } from 'lucide-react';
import { League } from '@/db/schema/leagues';

// Define the membership type
interface LeagueMembership {
  league: League;
  role: string;
}

export default async function LeaguesPage() {
  const user = await getServerUser();
  
  if (!user || !user.id) {
    redirect('/sign-in');
  }
  
  // Get leagues owned by the user
  const ownedLeagues = await getLeaguesByUserId(user.id);
  
  // Get leagues where the user is a member
  const memberLeagues = await getLeaguesMembershipsByUserId(user.id);
  
  // Combine all leagues for the "All" tab
  const allLeagues = [
    ...ownedLeagues.map(league => ({ 
      league, 
      role: 'commissioner' as const 
    })),
    ...memberLeagues.map((membership: LeagueMembership) => ({ 
      league: membership.league, 
      role: membership.role as 'admin' | 'member' 
    }))
  ];
  
  return (
    <div className="container py-6">
      <PageHeader
        title="My Leagues"
        description="Manage your Madden franchise leagues"
      >
        <CreateLeagueButton userId={user.id} />
      </PageHeader>
      
      <div className="mt-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              All Leagues
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {allLeagues.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="owned" className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              My Leagues
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {ownedLeagues.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="member" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Memberships
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {memberLeagues.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {allLeagues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allLeagues.map(({ league, role }) => (
                  <LeagueCard 
                    key={league.id} 
                    league={league} 
                    userRole={role}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Trophy className="h-12 w-12" />}
                title="No leagues found"
                description="You don't have any leagues yet. Create your first league to get started."
                action={<CreateLeagueButton userId={user.id} />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="owned">
            {ownedLeagues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedLeagues.map(league => (
                  <LeagueCard 
                    key={league.id} 
                    league={league} 
                    userRole="commissioner"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Trophy className="h-12 w-12" />}
                title="No leagues found"
                description="You haven't created any leagues yet. Create your first league to get started."
                action={<CreateLeagueButton userId={user.id} />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="member">
            {memberLeagues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberLeagues.map((membership: LeagueMembership) => (
                  <LeagueCard 
                    key={membership.league.id} 
                    league={membership.league} 
                    userRole={membership.role as 'admin' | 'member'}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="h-12 w-12" />}
                title="No memberships found"
                description="You haven't joined any leagues yet. Ask a commissioner to invite you."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 