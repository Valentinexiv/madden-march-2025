/**
 * Standings Transformer
 * 
 * This file contains utilities to transform standings data from the Madden Companion App
 * into the format required by our database schema.
 */

import { MaddenStanding } from '../validators/standings-validators';
import { Standing } from '@/db/schema/standings';

/**
 * Transform a standing from the Madden Companion App format to our database schema format
 * 
 * @param maddenStanding - Standing data from the Madden Companion App
 * @param leagueId - The UUID of the league this standing belongs to
 * @returns Standing data in the format required by our database schema
 */
export function transformMaddenStanding(maddenStanding: MaddenStanding, leagueId: string): Omit<Standing, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    team_id: maddenStanding.teamId.toString(),
    week_index: maddenStanding.weekIndex,
    season_index: maddenStanding.seasonIndex,
    stage_index: maddenStanding.stageIndex,
    calendar_year: maddenStanding.calendarYear,
    rank: maddenStanding.rank,
    prev_rank: maddenStanding.prevRank,
    seed: maddenStanding.seed,
    total_wins: maddenStanding.totalWins,
    total_losses: maddenStanding.totalLosses,
    total_ties: maddenStanding.totalTies,
    win_pct: maddenStanding.winPct,
    home_wins: maddenStanding.homeWins,
    home_losses: maddenStanding.homeLosses,
    home_ties: maddenStanding.homeTies,
    away_wins: maddenStanding.awayWins,
    away_losses: maddenStanding.awayLosses,
    away_ties: maddenStanding.awayTies,
    div_wins: maddenStanding.divWins,
    div_losses: maddenStanding.divLosses,
    div_ties: maddenStanding.divTies,
    conf_wins: maddenStanding.confWins,
    conf_losses: maddenStanding.confLosses,
    conf_ties: maddenStanding.confTies,
    pts_for: maddenStanding.ptsFor,
    pts_against: maddenStanding.ptsAgainst,
    net_pts: maddenStanding.netPts,
    pts_for_rank: maddenStanding.ptsForRank,
    pts_against_rank: maddenStanding.ptsAgainstRank,
    off_total_yds: maddenStanding.offTotalYds,
    off_total_yds_rank: maddenStanding.offTotalYdsRank,
    def_total_yds: maddenStanding.defTotalYds,
    def_total_yds_rank: maddenStanding.defTotalYdsRank,
    win_loss_streak: maddenStanding.winLossStreak,
    div_name: maddenStanding.divisionName,
    division_id: maddenStanding.divisionId?.toString() || null,
    conference_id: maddenStanding.conferenceId?.toString() || null,
    conference_name: maddenStanding.conferenceName,
    playoff_status: maddenStanding.playoffStatus,
    cap_available: maddenStanding.capAvailable,
    cap_spent: maddenStanding.capSpent,
    cap_room: maddenStanding.capRoom,
    team_ovr: maddenStanding.teamOvr,
  };
}

/**
 * Transform an array of standings from the Madden Companion App format to our database schema format
 * 
 * @param maddenStandings - Array of standing data from the Madden Companion App
 * @param leagueId - The UUID of the league these standings belong to
 * @returns Array of standing data in the format required by our database schema
 */
export function transformMaddenStandings(maddenStandings: MaddenStanding[], leagueId: string): Omit<Standing, 'id' | 'created_at'>[] {
  return maddenStandings.map(standing => transformMaddenStanding(standing, leagueId));
} 