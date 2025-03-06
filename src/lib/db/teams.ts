/**
 * Team Database Operations
 * 
 * This file contains functions for interacting with the teams table in the database.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import { Team } from '@/db/schema/teams';

/**
 * Get a team by its ID
 * 
 * @param id - The UUID of the team
 * @returns The team or null if not found
 */
export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }
  
  return data as Team;
}

/**
 * Get teams by league ID
 * 
 * @param leagueId - The UUID of the league
 * @returns Array of teams in the league
 */
export async function getTeamsByLeagueId(leagueId: string): Promise<Team[]> {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('league_id', leagueId);
  
  if (error) {
    throw error;
  }
  
  return data as Team[];
}

/**
 * Get a team by its Madden team ID within a league
 * 
 * @param leagueId - The UUID of the league
 * @param teamId - The Madden team ID
 * @returns The team or null if not found
 */
export async function getTeamByMaddenId(leagueId: string, teamId: string): Promise<Team | null> {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('league_id', leagueId)
    .eq('team_id', teamId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }
  
  return data as Team;
}

/**
 * Create a new team
 * 
 * @param team - The team data to insert
 * @returns The created team
 */
export async function createTeam(team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team> {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .insert(team)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Team;
}

/**
 * Update an existing team
 * 
 * @param id - The UUID of the team to update
 * @param team - The team data to update
 * @returns The updated team
 */
export async function updateTeam(id: string, team: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>): Promise<Team> {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .update(team)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data as Team;
}

/**
 * Upsert a team (create if not exists, update if exists)
 * 
 * @param leagueId - The UUID of the league
 * @param teamId - The Madden team ID
 * @param team - The team data to upsert
 * @returns The upserted team
 */
export async function upsertTeam(
  leagueId: string,
  teamId: string,
  team: Omit<Team, 'id' | 'created_at' | 'updated_at'>
): Promise<Team> {
  // Check if team exists
  const existingTeam = await getTeamByMaddenId(leagueId, teamId);
  
  if (existingTeam) {
    // Update existing team
    return updateTeam(existingTeam.id, team);
  } else {
    // Create new team
    return createTeam(team);
  }
}

/**
 * Upsert multiple teams
 * 
 * @param teams - Array of team data to upsert
 * @returns Array of upserted teams
 */
export async function upsertTeams(teams: Omit<Team, 'id' | 'created_at' | 'updated_at'>[]): Promise<Team[]> {
  const results: Team[] = [];
  
  // Process teams sequentially to avoid conflicts
  for (const team of teams) {
    const result = await upsertTeam(team.league_id, team.team_id, team);
    results.push(result);
  }
  
  return results;
} 