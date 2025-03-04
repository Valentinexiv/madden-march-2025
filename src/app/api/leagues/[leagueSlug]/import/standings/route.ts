/**
 * League Standings Import API Endpoint
 * 
 * This endpoint receives standings data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/standings
 * Method: POST
 * 
 * Example URL: /api/leagues/ABC/import/standings
 */

import { NextRequest } from 'next/server';
import { validateBody } from '@/lib/validation';
import { LeagueStandingsPayloadSchema } from '@/lib/validators/standings-validators';
import { transformMaddenStandings } from '@/lib/transformers/standings-transformer';
import { upsertStandingsByWeek } from '@/lib/db/standings';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';

/**
 * Handler for the league standings import API endpoint
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueSlug: string } }
) {
  const { leagueSlug } = params;

  // Validate request body
  const payload = await validateBody(req, LeagueStandingsPayloadSchema);

  // Find the league in our database using the slug
  const league = await getLeagueBySlug(leagueSlug);
  if (!league) {
    return HttpErrors.notFound(`League not found with slug: ${leagueSlug}`);
  }

  try {
    // Get the week and season from the first standing (they should all be the same)
    const firstStanding = payload.teamStandingInfoList[0];
    if (!firstStanding) {
      return HttpErrors.badRequest('No standings data provided');
    }

    const weekIndex = firstStanding.weekIndex;
    const seasonIndex = firstStanding.seasonIndex;

    if (weekIndex === null || seasonIndex === null) {
      return HttpErrors.badRequest('Week or season index is missing from standings data');
    }

    // Transform the standings data
    const transformedStandings = transformMaddenStandings(payload.teamStandingInfoList, league.id);

    // Upsert the standings in the database
    const standings = await upsertStandingsByWeek(
      transformedStandings,
      league.id,
      weekIndex,
      seasonIndex
    );

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    // Return success response
    return successResponse({
      message: 'Standings imported successfully',
      count: standings.length,
      week: weekIndex,
      season: seasonIndex,
    });
  } catch (error) {
    console.error('Error importing standings:', error);
    return HttpErrors.internalServerError('Failed to import standings');
  }
} 