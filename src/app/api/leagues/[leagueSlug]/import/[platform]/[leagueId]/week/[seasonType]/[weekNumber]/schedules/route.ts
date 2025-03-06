/**
 * Weekly Schedules Import API Endpoint (Madden Companion App Format)
 * 
 * This endpoint receives weekly schedule data from the Madden Companion App and stores it in the database.
 * Route: /api/leagues/[leagueSlug]/import/[platform]/[leagueId]/week/[seasonType]/[weekNumber]/schedules
 * Method: POST
 * 
 * Example URL: /api/leagues/test2/import/xbsx/6247678/week/reg/1/schedules
 */

import { NextRequest } from 'next/server';
import { getLeagueBySlug, updateLeagueLastImport } from '@/lib/db/leagues';
import { HttpErrors, successResponse } from '@/lib/api-response';
import { transformMaddenSchedules } from '@/lib/transformers/schedule-transformer';
import { upsertSchedules } from '@/lib/db/schedules';

/**
 * Handler for the weekly schedules import API endpoint
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
  
  console.log(`Received schedule data for ${leagueSlug} (${platform}/${leagueId}) - ${seasonType} week ${weekNumber}`);

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
    let scheduleData;
    if (payload.gameScheduleInfoList && Array.isArray(payload.gameScheduleInfoList)) {
      scheduleData = payload.gameScheduleInfoList;
    } else if (Array.isArray(payload)) {
      scheduleData = payload;
    } else {
      console.error('Invalid payload format - cannot find schedule data array');
      console.log('Received payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
      return HttpErrors.badRequest('Invalid payload format - cannot find schedule data array');
    }
    
    console.log(`Processing ${scheduleData.length} schedule records`);
    
    // Make sure seasonIndex and weekIndex are consistent with URL parameters
    const scheduleWithConsistentWeek = scheduleData.map((game: any) => ({
      ...game,
      weekIndex: week,           // Ensure weekIndex matches URL param
      seasonIndex: seasonIndex,  // Ensure seasonIndex matches URL param
      stageIndex: seasonIndex    // Ensure stageIndex is consistent
    }));
    
    // Transform the schedule data
    const transformedSchedules = transformMaddenSchedules(scheduleWithConsistentWeek, league.id);

    // Upsert the schedules in the database
    const schedules = await upsertSchedules(transformedSchedules);

    // Update the last import timestamp for the league
    await updateLeagueLastImport(league.id);

    console.log(`Successfully imported ${schedules.length} schedule records`);
    
    // Return success response
    return successResponse({
      message: 'Schedules imported successfully',
      count: schedules.length,
      seasonType,
      week
    });
  } catch (error) {
    console.error('Error importing schedules:', error);
    return HttpErrors.internalServerError('Failed to import schedules');
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
    message: 'Ready to receive schedule data',
    params
  });
}
