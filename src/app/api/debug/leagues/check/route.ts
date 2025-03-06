import { NextRequest } from 'next/server';
import { getLeagueBySlug } from '@/lib/db/leagues';
import { successResponse, HttpErrors } from '@/lib/api-response';

/**
 * Debug endpoint to check if a league exists in the database
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  
  if (!slug) {
    return HttpErrors.badRequest('League slug is required');
  }
  
  try {
    // Check if the league exists
    const league = await getLeagueBySlug(slug);
    
    if (!league) {
      return HttpErrors.notFound(`League with slug "${slug}" not found`);
    }
    
    // Return the league data
    return successResponse({
      message: `League "${slug}" found`,
      league: {
        id: league.id,
        name: league.name,
        league_identifier: league.league_identifier,
        platform: league.platform,
        last_import_at: league.last_import_at,
        created_at: league.created_at,
      }
    });
  } catch (error) {
    console.error('Error checking league:', error);
    return HttpErrors.internalServerError('Failed to check league');
  }
}