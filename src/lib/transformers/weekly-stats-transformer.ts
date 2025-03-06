/**
 * Weekly Stats Transformer
 * 
 * This file contains functions for transforming weekly stats data from the Madden Companion App
 * into the format required by our database schema.
 */

import {
  MaddenDefensiveStat,
  MaddenReceivingStat,
  MaddenRushingStat,
  MaddenPassingStat,
  MaddenKickingStat,
  MaddenPuntingStat,
  MaddenTeamStat,
} from '@/lib/validators/weekly-stats-validators';

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
 * Transform a Madden defensive stat to our database schema
 * 
 * @param maddenStat - The defensive stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed defensive stat
 */
export function transformMaddenDefensiveStat(
  maddenStat: MaddenDefensiveStat,
  leagueId: string
): Omit<WeeklyDefensiveStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    player_id: maddenStat.playerId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    team_id: maddenStat.teamId || null,
    def_total_tackles: maddenStat.defTotalTackles || null,
    def_sacks: maddenStat.defSacks || null,
    def_ints: maddenStat.defInts || null,
    def_forced_fum: maddenStat.defForcedFum || null,
    def_fum_rec: maddenStat.defFumRec || null,
    def_deflections: maddenStat.defDeflections || null,
    def_tds: maddenStat.defTDs || null,
    def_safeties: maddenStat.defSafeties || null,
    def_int_return_yds: maddenStat.defIntReturnYds || null,
    def_catch_allowed: maddenStat.defCatchAllowed || null,
    def_pts: maddenStat.defPts || null,
  };
}

/**
 * Transform a Madden receiving stat to our database schema
 * 
 * @param maddenStat - The receiving stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed receiving stat
 */
export function transformMaddenReceivingStat(
  maddenStat: MaddenReceivingStat,
  leagueId: string
): Omit<WeeklyReceivingStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    player_id: maddenStat.playerId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    team_id: maddenStat.teamId || null,
    rec_catches: maddenStat.recCatches || null,
    rec_yards: maddenStat.recYards || null,
    rec_tds: maddenStat.recTDs || null,
    rec_yards_after_catch: maddenStat.recYardsAfterCatch || null,
    rec_drops: maddenStat.recDrops || null,
    rec_longest: maddenStat.recLongest || null,
    rec_yards_per_catch: maddenStat.recYardsPerCatch || null,
    rec_catch_pct: maddenStat.recCatchPct || null,
    rec_yac_per_catch: maddenStat.recYACPerCatch || null,
    rec_yards_per_game: maddenStat.recYardsPerGame || null,
    rec_to_pct: maddenStat.recTOPct || null,
    rec_pts: maddenStat.recPts || null,
  };
}

/**
 * Transform a Madden rushing stat to our database schema
 * 
 * @param maddenStat - The rushing stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed rushing stat
 */
export function transformMaddenRushingStat(
  maddenStat: MaddenRushingStat,
  leagueId: string
): Omit<WeeklyRushingStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    player_id: maddenStat.playerId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    team_id: maddenStat.teamId || null,
    rush_att: maddenStat.rushAtt || null,
    rush_yards: maddenStat.rushYards || null,
    rush_tds: maddenStat.rushTDs || null,
    rush_yards_per_att: maddenStat.rushYardsPerAtt || null,
    rush_broken_tackles: maddenStat.rushBrokenTackles || null,
    rush_longest: maddenStat.rushLongest || null,
    rush_20_plus_yds: maddenStat.rush20PlusYds || null,
    rush_yards_after_contact: maddenStat.rushYardsAfterContact || null,
    rush_fum: maddenStat.rushFum || null,
    rush_yards_per_game: maddenStat.rushYardsPerGame || null,
    rush_to_pct: maddenStat.rushTOPct || null,
    rush_pts: maddenStat.rushPts || null,
  };
}

/**
 * Transform a Madden passing stat to our database schema
 * 
 * @param maddenStat - The passing stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed passing stat
 */
