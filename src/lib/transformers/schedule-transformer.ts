/**
 * Schedule Transformer
 * 
 * This file contains functions for transforming schedule data from the Madden Companion App
 * into the format required by our database schema.
 */

import { MaddenSchedule } from '@/lib/validators/schedule-validators';
import { Schedule } from '@/db/schema/schedule';

/**
 * Transform a Madden schedule entry to our database schema
 * 
 * @param maddenSchedule - The schedule data from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed schedule entry
 */
export function transformMaddenSchedule(
  maddenSchedule: MaddenSchedule,
  leagueId: string
): Omit<Schedule, 'id' | 'created_at' | 'updated_at'> {
  return {
    league_id: leagueId,
    schedule_id: maddenSchedule.scheduleId || '',
    week_index: maddenSchedule.weekIndex || null,
    season_index: maddenSchedule.seasonIndex || null,
    stage_index: maddenSchedule.stageIndex || null,
    home_team_id: maddenSchedule.homeTeamId ? maddenSchedule.homeTeamId.toString() : null,
    away_team_id: maddenSchedule.awayTeamId ? maddenSchedule.awayTeamId.toString() : null,
    home_score: maddenSchedule.homeScore || null,
    away_score: maddenSchedule.awayScore || null,
    status: maddenSchedule.status || null,
    is_game_of_the_week: maddenSchedule.isGameOfTheWeek || null,
  };
}

/**
 * Transform an array of Madden schedule entries
 * 
 * @param schedules - Array of schedule entries from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed schedule entries
 */
export function transformMaddenSchedules(
  schedules: MaddenSchedule[],
  leagueId: string
): Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[] {
  return schedules.map(schedule => transformMaddenSchedule(schedule, leagueId));
} 