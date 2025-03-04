'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  LeagueCreateInput, 
  LeagueUpdateInput, 
  LeagueSlugCheckInput,
  LeagueDeleteInput,
  LeagueCreateSchema,
  LeagueUpdateSchema,
  LeagueSlugCheckSchema,
  LeagueDeleteSchema
} from '@/lib/validators/league-validators';
import { 
  createLeague, 
  updateLeague, 
  deleteLeague, 
  isLeagueIdentifierAvailable,
  addLeagueMember,
  getLeagueById
} from '@/lib/db/leagues';
import { deleteLeaguePlayers } from '@/lib/db/roster-operations';
import { transaction } from '@/lib/db/supabase/db-utils';

// Create a Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Check if a league identifier is available
 */
export async function checkLeagueIdentifier(data: LeagueSlugCheckInput) {
  try {
    // Validate the input data
    const validatedData = LeagueSlugCheckSchema.parse(data);
    
    // Check if the identifier is available
    const isAvailable = await isLeagueIdentifierAvailable(validatedData.league_identifier);
    
    return { 
      success: true, 
      available: isAvailable 
    };
  } catch (error) {
    console.error('Error checking league identifier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      available: false
    };
  }
}

/**
 * Create a new league
 */
export async function createNewLeague(userId: string, data: LeagueCreateInput) {
  try {
    // Validate the input data
    const validatedData = LeagueCreateSchema.parse(data);
    
    // Check if the identifier is available
    const isAvailable = await isLeagueIdentifierAvailable(validatedData.league_identifier);
    if (!isAvailable) {
      return { 
        success: false, 
        error: 'League identifier is already taken' 
      };
    }
    
    // Create the league
    const league = await createLeague({
      user_id: userId,
      name: validatedData.name,
      league_identifier: validatedData.league_identifier,
      platform: validatedData.platform,
      madden_league_id: validatedData.madden_league_id || '',
      discord_server_id: validatedData.discord_server_id || null,
      import_url: null,
      last_import_at: null
    });
    
    // Add the user as a commissioner
    await addLeagueMember(league.id, userId, 'commissioner');
    
    // Generate the import URL
    const importUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/leagues/${validatedData.league_identifier}/import`;
    
    // Update the league with the import URL
    await updateLeague(league.id, { import_url: importUrl });
    
    // Revalidate the leagues page
    revalidatePath('/leagues');
    
    return { 
      success: true, 
      league: {
        ...league,
        import_url: importUrl
      }
    };
  } catch (error) {
    console.error('Error creating league:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Update an existing league
 */
export async function updateExistingLeague(userId: string, leagueId: string, data: LeagueUpdateInput) {
  try {
    // Validate the input data
    const validatedData = LeagueUpdateSchema.parse(data);
    
    // Get the league to check ownership
    const league = await getLeagueById(leagueId);
    if (!league) {
      return { 
        success: false, 
        error: 'League not found' 
      };
    }
    
    // Check if the user is the owner of the league
    if (league.user_id !== userId) {
      return { 
        success: false, 
        error: 'You do not have permission to update this league' 
      };
    }
    
    // Update the league
    const updatedLeague = await updateLeague(leagueId, validatedData);
    
    // Revalidate the league pages
    revalidatePath('/leagues');
    revalidatePath(`/leagues/${leagueId}`);
    
    return { 
      success: true, 
      league: updatedLeague 
    };
  } catch (error) {
    console.error('Error updating league:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Delete a league
 */
export async function deleteExistingLeague(userId: string, data: LeagueDeleteInput) {
  try {
    // Validate the input data
    const validatedData = LeagueDeleteSchema.parse(data);
    
    // Get the league to check ownership
    const league = await getLeagueById(validatedData.id);
    if (!league) {
      return { 
        success: false, 
        error: 'League not found' 
      };
    }
    
    // Check if the user is the owner of the league
    if (league.user_id !== userId) {
      return { 
        success: false, 
        error: 'You do not have permission to delete this league' 
      };
    }
    
    // Delete the league and all related data in a transaction
    await transaction(async () => {
      // Delete all players and related data
      await deleteLeaguePlayers(validatedData.id);
      
      // Delete the league
      await deleteLeague(validatedData.id);
    });
    
    // Revalidate the leagues page
    revalidatePath('/leagues');
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Error deleting league:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Get the current user's leagues
 */
export async function getCurrentUserLeagues(userId: string) {
  try {
    if (!userId) {
      return { 
        success: false, 
        error: 'User ID is required' 
      };
    }
    
    // Get leagues where the user is the owner
    const { data: ownedLeagues, error: ownedError } = await supabaseAdmin
      .from('leagues')
      .select('*')
      .eq('user_id', userId);
      
    if (ownedError) {
      throw ownedError;
    }
    
    // Get leagues where the user is a member
    const { data: memberLeagues, error: memberError } = await supabaseAdmin
      .from('league_members')
      .select(`
        role,
        leagues:league_id (*)
      `)
      .eq('user_id', userId)
      .neq('role', 'commissioner'); // Exclude commissioner role as they are already included as owners
      
    if (memberError) {
      throw memberError;
    }
    
    // Format member leagues
    const formattedMemberLeagues = memberLeagues.map(item => ({
      ...item.leagues,
      role: item.role
    }));
    
    // Add role to owned leagues
    const formattedOwnedLeagues = ownedLeagues.map(league => ({
      ...league,
      role: 'commissioner'
    }));
    
    return { 
      success: true, 
      leagues: {
        owned: formattedOwnedLeagues,
        member: formattedMemberLeagues,
        all: [...formattedOwnedLeagues, ...formattedMemberLeagues]
      }
    };
  } catch (error) {
    console.error('Error getting user leagues:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
} 