export function transformMaddenPassingStat(
  maddenStat: MaddenPassingStat,
  leagueId: string
): Omit<WeeklyPassingStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    player_id: maddenStat.playerId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    team_id: maddenStat.teamId || null,
    pass_att: maddenStat.passAtt || null,
    pass_comp: maddenStat.passComp || null,
    pass_yards: maddenStat.passYards || null,
    pass_tds: maddenStat.passTDs || null,
    pass_ints: maddenStat.passInts || null,
    pass_sacks: maddenStat.passSacks || null,
    pass_longest: maddenStat.passLongest || null,
    passer_rating: maddenStat.passerRating || null,
    pass_comp_pct: maddenStat.passCompPct || null,
    pass_yards_per_att: maddenStat.passYardsPerAtt || null,
    pass_yards_per_game: maddenStat.passYardsPerGame || null,
    pass_pts: maddenStat.passPts || null,
  };
}

/**
 * Transform a Madden kicking stat to our database schema
 * 
 * @param maddenStat - The kicking stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed kicking stat
 */
export function transformMaddenKickingStat(
  maddenStat: MaddenKickingStat,
  leagueId: string
): Omit<WeeklyKickingStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    player_id: maddenStat.playerId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    team_id: maddenStat.teamId || null,
    fg_att: maddenStat.fgAtt || null,
    fg_made: maddenStat.fgMade || null,
    fg_longest: maddenStat.fgLongest || null,
    fg_50_plus_att: maddenStat.fg50PlusAtt || null,
    fg_50_plus_made: maddenStat.fg50PlusMade || null,
    xp_att: maddenStat.xpAtt || null,
    xp_made: maddenStat.xpMade || null,
    kickoff_att: maddenStat.kickoffAtt || null,
    kickoff_tbs: maddenStat.kickoffTBs || null,
    fg_comp_pct: maddenStat.fgCompPct || null,
    xp_comp_pct: maddenStat.xpCompPct || null,
    kick_pts: maddenStat.kickPts || null,
  };
}

/**
 * Transform a Madden punting stat to our database schema
 * 
 * @param maddenStat - The punting stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed punting stat
 */
export function transformMaddenPuntingStat(
  maddenStat: MaddenPuntingStat,
  leagueId: string
): Omit<WeeklyPuntingStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    player_id: maddenStat.playerId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    team_id: maddenStat.teamId || null,
    punt_att: maddenStat.puntAtt || null,
    punt_yards: maddenStat.puntYards || null,
    punt_longest: maddenStat.puntLongest || null,
    punts_in_20: maddenStat.puntsIn20 || null,
    punt_tbs: maddenStat.puntTBs || null,
    punts_blocked: maddenStat.puntsBlocked || null,
    punt_net_yards: maddenStat.puntNetYards || null,
    punt_net_yards_per_att: maddenStat.puntNetYardsPerAtt || null,
    punt_yards_per_att: maddenStat.puntYardsPerAtt || null,
  };
}

/**
 * Transform a Madden team stat to our database schema
 * 
 * @param maddenStat - The team stat from Madden
 * @param leagueId - The UUID of the league
 * @returns Transformed team stat
 */
