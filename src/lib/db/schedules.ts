/**
 * Schedule Database Operations
 * 
 * This file contains database operations for managing schedule data.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import { Schedule } from '@/db/schema/schedule';

/**
 * Get all schedules for a league
 * 
 * @param leagueId - The UUID of the league
 * @returns Array of schedule records
 */
export async function getSchedulesByLeagueId(leagueId: string): Promise<Schedule[]> {
  const { data, error } = await supabaseAdmin
    .from('schedules')
    .select('*')
    .eq('league_id', leagueId)
    .order('season_index', { ascending: true })
    .order('week_index', { ascending: true });
  
  if (error) {
    throw error;
  }
  
  return data as Schedule[];
}

/**
 * Get schedules for a specific league and week
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of schedule records
 */
export async function getSchedulesByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<Schedule[]> {
  const { data, error } = await supabaseAdmin
    .from('schedules')
    .select('*')
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
  
  return data as Schedule[];
}

/**
 * Delete schedules for a specific league, week, and season
 * 
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 */
export async function deleteSchedulesByWeek(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('schedules')
    .delete()
    .eq('league_id', leagueId)
    .eq('week_index', weekIndex)
    .eq('season_index', seasonIndex);
  
  if (error) {
    throw error;
  }
}

/**
 * Upsert schedules for a specific league, week, and season
 * This will delete existing schedules for the week/season and insert new ones
 * 
 * @param schedules - Array of schedule data to insert
 * @param leagueId - The UUID of the league
 * @param weekIndex - The week index
 * @param seasonIndex - The season index
 * @returns Array of created schedules
 */
export async function upsertSchedulesByWeek(
  schedules: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[],
  leagueId: string,
  weekIndex: number,
  seasonIndex: number
): Promise<Schedule[]> {
  // First, delete existing schedules for this week/season
  await deleteSchedulesByWeek(leagueId, weekIndex, seasonIndex);
  
  // Then, insert the new schedules
  const { data, error } = await supabaseAdmin
    .from('schedules')
    .insert(schedules)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data as Schedule[];
}

/**
 * Upsert schedules for a specific league
 * This uses a delete-then-insert approach to avoid the need for unique constraints
 * 
 * @param schedules - Array of schedule data to insert
 * @returns Array of created schedules
 */
export async function upsertSchedules(
  schedules: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[]
): Promise<Schedule[]> {
  if (schedules.length === 0) {
    return [];
  }
  
  // Group schedules by league, week, and season
  const scheduleGroups = new Map<string, {
    leagueId: string;
    weekIndex: number;
    seasonIndex: number;
    items: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[];
  }>();
  
  schedules.forEach(schedule => {
    if (!schedule.league_id || schedule.week_index === null || schedule.season_index === null) {
      return; // Skip invalid entries
    }
    
    const key = `${schedule.league_id}:${schedule.week_index}:${schedule.season_index}`;
    if (!scheduleGroups.has(key)) {
      scheduleGroups.set(key, {
        leagueId: schedule.league_id,
        weekIndex: schedule.week_index,
        seasonIndex: schedule.season_index,
        items: []
      });
    }
    
    scheduleGroups.get(key)?.items.push(schedule);
  });
  
  // Process each group using upsertSchedulesByWeek
  const results: Schedule[] = [];
  for (const group of scheduleGroups.values()) {
    const groupResults = await upsertSchedulesByWeek(
      group.items,
      group.leagueId,
      group.weekIndex,
      group.seasonIndex
    );
    results.push(...groupResults);
  }
  
  return results;
} 