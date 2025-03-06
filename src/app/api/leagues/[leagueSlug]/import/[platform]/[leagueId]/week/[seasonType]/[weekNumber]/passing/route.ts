/**
 * Weekly Passing Stats Import API Endpoint (Madden Companion App Format)
 * 
 * This endpoint receives weekly passing stats data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/[platform]/[leagueId]/week/[seasonType]/[weekNumber]/passing
 * Method: POST
 * 
 * Example URL: /api/leagues/test2/import/xbsx/6247678/week/reg/1/passing
 */

import { NextRequest } from 'next/server';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';
import { transformMaddenPassingStats } from '@/lib/transformers/weekly-stats-transformer';
import { upsertPassingStatsByWeek } from '@/lib/db/weekly-stats';

/**
 * Handler for the weekly passing stats import API endpoint
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
  
  console.log(`Received passing stats data for ${leagueSlug} (${platform}/${leagueId}) - ${seasonType} week ${weekNumber}`);

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
    let passingStatsData;
    if (payload.playerPassingStatInfoList && Array.isArray(payload.playerPassingStatInfoList)) {
      passingStatsData = payload.playerPassingStatInfoList;
    } else if (Array.isArray(payload)) {
      passingStatsData = payload;
    } else {
      console.error('Invalid payload format - cannot find passing stats data array');
      console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
      return HttpErrors.badRequest('Invalid payload format - cannot find passing stats data array');
    }
    
    console.log(`Processing ${passingStatsData.length} passing stats records`);
    
    // Add week and season info to each stat
    const statsWithWeekInfo = passingStatsData.map((stat: any) => ({
      ...stat,
      weekIndex: week,
      seasonIndex: seasonIndex,
      stageIndex: seasonIndex
    }));
    
    // Transform the passing stats data - just need to pass the array and leagueId
    const transformedPassingStats = transformMaddenPassingStats(statsWithWeekInfo, league.id);

    // Upsert the passing stats in the database
    const passingStats = await upsertPassingStatsByWeek(
      transformedPassingStats,
      league.id,
      week,
      seasonIndex
    );

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    console.log(`Successfully imported ${passingStats.length} passing stats records`);
    
    // Return success response
    return successResponse({
      message: 'Passing stats imported successfully',
      count: passingStats.length,
      seasonType,
      week
    });
  } catch (error) {
    console.error('Error importing passing stats:', error);
    return HttpErrors.internalServerError('Failed to import passing stats');
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
    message: 'Ready to receive passing stats data',
    params
  });
}