export function transformMaddenTeamStat(
  maddenStat: MaddenTeamStat,
  leagueId: string
): Omit<WeeklyTeamStat, 'id' | 'created_at'> {
  return {
    league_id: leagueId,
    team_id: maddenStat.teamId || null,
    stat_id: maddenStat.statId || null,
    schedule_id: maddenStat.scheduleId || null,
    week_index: maddenStat.weekIndex || null,
    season_index: maddenStat.seasonIndex || null,
    stage_index: maddenStat.stageIndex || null,
    total_wins: maddenStat.totalWins || null,
    total_losses: maddenStat.totalLosses || null,
    total_ties: maddenStat.totalTies || null,
    seed: maddenStat.seed || null,
    off_total_yards: maddenStat.offTotalYards || null,
    off_pass_yards: maddenStat.offPassYards || null,
    off_rush_yards: maddenStat.offRushYards || null,
    off_pass_tds: maddenStat.offPassTDs || null,
    off_rush_tds: maddenStat.offRushTDs || null,
    off_pts_per_game: maddenStat.offPtsPerGame || null,
    off_1st_downs: maddenStat.off1stDowns || null,
    off_3rd_down_att: maddenStat.off3rdDownAtt || null,
    off_3rd_down_conv: maddenStat.off3rdDownConv || null,
    off_3rd_down_conv_pct: maddenStat.off3rdDownConvPct || null,
    off_4th_down_att: maddenStat.off4thDownAtt || null,
    off_4th_down_conv: maddenStat.off4thDownConv || null,
    off_4th_down_conv_pct: maddenStat.off4thDownConvPct || null,
    off_red_zones: maddenStat.offRedZones || null,
    off_red_zone_tds: maddenStat.offRedZoneTDs || null,
    off_red_zone_fgs: maddenStat.offRedZoneFGs || null,
    off_red_zone_pct: maddenStat.offRedZonePct || null,
    def_total_yards: maddenStat.defTotalYards || null,
    def_pass_yards: maddenStat.defPassYards || null,
    def_rush_yards: maddenStat.defRushYards || null,
    def_pts_per_game: maddenStat.defPtsPerGame || null,
    def_red_zones: maddenStat.defRedZones || null,
    def_red_zone_tds: maddenStat.defRedZoneTDs || null,
    def_red_zone_fgs: maddenStat.defRedZoneFGs || null,
    def_red_zone_pct: maddenStat.defRedZonePct || null,
    penalties: maddenStat.penalties || null,
    penalty_yards: maddenStat.penaltyYards || null,
    to_giveaways: maddenStat.toGiveaways || null,
    to_takeaways: maddenStat.toTakeaways || null,
    to_diff: maddenStat.toDiff || null,
  };
}

/**
 * Transform an array of Madden defensive stats
 * 
 * @param stats - Array of defensive stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed defensive stats
 */
export function transformMaddenDefensiveStats(
  stats: MaddenDefensiveStat[],
  leagueId: string
): Omit<WeeklyDefensiveStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenDefensiveStat(stat, leagueId));
}

/**
 * Transform an array of Madden receiving stats
 * 
 * @param stats - Array of receiving stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed receiving stats
 */
export function transformMaddenReceivingStats(
  stats: MaddenReceivingStat[],
  leagueId: string
): Omit<WeeklyReceivingStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenReceivingStat(stat, leagueId));
}

/**
 * Transform an array of Madden rushing stats
 * 
 * @param stats - Array of rushing stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed rushing stats
 */
export function transformMaddenRushingStats(
  stats: MaddenRushingStat[],
  leagueId: string
): Omit<WeeklyRushingStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenRushingStat(stat, leagueId));
}

/**
 * Transform an array of Madden passing stats
 * 
 * @param stats - Array of passing stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed passing stats
 */
export function transformMaddenPassingStats(
  stats: MaddenPassingStat[],
  leagueId: string
): Omit<WeeklyPassingStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenPassingStat(stat, leagueId));
}

/**
 * Transform an array of Madden kicking stats
 * 
 * @param stats - Array of kicking stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed kicking stats
 */
export function transformMaddenKickingStats(
  stats: MaddenKickingStat[],
  leagueId: string
): Omit<WeeklyKickingStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenKickingStat(stat, leagueId));
}

/**
 * Transform an array of Madden punting stats
 * 
 * @param stats - Array of punting stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed punting stats
 */
export function transformMaddenPuntingStats(
  stats: MaddenPuntingStat[],
  leagueId: string
): Omit<WeeklyPuntingStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenPuntingStat(stat, leagueId));
}

/**
 * Transform an array of Madden team stats
 * 
 * @param stats - Array of team stats from Madden
 * @param leagueId - The UUID of the league
 * @returns Array of transformed team stats
 */
export function transformMaddenTeamStats(
  stats: MaddenTeamStat[],
  leagueId: string
): Omit<WeeklyTeamStat, 'id' | 'created_at'>[] {
  return stats.map(stat => transformMaddenTeamStat(stat, leagueId));
} 