/**
 * Weekly Stats Database Operations
 * 
 * This file contains functions for interacting with the weekly stats tables in the database.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import {
  WeeklyDefensiveStat,
  WeeklyReceivingStat,
  WeeklyRushingStat,
  WeeklyPassingStat,
  WeeklyKickingStat,
  WeeklyPuntingStat,
  WeeklyTeamStat,
} from '@/db/schema/weekly_stats';

/**
 * Get defensive stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of defensive stats
 */
export async function getDefensiveStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyDefensiveStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_defensive_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyDefensiveStat[];
}

/**
 * Get receiving stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of receiving stats
 */
export async function getReceivingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyReceivingStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_receiving_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyReceivingStat[];
}

/**
 * Get rushing stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of rushing stats
 */
export async function getRushingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyRushingStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_rushing_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyRushingStat[];
}

/**
 * Get passing stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of passing stats
 */
export async function getPassingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyPassingStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_passing_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyPassingStat[];
}

/**
 * Get kicking stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of kicking stats
 */
export async function getKickingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyKickingStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_kicking_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyKickingStat[];
}

/**
 * Get punting stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of punting stats
 */
export async function getPuntingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyPuntingStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_punting_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyPuntingStat[];
}

/**
 * Get team stats by league ID, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of team stats
 */
export async function getTeamStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyTeamStat[]> {
  const { data, error } = await supabaseAdmin
    .from('weekly_team_stats')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as WeeklyTeamStat[];
}

/**
 * Delete defensive stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deleteDefensiveStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_defensive_stats')
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
 * Delete receiving stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deleteReceivingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_receiving_stats')
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
 * Delete rushing stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deleteRushingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_rushing_stats')
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
 * Delete passing stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deletePassingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_passing_stats')
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
 * Delete kicking stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deleteKickingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_kicking_stats')
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
 * Delete punting stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deletePuntingStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_punting_stats')
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
 * Delete team stats for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns The number of deleted records
 */
export async function deleteTeamStatsByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<number> {
  const { data, error, count } = await supabaseAdmin
    .from('weekly_team_stats')
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
 * Upsert defensive stats for a specific league, week, and season
 * 
 * @param stats - Array of defensive stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created defensive stats
 */
export async function upsertDefensiveStatsByWeek(
  stats: Omit<WeeklyDefensiveStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyDefensiveStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_defensive_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting defensive stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for defensive stats');
        await deleteDefensiveStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_defensive_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyDefensiveStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyDefensiveStat[];
  } catch (error) {
    console.error('Error in upsertDefensiveStatsByWeek:', error);
    throw error;
  }
}

/**
 * Upsert receiving stats for a specific league, week, and season
 * 
 * @param stats - Array of receiving stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created receiving stats
 */
export async function upsertReceivingStatsByWeek(
  stats: Omit<WeeklyReceivingStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyReceivingStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_receiving_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting receiving stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for receiving stats');
        await deleteReceivingStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_receiving_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyReceivingStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyReceivingStat[];
  } catch (error) {
    console.error('Error in upsertReceivingStatsByWeek:', error);
    throw error;
  }
}

/**
 * Upsert rushing stats for a specific league, week, and season
 * 
 * @param stats - Array of rushing stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created rushing stats
 */
export async function upsertRushingStatsByWeek(
  stats: Omit<WeeklyRushingStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyRushingStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_rushing_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting rushing stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for rushing stats');
        await deleteRushingStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_rushing_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyRushingStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyRushingStat[];
  } catch (error) {
    console.error('Error in upsertRushingStatsByWeek:', error);
    throw error;
  }
}

/**
 * Upsert passing stats for a specific league, week, and season
 * 
 * @param stats - Array of passing stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created passing stats
 */
export async function upsertPassingStatsByWeek(
  stats: Omit<WeeklyPassingStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyPassingStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_passing_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting passing stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for passing stats');
        await deletePassingStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_passing_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyPassingStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyPassingStat[];
  } catch (error) {
    console.error('Error in upsertPassingStatsByWeek:', error);
    throw error;
  }
}

/**
 * Upsert kicking stats for a specific league, week, and season
 * 
 * @param stats - Array of kicking stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created kicking stats
 */
export async function upsertKickingStatsByWeek(
  stats: Omit<WeeklyKickingStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyKickingStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_kicking_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting kicking stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for kicking stats');
        await deleteKickingStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_kicking_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyKickingStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyKickingStat[];
  } catch (error) {
    console.error('Error in upsertKickingStatsByWeek:', error);
    throw error;
  }
}

/**
 * Upsert punting stats for a specific league, week, and season
 * 
 * @param stats - Array of punting stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created punting stats
 */
export async function upsertPuntingStatsByWeek(
  stats: Omit<WeeklyPuntingStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyPuntingStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_punting_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting punting stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for punting stats');
        await deletePuntingStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_punting_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyPuntingStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyPuntingStat[];
  } catch (error) {
    console.error('Error in upsertPuntingStatsByWeek:', error);
    throw error;
  }
}

/**
 * Upsert team stats for a specific league, week, and season
 * 
 * @param stats - Array of team stats to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created team stats
 */
export async function upsertTeamStatsByWeek(
  stats: Omit<WeeklyTeamStat, 'id' | 'created_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<WeeklyTeamStat[]> {
  if (stats.length === 0) {
    return [];
  }
  
  try {
    // Use upsert with onConflict referring to the unique constraint
    const { data, error } = await supabaseAdmin
      .from('weekly_team_stats')
      .upsert(stats, {
        onConflict: 'league_id,stat_id,week_index,season_index',
        ignoreDuplicates: false
      })
      .select();
    
    if (error) {
      console.error('Error upserting team stats:', error);
      
      // Fall back to delete-then-insert if there's an error with the constraint
      if (error.code === '42P10') {
        console.log('Falling back to delete-then-insert for team stats');
        await deleteTeamStatsByWeek(leagueId, weekIndex, seasonIndex);
        
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('weekly_team_stats')
          .insert(stats)
          .select();
          
        if (insertError) throw insertError;
        return insertData as WeeklyTeamStat[];
      }
      
      throw error;
    }
    
    return data as WeeklyTeamStat[];
  } catch (error) {
    console.error('Error in upsertTeamStatsByWeek:', error);
    throw error;
  }
} 