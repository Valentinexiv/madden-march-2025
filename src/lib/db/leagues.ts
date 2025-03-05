/**
 * League Database Operations
 * 
 * This file contains functions for interacting with the leagues table in the database.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import { League } from '@/db/schema/leagues';

/**
 * Get a league by its ID
 * 
 * @param id - The UUID of the league
 * @returns The league or null if not found
 */
export async function getLeagueById(id: string): Promise<League | null> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }
  
  return data as League;
}

/**
 * Get a league by its slug
 * 
 * @param slug - The unique slug for the league
 * @returns The league or null if not found
 */
export async function getLeagueBySlug(slug: string): Promise<League | null> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .select('*')
    .eq('league_identifier', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }
  
  return data as League;
}

/**
 * Get leagues by user ID
 * 
 * @param userId - The UUID of the user
 * @returns Array of leagues owned by the user
 */
export async function getLeaguesByUserId(userId: string): Promise<League[]> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .select('*')
    .eq('owner', userId);
  
  if (error) {
    throw error;
  }
  
  return data as League[];
}

/**
 * Get a league by its Madden league ID and platform
 * 
 * @param maddenLeagueId - The Madden league ID
 * @param platform - The platform (e.g., "xbsx", "ps5")
 * @returns The league or null if not found
 */
export async function getLeagueByMaddenId(maddenLeagueId: string, platform: string): Promise<League | null> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .select('*')
    .eq('madden_league_id', maddenLeagueId)
    .eq('platform', platform)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }
  
  return data as League;
}

/**
 * Create a new league
 * 
 * @param league - The league data to insert
 * @returns The created league
 */
export async function createLeague(league: Omit<League, 'id' | 'created_at' | 'updated_at'>): Promise<League> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .insert(league)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as League;
}

/**
 * Update an existing league
 * 
 * @param id - The UUID of the league to update
 * @param league - The league data to update
 * @returns The updated league
 */
export async function updateLeague(id: string, league: Partial<Omit<League, 'id' | 'created_at' | 'updated_at'>>): Promise<League> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .update(league)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as League;
}

/**
 * Update the last import timestamp for a league
 * 
 * @param id - The UUID of the league
 * @returns The updated league
 */
export async function updateLeagueLastImport(id: string): Promise<League> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .update({
      last_import_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as League;
}

/**
 * Check if a user has access to a league
 * 
 * @param userId - The UUID of the user
 * @param leagueId - The UUID of the league
 * @returns True if the user has access, false otherwise
 */
export async function userHasLeagueAccess(userId: string, leagueId: string): Promise<boolean> {
  // Check if user is the owner of the league
  const { data: league, error: leagueError } = await supabaseAdmin
    .from('leagues')
    .select('id')
    .eq('id', leagueId)
    .eq('owner', userId)
    .single();
  
  if (league) {
    return true;
  }
  
  // Check if user is a member of the league
  const { data: member, error: memberError } = await supabaseAdmin
    .from('league_memberships')
    .select('league_id')
    .eq('league_id', leagueId)
    .eq('user_id', userId)
    .single();
  
  return !!member;
}

/**
 * Delete a league by its ID
 * 
 * @param id - The UUID of the league to delete
 * @returns True if the league was deleted successfully
 */
export async function deleteLeague(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('leagues')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return true;
}

/**
 * Check if a league identifier is available
 * 
 * @param identifier - The league identifier to check
 * @returns True if the identifier is available, false if it's already taken
 */
export async function isLeagueIdentifierAvailable(identifier: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .select('id')
    .eq('league_identifier', identifier)
    .maybeSingle();
  
  if (error) {
    throw error;
  }
  
  return data === null;
}

/**
 * Get league members
 * 
 * @param leagueId - The UUID of the league
 * @returns Array of league members
 */
export async function getLeagueMembers(leagueId: string): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('league_memberships')
    .select(`
      *,
      users:user_id (
        id,
        email,
        user_metadata
      )
    `)
    .eq('league_id', leagueId);
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Add a member to a league
 * 
 * @param leagueId - The UUID of the league
 * @param userId - The UUID of the user
 * @param role - The role of the user in the league
 * @returns The created league member
 */
export async function addLeagueMember(leagueId: string, userId: string, role: string): Promise<any> {
  const { data, error } = await supabaseAdmin
    .from('league_memberships')
    .insert({
      league_id: leagueId,
      user_id: userId,
      role: role
    })
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Remove a member from a league
 * 
 * @param leagueId - The UUID of the league
 * @param userId - The UUID of the user
 * @returns True if the member was removed successfully
 */
export async function removeLeagueMember(leagueId: string, userId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('league_memberships')
    .delete()
    .eq('league_id', leagueId)
    .eq('user_id', userId);
  
  if (error) {
    throw error;
  }
  
  return true;
}

/**
 * Update a league member's role
 * 
 * @param leagueId - The UUID of the league
 * @param userId - The UUID of the user
 * @param role - The new role of the user in the league
 * @returns The updated league member
 */
export async function updateLeagueMemberRole(leagueId: string, userId: string, role: string): Promise<any> {
  const { data, error } = await supabaseAdmin
    .from('league_memberships')
    .update({ role })
    .eq('league_id', leagueId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Get leagues where the user is a member
 * 
 * @param userId - The UUID of the user
 * @returns Array of league memberships with league data
 */
export async function getLeaguesMembershipsByUserId(userId: string): Promise<Array<{
  league: League;
  role: string;
}>> {
  const { data, error } = await supabaseAdmin
    .from('league_memberships')
    .select(`
      role,
      leagues:league_id (*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    throw error;
  }
  
  // Transform the data to match the expected format
  return data.map((item: any) => ({
    league: item.leagues as League,
    role: item.role
  }));
}