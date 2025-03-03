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
 * Get leagues by user ID
 * 
 * @param userId - The UUID of the user
 * @returns Array of leagues owned by the user
 */
export async function getLeaguesByUserId(userId: string): Promise<League[]> {
  const { data, error } = await supabaseAdmin
    .from('leagues')
    .select('*')
    .eq('user_id', userId);
  
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
    .eq('user_id', userId)
    .single();
  
  if (league) {
    return true;
  }
  
  // Check if user is a member of the league
  const { data: member, error: memberError } = await supabaseAdmin
    .from('league_members')
    .select('league_id')
    .eq('league_id', leagueId)
    .eq('user_id', userId)
    .single();
  
  return !!member;
} 