/**
 * Standings Database Operations
 * 
 * This file contains functions for interacting with the standings table in the database.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import { Standing } from '@/db/schema/standings';

/**
 * Get standings by league ID
 * 
 * @param leagueId - The UUID of the league
 * @returns Array of standings in the league
 */
export async function getStandingsByLeagueId(leagueId: string): Promise<Standing[]> {
  const { data, error } = await supabaseAdmin
    .from('standings')
    .select('*')
    .eq('league_id', leagueId);
  
  if (error) {
    throw error;
  }
  
  return data as Standing[];
}

/**
 * Get standings by league ID and week
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of standings for the specified week and season
 */
export async function getStandingsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<Standing[]> {
  const { data, error } = await supabaseAdmin
    .from('standings')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as Standing[];
}

/**
 * Get standings for a specific team
 * 
 * @param leagueId - The UUID of the league
 * @param teamId - The team ID
 * @returns Array of standings for the specified team
 */
export async function getStandingsByTeam(
  leagueId: string,
  teamId: string
): Promise<Standing[]> {
  const { data, error } = await supabaseAdmin
    .from('standings')
    .select('*')
    .eq('league_id', leagueId)
    .eq('team_id', teamId)
    .order('week_index', { ascending: false })
    .order('season_index', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data as Standing[];
}

/**
 * Create a new standing record
 * 
 * @param standing - The standing data to insert
 * @returns The created standing
 */
export async function createStanding(standing: Omit<Standing, 'id' | 'created_at'>): Promise<Standing> {
  const { data, error } = await supabaseAdmin
    .from('standings')
    .insert(standing)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Standing;
}

/**
 * Update an existing standing record
 * 
 * @param id - The ID of the standing to update
 * @param standing - The standing data to update
 * @returns The updated standing
 */
export async function updateStanding(
  id: number,
  standing: Partial<Omit<Standing, 'id' | 'created_at'>>
): Promise<Standing> {
  const { data, error } = await supabaseAdmin
    .from('standings')
    .update(standing)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Standing;
}

/**
 * Delete standings for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deleteStandingsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('standings')
    .delete()
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex)
    .select();
  
  if (error) {
    throw error;
  }
  
  return count || 0;
}

/**
 * Upsert standings for a specific league, week, and season
 * This will delete existing standings for the week/season and insert new ones
 * 
 * @param standings - Array of standing data to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created standings
 */
export async function upsertStandingsByWeek(
  standings: Omit<Standing, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<Standing[]> {
  // First, delete existing standings for this week/season
  await deleteStandingsByWeek(leagueId, weekIndex, seasonIndex);
  
  // Then, insert the new standings
  const { data, error } = await supabaseAdmin
    .from('standings')
    .insert(standings)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data as Standing[];
}

/**
 * Upsert standings for a specific league
 * This is a simplified version that just inserts the standings without checking for existing ones
 * 
 * @param standings - Array of standing data to insert
 * @returns Array of created standings
 */
export async function upsertStandings(
  standings: Omit<Standing, 'id' | 'created_at'>[]
): Promise<Standing[]> {
  if (standings.length === 0) {
    return [];
  }
  
  const { data, error } = await supabaseAdmin
    .from('standings')
    .upsert(standings, {
      onConflict: 'league_id,team_id,week_index,season_index'
    })
    .select();
  
  if (error) {
    throw error;
  }
  
  return data as Standing[];
} 