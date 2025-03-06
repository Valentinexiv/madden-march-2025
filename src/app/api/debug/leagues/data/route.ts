import { NextRequest } from 'next/server';
import { getLeagueBySlug } from '@/lib/db/leagues';
import { getTeamsByLeagueId } from '@/lib/db/teams';
import { successResponse, HttpErrors } from '@/lib/api-response';

/**
 * Helper function to get league data
 */
async function getLeagueData(slug: string) {
  // Check if the league exists
  const league = await getLeagueBySlug(slug);
  
  if (!league) {
    return null;
  }
  
  // Get teams for the league
  const teams = await getTeamsByLeagueId(league.id);
  
  // Return the data summary
  return {
    league: {
      id: league.id,
      name: league.name,
      league_identifier: league.league_identifier,
      last_import_at: league.last_import_at,
    },
    data: {
      teamsCount: teams.length,
      teams: teams.map(t => ({
        id: t.id,
        team_id: t.team_id,
        name: t.name,
        display_name: t.display_name,
        abbr: t.abbr,
      })),
    }
  };
}

/**
 * Debug endpoint to check if data has been imported for a league (GET)
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  
  if (!slug) {
    return HttpErrors.badRequest('League slug is required');
  }
  
  try {
    const leagueData = await getLeagueData(slug);
    
    if (!leagueData) {
      return HttpErrors.notFound(`League with slug "${slug}" not found`);
    }
    
    return successResponse({
      message: `Data for league "${slug}"`,
      ...leagueData
    });
  } catch (error) {
    console.error('Error checking league data:', error);
    return HttpErrors.internalServerError('Failed to check league data');
  }
}

/**
 * Debug endpoint to check if data has been imported for a league (POST)
 */
export async function POST(req: NextRequest) {
  const { slug } = await req.json().catch(() => ({}));
  
  if (!slug) {
    return HttpErrors.badRequest('League slug is required in the request body');
  }
  
  try {
    const leagueData = await getLeagueData(slug);
    
    if (!leagueData) {
      return HttpErrors.notFound(`League with slug "${slug}" not found`);
    }
    
    return successResponse({
      message: `Data for league "${slug}"`,
      ...leagueData
    });
  } catch (error) {
    console.error('Error checking league data:', error);
    return HttpErrors.internalServerError('Failed to check league data');
  }
}