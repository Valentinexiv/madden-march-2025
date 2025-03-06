/**
 * Weekly Rushing Stats Import API Endpoint (Madden Companion App Format)
 * 
 * This endpoint receives weekly rushing stats data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/[platform]/[leagueId]/week/[seasonType]/[weekNumber]/rushing
 * Method: POST
 * 
 * Example URL: /api/leagues/test2/import/xbsx/6247678/week/reg/1/rushing
 */

import { NextRequest } from 'next/server';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';
import { transformMaddenRushingStats } from '@/lib/transformers/weekly-stats-transformer';
import { upsertRushingStatsByWeek } from '@/lib/db/weekly-stats';

/**
 * Handler for the weekly rushing stats import API endpoint
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { 
    leagueSlug: string, 
    platform: string, 
    leagueId: string,
    seasonType: string,
    weekNumber: string
  } }
) {
  const { leagueSlug, platform, leagueId, seasonType, weekNumber } = params;
  
  console.log(`Received rushing stats data for ${leagueSlug} (${platform}/${leagueId}) - ${seasonType} week ${weekNumber}`);

  // Convert seasonType to a numeric index
  const seasonIndex = seasonType === 'reg' ? 1 : seasonType === 'post' ? 2 : 0;
  
  // Convert weekNumber to a number
  const week = parseInt(weekNumber, 10);
  if (isNaN(week)) {
    console.error(`Invalid week number: ${weekNumber}`);
    return HttpErrors.badRequest('Invalid week number');
  }

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
    let rushingStatsData;
    if (payload.playerRushingStatInfoList && Array.isArray(payload.playerRushingStatInfoList)) {
      rushingStatsData = payload.playerRushingStatInfoList;
    } else if (Array.isArray(payload)) {
      rushingStatsData = payload;
    } else {
      console.error('Invalid payload format - cannot find rushing stats data array');
      console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
      return HttpErrors.badRequest('Invalid payload format - cannot find rushing stats data array');
    }
    
    console.log(`Processing ${rushingStatsData.length} rushing stats records`);
    
    // Add week and season info to each stat
    const statsWithWeekInfo = rushingStatsData.map((stat: any) => ({
      ...stat,
      weekIndex: week,
      seasonIndex: seasonIndex,
      stageIndex: seasonIndex
    }));
    
    // Transform the rushing stats data
    const transformedRushingStats = transformMaddenRushingStats(statsWithWeekInfo, league.id);

    // Upsert the rushing stats in the database
    const rushingStats = await upsertRushingStatsByWeek(
      transformedRushingStats,
      league.id,
      week,
      seasonIndex
    );

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    console.log(`Successfully imported ${rushingStats.length} rushing stats records`);
    
    // Return success response
    return successResponse({
      message: 'Rushing stats imported successfully',
      count: rushingStats.length,
      seasonType,
      week
    });
  } catch (error) {
    console.error('Error importing rushing stats:', error);
    return HttpErrors.internalServerError('Failed to import rushing stats');
  }
}

/**
 * Handler for GET requests (for testing)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { 
    leagueSlug: string, 
    platform: string, 
    leagueId: string,
    seasonType: string,
    weekNumber: string
  } }
) {
  return successResponse({
    message: 'Ready to receive rushing stats data',
    params
  });
}
