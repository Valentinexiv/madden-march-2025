/**
 * League Teams API Endpoint
 * 
 * This endpoint receives team data from the Madden Companion App and stores it in the database.
 * Route: /api/[userId]/[platform]/[leagueId]/leagueteams
 * Method: POST
 */

import { NextRequest } from 'next/server';
import { validateBody, validateParams } from '@/lib/validation';
import { LeagueTeamsPayloadSchema, LeagueTeamsParamsSchema } from '@/lib/validators/team-validators';
import { transformMaddenTeams } from '@/lib/transformers/team-transformer';
import { upsertTeams } from '@/lib/db/teams';
import { getLeagueById, updateLeagueLastImport, userHasLeagueAccess } from '@/lib/db/leagues';
import { ApiMiddleware } from '@/lib/api/middleware';
import { HttpErrors, successResponse } from '@/lib/api-response';

/**
 * Handler for the league teams API endpoint
 */
async function handler(req: NextRequest) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return HttpErrors.methodNotAllowed(['POST']);
  }

  // Validate route parameters
  const params = validateParams(
    {
      userId: req.nextUrl.pathname.split('/')[2],
      platform: req.nextUrl.pathname.split('/')[3],
      leagueId: req.nextUrl.pathname.split('/')[4],
    },
    LeagueTeamsParamsSchema
  );

  // Validate request body
  const payload = await validateBody(req, LeagueTeamsPayloadSchema);

  // Check if league exists
  const league = await getLeagueById(params.leagueId);
  if (!league) {
    return HttpErrors.notFound('League not found');
  }

  // Check if user has access to the league
  const hasAccess = await userHasLeagueAccess(params.userId, params.leagueId);
  if (!hasAccess) {
    return HttpErrors.forbidden('You do not have access to this league');
  }

  try {
    // Transform the teams data
    const transformedTeams = transformMaddenTeams(payload.leagueTeamInfoList, params.leagueId);

    // Upsert the teams in the database
    const teams = await upsertTeams(transformedTeams);

    // Update the last import timestamp for the league
    await updateLeagueLastImport(params.leagueId);

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

// Export the handler with middleware
export const POST = ApiMiddleware.authenticated(handler); 