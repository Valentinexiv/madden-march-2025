/**
 * League Teams Import API Endpoint (Madden Companion App Format)
 * 
 * This endpoint receives team data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/[platform]/[leagueId]/leagueteams
 * Method: POST
 * 
 * Example URL: /api/leagues/test2/import/xbsx/6247678/leagueteams
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
  { params }: { params: { leagueSlug: string, platform: string, leagueId: string } }
) {
  const { leagueSlug, platform, leagueId } = params;
  
  console.log(`Received league teams data for ${leagueSlug} (${platform}/${leagueId})`);

  // Try to parse the body to JSON
  let payload;
  try {
    payload = await req.json();
    console.log('Successfully parsed request body as JSON');
  } catch (error) {
    console.error('Error parsing request body:', error);
    return HttpErrors.badRequest('Invalid request body format');
  }

  // Find the league in our database using the slug
  const league = await getLeagueBySlug(leagueSlug);
  if (!league) {
    console.error(`League not found with slug: ${leagueSlug}`);
    return HttpErrors.notFound(`League not found with slug: ${leagueSlug}`);
  }

  try {
    // Check if payload has leagueTeamInfoList and it's an array
    if (!payload.leagueTeamInfoList || !Array.isArray(payload.leagueTeamInfoList)) {
      console.error('Invalid payload format - leagueTeamInfoList is missing or not an array');
      console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
      return HttpErrors.badRequest('Invalid payload format - leagueTeamInfoList is missing or not an array');
    }
    
    console.log(`Processing ${payload.leagueTeamInfoList.length} teams`);
    
    // Transform the teams data
    const transformedTeams = transformMaddenTeams(payload.leagueTeamInfoList, league.id);

    // Upsert the teams in the database
    const teams = await upsertTeams(transformedTeams);

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    console.log(`Successfully imported ${teams.length} teams`);
    
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

/**
 * Handler for GET requests (for testing)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { leagueSlug: string, platform: string, leagueId: string } }
) {
  return successResponse({
    message: 'Ready to receive league teams data',
    params
  });
}