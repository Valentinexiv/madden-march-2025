/**
 * League Teams Import API Endpoint
 * 
 * This endpoint receives team data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/leagueteams
 * Method: POST
 * 
 * Example URL: /api/leagues/ABC/import/leagueteams
 */

import { NextRequest } from 'next/server';
import { validateBody } from '@/lib/validation';
import { LeagueTeamsPayloadSchema } from '@/lib/validators/team-validators';
import { transformMaddenTeams } from '@/lib/transformers/team-transformer';
import { upsertTeams } from '@/lib/db/teams';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';

/**
 * Handler for the league teams import API endpoint
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueSlug: string } }
) {
  const { leagueSlug } = params;

  // Validate request body
  const payload = await validateBody(req, LeagueTeamsPayloadSchema);

  // Find the league in our database using the slug
  const league = await getLeagueBySlug(leagueSlug);
  if (!league) {
    return HttpErrors.notFound(`League not found with slug: ${leagueSlug}`);
  }

  try {
    // Transform the teams data
    const transformedTeams = transformMaddenTeams(payload.leagueTeamInfoList, league.id);

    // Upsert the teams in the database
    const teams = await upsertTeams(transformedTeams);

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    // Return success response
    return successResponse({
      message: 'Teams imported successfully',
      count: teams.length,
    });
  } catch (error) {
    console.error('Error importing teams:', error);
    return HttpErrors.internalServerError('Failed to import teams');
  }
} 