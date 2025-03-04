/**
 * League Import Base API Endpoint
 * 
 * This endpoint serves as a health check and verification endpoint for the Madden Companion App.
 * Route: /api/leagues/[leagueSlug]/import
 * Method: GET, POST
 * 
 * Example URL: /api/leagues/ABC/import
 */

import { NextRequest } from 'next/server';
import { getLeagueBySlug } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';

/**
 * Handler for GET requests to verify the league exists
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { leagueSlug: string } }
) {
  const { leagueSlug } = params;

  // Find the league in our database using the slug
  const league = await getLeagueBySlug(leagueSlug);
  if (!league) {
    return HttpErrors.notFound(`League not found with slug: ${leagueSlug}`);
  }

  // Return success response with league info
  return successResponse({
    message: 'League found',
    league: {
      name: league.name,
      platform: league.platform,
    },
  });
}

/**
 * Handler for POST requests to verify the league exists
 * This is useful for the Madden Companion App which might send a POST request
 * to verify the endpoint is valid before sending actual data
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueSlug: string } }
) {
  const { leagueSlug } = params;

  // Find the league in our database using the slug
  const league = await getLeagueBySlug(leagueSlug);
  if (!league) {
    return HttpErrors.notFound(`League not found with slug: ${leagueSlug}`);
  }

  // Return success response
  return successResponse({
    message: 'Ready to receive league data',
  });
} 