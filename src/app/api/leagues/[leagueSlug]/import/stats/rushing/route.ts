/**
 * League Rushing Stats Import API Endpoint
 * 
 * This endpoint receives rushing stats data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/stats/rushing
 * Method: POST
 * 
 * Example URL: /api/leagues/ABC/import/stats/rushing
 */

import { NextRequest } from 'next/server';
import { validateBody, validateParams } from '@/lib/validation';
import { RushingStatsPayloadSchema, WeeklyStatsRouteParamsSchema } from '@/lib/validators/weekly-stats-validators';
import { transformMaddenRushingStats } from '@/lib/transformers/weekly-stats-transformer';
import { upsertRushingStatsByWeek } from '@/lib/db/weekly-stats';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';

/**
 * Handler for the league rushing stats import API endpoint
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueSlug: string } }
) {
  try {
    // Validate route parameters
    const { leagueSlug } = validateParams(params, WeeklyStatsRouteParamsSchema);

    // Validate request body
    const payload = await validateBody(req, RushingStatsPayloadSchema);

    // Find the league in our database using the slug
    const league = await getLeagueBySlug(leagueSlug);
    if (!league) {
      return HttpErrors.notFound(`League not found with slug: ${leagueSlug}`);
    }

    // Get the week and season from the first stat (they should all be the same)
    const firstStat = payload.rushingStatInfoList[0];
    if (!firstStat) {
      return HttpErrors.badRequest('No rushing stats data provided');
    }

    const weekIndex = firstStat.weekIndex ?? null;
    const seasonIndex = firstStat.seasonIndex ?? null;

    if (weekIndex === null || seasonIndex === null) {
      return HttpErrors.badRequest('Week or season index is missing from rushing stats data');
    }

    // Transform the rushing stats data
    const transformedStats = transformMaddenRushingStats(payload.rushingStatInfoList, league.id);

    // Upsert the rushing stats in the database
    const stats = await upsertRushingStatsByWeek(
      transformedStats,
      league.id,
      weekIndex,
      seasonIndex
    );

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    // Return success response
    return successResponse({
      message: 'Rushing stats imported successfully',
      count: stats.length,
      week: weekIndex,
      season: seasonIndex,
    });
  } catch (error) {
    console.error('Error importing rushing stats:', error);
    return HttpErrors.internalServerError('Failed to import rushing stats');
  }
}

/**
 * GET handler for the league rushing stats import API endpoint
 */
export async function GET() {
  return HttpErrors.methodNotAllowed(['POST']);
}

/**
 * PUT handler for the league rushing stats import API endpoint
 */
export async function PUT() {
  return HttpErrors.methodNotAllowed(['POST']);
}

/**
 * DELETE handler for the league rushing stats import API endpoint
 */
export async function DELETE() {
  return HttpErrors.methodNotAllowed(['POST']);
}

/**
 * PATCH handler for the league rushing stats import API endpoint
 */
export async function PATCH() {
  return HttpErrors.methodNotAllowed(['POST']);
} 