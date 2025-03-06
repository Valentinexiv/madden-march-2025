/**
 * League Statistics Database Operations
 * 
 * This file contains functions for retrieving league statistics.
 */

import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Represents the league statistics
 */
export interface LeagueStats {
  totalTeams: number;
  totalPlayers: number;
  currentWeek: number;
  seasonType: string;
  topRusher?: {
    name: string;
    yards: number;
    team: string;
  };
  topPasser?: {
    name: string;
    yards: number;
    team: string;
  };
}

/**
 * Get statistics for a league
 * 
 * @param leagueId - The UUID of the league
 * @returns The league statistics
 */
export async function getLeagueStats(leagueId: string): Promise<LeagueStats> {
  // Get total teams
  const { count: totalTeams } = await supabaseAdmin
    .from('teams')
    .select('*', { count: 'exact', head: true })
    .eq('league_id', leagueId);
  
  // Get total players
  const { count: totalPlayers } = await supabaseAdmin
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('league_id', leagueId);
  
  // Get current week and season type from the most recent import
  const { data: recentImport } = await supabaseAdmin
    .from('leagues')
    .select('current_week, season_type')
    .eq('id', leagueId)
    .single();
  
  // Get top rusher (player with most rushing yards)
  const { data: topRushers } = await supabaseAdmin
    .from('weekly_rushing_stats')
    .select(`
      yards,
      players ( id, first_name, last_name ),
      teams ( team_name )
    `)
    .eq('league_id', leagueId)
    .order('yards', { ascending: false })
    .limit(1);
  
  // Get top passer (player with most passing yards)
  const { data: topPassers } = await supabaseAdmin
    .from('weekly_passing_stats')
    .select(`
      yards,
      players ( id, first_name, last_name ),
      teams ( team_name )
    `)
    .eq('league_id', leagueId)
    .order('yards', { ascending: false })
    .limit(1);
  
  // Format the top rusher data
  const topRusher = topRushers && topRushers.length > 0 ? {
    name: `${topRushers[0].players.first_name} ${topRushers[0].players.last_name}`,
    yards: topRushers[0].yards,
    team: topRushers[0].teams.team_name
  } : undefined;
  
  // Format the top passer data
  const topPasser = topPassers && topPassers.length > 0 ? {
    name: `${topPassers[0].players.first_name} ${topPassers[0].players.last_name}`,
    yards: topPassers[0].yards,
    team: topPassers[0].teams.team_name
  } : undefined;
  
  return {
    totalTeams: totalTeams || 0,
    totalPlayers: totalPlayers || 0,
    currentWeek: recentImport?.current_week || 1,
    seasonType: recentImport?.season_type || 'Regular Season',
    topRusher,
    topPasser
  };
} 