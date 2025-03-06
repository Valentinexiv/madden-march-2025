/**
 * League Standings Import API Endpoint (Madden Companion App Format)
 * 
 * This endpoint receives standings data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/[platform]/[leagueId]/standings
 * Method: POST
 * 
 * Example URL: /api/leagues/test2/import/xbsx/6247678/standings
 */

import { NextRequest } from 'next/server';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';
import { transformMaddenStandings } from '@/lib/transformers/standings-transformer';
import { upsertStandings } from '@/lib/db/standings';

/**
 * Handler for the league standings import API endpoint
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueSlug: string, platform: string, leagueId: string } }
) {
  const { leagueSlug, platform, leagueId } = params;
  
  console.log(`Received standings data for ${leagueSlug} (${platform}/${leagueId})`);

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
    console.log('Payload structure:', Object.keys(payload));
    
    // Check if payload has the expected structure
    let standingsData;
    if (payload.teamStandingInfoList && Array.isArray(payload.teamStandingInfoList)) {
      standingsData = payload.teamStandingInfoList;
    } else if (Array.isArray(payload)) {
      standingsData = payload;
    } else {
      console.error('Invalid payload format - cannot find standings data array');
      console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
      return HttpErrors.badRequest('Invalid payload format - cannot find standings data array');
    }
    
    console.log(`Processing ${standingsData.length} standings records`);
    
    // Transform the standings data
    const transformedStandings = transformMaddenStandings(standingsData, league.id);

    // Upsert the standings in the database
    const standings = await upsertStandings(transformedStandings);

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    console.log(`Successfully imported standings data`);
    
    // Return success response
    return successResponse({
      message: 'Standings imported successfully',
      count: standings.length,
    });
  } catch (error) {
    console.error('Error importing standings:', error);
    return HttpErrors.internalServerError('Failed to import standings');
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
    message: 'Ready to receive standings data',
    params
  });
}