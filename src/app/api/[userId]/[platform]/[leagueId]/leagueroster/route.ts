/**
 * League Roster API Endpoint
 * 
 * This endpoint receives roster data from the Madden Companion App
 * and stores it in the database across multiple tables.
 */

import { NextRequest, NextResponse } from 'next/server';
import { LeagueRosterPayloadSchema } from '@/lib/validators/roster-validators';
import { transformMaddenRoster } from '@/lib/transformers/roster-transformer';
import { getTeamIdMapping, upsertRoster, getLeagueById } from '@/lib/db/roster-operations';

// Simple error handling wrapper
const withErrorHandling = (handler: Function) => async (req: NextRequest, params: any) => {
  try {
    return await handler(req, params);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: (error as Error).message },
      { status: 500 }
    );
  }
};

// HTTP Error responses
const HttpErrors = {
  badRequest: (message = 'Bad Request') => 
    NextResponse.json({ error: 'Bad Request', message }, { status: 400 }),
  
  unauthorized: (message = 'Unauthorized') => 
    NextResponse.json({ error: 'Unauthorized', message }, { status: 401 }),
  
  forbidden: (message = 'Forbidden') => 
    NextResponse.json({ error: 'Forbidden', message }, { status: 403 }),
  
  notFound: (message = 'Not Found') => 
    NextResponse.json({ error: 'Not Found', message }, { status: 404 }),
  
  methodNotAllowed: (allowedMethods: string[] = []) => 
    NextResponse.json(
      { error: 'Method Not Allowed', message: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}` },
      { 
        status: 405,
        headers: { 'Allow': allowedMethods.join(', ') }
      }
    ),
  
  internalServerError: (message = 'Internal Server Error') => 
    NextResponse.json({ error: 'Internal Server Error', message }, { status: 500 }),
};

/**
 * POST handler for the league roster endpoint
 * 
 * @param req - The incoming request
 * @param params - The route parameters
 * @returns A response indicating success or failure
 */
async function handlePOST(
  req: NextRequest,
  { params }: { params: { userId: string; platform: string; leagueId: string } }
) {
  // Validate route parameters
  const { userId, platform, leagueId } = params;
  
  if (!userId || !platform || !leagueId) {
    return HttpErrors.badRequest('Missing required route parameters');
  }
  
  // Get the league to verify it exists and belongs to the user
  const league = await getLeagueById(leagueId);
  
  if (!league) {
    return HttpErrors.notFound('League not found');
  }
  
  if (league.user_id !== userId) {
    return HttpErrors.forbidden('You do not have permission to access this league');
  }
  
  // Parse and validate the request body
  const body = await req.json();
  
  const validationResult = LeagueRosterPayloadSchema.safeParse(body);
  
  if (!validationResult.success) {
    return HttpErrors.badRequest('Invalid roster data format');
  }
  
  const { rosterInfoList } = validationResult.data;
  
  // Get the mapping of Madden team IDs to our database team UUIDs
  const teamIdMap = await getTeamIdMapping(leagueId);
  
  // Transform the roster data
  const transformedData = transformMaddenRoster(rosterInfoList, leagueId, teamIdMap);
  
  // Store the data in the database
  await upsertRoster(
    transformedData.players,
    transformedData.traits,
    transformedData.ratings,
    transformedData.abilities
  );
  
  // Return a success response
  return NextResponse.json({
    success: true,
    message: 'Roster data processed successfully',
    count: rosterInfoList.length,
  });
}

/**
 * GET handler for the league roster endpoint
 * 
 * @returns A method not allowed error
 */
function handleGET() {
  return HttpErrors.methodNotAllowed(['POST']);
}

/**
 * PUT handler for the league roster endpoint
 * 
 * @returns A method not allowed error
 */
function handlePUT() {
  return HttpErrors.methodNotAllowed(['POST']);
}

/**
 * DELETE handler for the league roster endpoint
 * 
 * @returns A method not allowed error
 */
function handleDELETE() {
  return HttpErrors.methodNotAllowed(['POST']);
}

/**
 * PATCH handler for the league roster endpoint
 * 
 * @returns A method not allowed error
 */
function handlePATCH() {
  return HttpErrors.methodNotAllowed(['POST']);
}

// Export the handlers with error handling
export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
export const PUT = withErrorHandling(handlePUT);
export const DELETE = withErrorHandling(handleDELETE);
export const PATCH = withErrorHandling(handlePATCH); 