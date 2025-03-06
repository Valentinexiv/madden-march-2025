/**
 * Weekly Receiving Stats Import API Endpoint (Madden Companion App Format)
 * 
 * This endpoint receives weekly receiving stats data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/[platform]/[leagueId]/week/[seasonType]/[weekNumber]/receiving
 * Method: POST
 * 
 * Example URL: /api/leagues/test2/import/xbsx/6247678/week/reg/1/receiving
 */

import { NextRequest } from 'next/server';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';
import { transformMaddenReceivingStats } from '@/lib/transformers/weekly-stats-transformer';
import { upsertReceivingStatsByWeek } from '@/lib/db/weekly-stats';

/**
 * Handler for the weekly receiving stats import API endpoint
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
  
  console.log(`Received receiving stats data for ${leagueSlug} (${platform}/${leagueId}) - ${seasonType} week ${weekNumber}`);

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
    let receivingStatsData;
    if (payload.playerReceivingStatInfoList && Array.isArray(payload.playerReceivingStatInfoList)) {
      receivingStatsData = payload.playerReceivingStatInfoList;
    } else if (Array.isArray(payload)) {
      receivingStatsData = payload;
    } else {
      console.error('Invalid payload format - cannot find receiving stats data array');
      console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
      return HttpErrors.badRequest('Invalid payload format - cannot find receiving stats data array');
    }
    
    console.log(`Processing ${receivingStatsData.length} receiving stats records`);
    
    // Add week and season info to each stat
    const statsWithWeekInfo = receivingStatsData.map((stat: any) => ({
      ...stat,
      weekIndex: week,
      seasonIndex: seasonIndex,
      stageIndex: seasonIndex
    }));
    
    // Transform the receiving stats data
    const transformedReceivingStats = transformMaddenReceivingStats(statsWithWeekInfo, league.id);

    // Upsert the receiving stats in the database
    const receivingStats = await upsertReceivingStatsByWeek(
      transformedReceivingStats,
      league.id,
      week,
      seasonIndex
    );

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    console.log(`Successfully imported ${receivingStats.length} receiving stats records`);
    
    // Return success response
    return successResponse({
      message: 'Receiving stats imported successfully',
      count: receivingStats.length,
      seasonType,
      week
    });
  } catch (error) {
    console.error('Error importing receiving stats:', error);
    return HttpErrors.internalServerError('Failed to import receiving stats');
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
    message: 'Ready to receive receiving stats data',
    params
  });
}
