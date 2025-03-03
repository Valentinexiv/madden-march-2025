// File: src/db/schema/weekly_stats.ts
export interface WeeklyDefensiveStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  player_id: string | null; // UUID foreign key to players.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  team_id: string | null;
  def_total_tackles: number | null;
  def_sacks: number | null;
  def_ints: number | null;
  def_forced_fum: number | null;
  def_fum_rec: number | null;
  def_deflections: number | null;
  def_tds: number | null;
  def_safeties: number | null;
  def_int_return_yds: number | null;
  def_catch_allowed: number | null;
  def_pts: number | null;
  created_at: Date;
}

export interface WeeklyReceivingStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  player_id: string | null; // UUID foreign key to players.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  team_id: string | null;
  rec_catches: number | null;
  rec_yards: number | null;
  rec_tds: number | null;
  rec_yards_after_catch: number | null;
  rec_drops: number | null;
  rec_longest: number | null;
  rec_yards_per_catch: number | null;
  rec_catch_pct: number | null;
  rec_yac_per_catch: number | null;
  rec_yards_per_game: number | null;
  rec_to_pct: number | null;
  rec_pts: number | null;
  created_at: Date;
}

export interface WeeklyRushingStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  player_id: string | null; // UUID foreign key to players.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  team_id: string | null;
  rush_att: number | null;
  rush_yards: number | null;
  rush_tds: number | null;
  rush_yards_per_att: number | null;
  rush_broken_tackles: number | null;
  rush_longest: number | null;
  rush_20_plus_yds: number | null;
  rush_yards_after_contact: number | null;
  rush_fum: number | null;
  rush_yards_per_game: number | null;
  rush_to_pct: number | null;
  rush_pts: number | null;
  created_at: Date;
}

export interface WeeklyPassingStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  player_id: string | null; // UUID foreign key to players.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  team_id: string | null;
  pass_att: number | null;
  pass_comp: number | null;
  pass_yards: number | null;
  pass_tds: number | null;
  pass_ints: number | null;
  pass_sacks: number | null;
  pass_longest: number | null;
  passer_rating: number | null;
  pass_comp_pct: number | null;
  pass_yards_per_att: number | null;
  pass_yards_per_game: number | null;
  pass_pts: number | null;
  created_at: Date;
}

export interface WeeklyKickingStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  player_id: string | null; // UUID foreign key to players.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  team_id: string | null;
  fg_att: number | null;
  fg_made: number | null;
  fg_longest: number | null;
  fg_50_plus_att: number | null;
  fg_50_plus_made: number | null;
  xp_att: number | null;
  xp_made: number | null;
  kickoff_att: number | null;
  kickoff_tbs: number | null;
  fg_comp_pct: number | null;
  xp_comp_pct: number | null;
  kick_pts: number | null;
  created_at: Date;
}

export interface WeeklyPuntingStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  player_id: string | null; // UUID foreign key to players.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  team_id: string | null;
  punt_att: number | null;
  punt_yards: number | null;
  punt_longest: number | null;
  punts_in_20: number | null;
  punt_tbs: number | null;
  punts_blocked: number | null;
  punt_net_yards: number | null;
  punt_net_yards_per_att: number | null;
  punt_yards_per_att: number | null;
  created_at: Date;
}

export interface WeeklyTeamStat {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  team_id: string | null; // UUID foreign key to teams.id
  stat_id: string | null;
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  total_wins: number | null;
  total_losses: number | null;
  total_ties: number | null;
  seed: number | null;
  off_total_yards: number | null;
  off_pass_yards: number | null;
  off_rush_yards: number | null;
  off_pass_tds: number | null;
  off_rush_tds: number | null;
  off_pts_per_game: number | null;
  off_1st_downs: number | null;
  off_3rd_down_att: number | null;
  off_3rd_down_conv: number | null;
  off_3rd_down_conv_pct: number | null;
  off_4th_down_att: number | null;
  off_4th_down_conv: number | null;
  off_4th_down_conv_pct: number | null;
  off_red_zones: number | null;
  off_red_zone_tds: number | null;
  off_red_zone_fgs: number | null;
  off_red_zone_pct: number | null;
  def_total_yards: number | null;
  def_pass_yards: number | null;
  def_rush_yards: number | null;
  def_pts_per_game: number | null;
  def_red_zones: number | null;
  def_red_zone_tds: number | null;
  def_red_zone_fgs: number | null;
  def_red_zone_pct: number | null;
  penalties: number | null;
  penalty_yards: number | null;
  to_giveaways: number | null;
  to_takeaways: number | null;
  to_diff: number | null;
  created_at: Date;
}