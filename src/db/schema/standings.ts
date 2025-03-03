// File: src/db/schema/standings.ts
export interface Standing {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  team_id: string | null; // UUID foreign key to teams.id
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  calendar_year: number | null;
  rank: number | null;
  prev_rank: number | null;
  seed: number | null;
  total_wins: number | null;
  total_losses: number | null;
  total_ties: number | null;
  win_pct: number | null;
  home_wins: number | null;
  home_losses: number | null;
  home_ties: number | null;
  away_wins: number | null;
  away_losses: number | null;
  away_ties: number | null;
  div_wins: number | null;
  div_losses: number | null;
  div_ties: number | null;
  conf_wins: number | null;
  conf_losses: number | null;
  conf_ties: number | null;
  pts_for: number | null;
  pts_against: number | null;
  net_pts: number | null;
  pts_for_rank: number | null;
  pts_against_rank: number | null;
  off_total_yds: number | null;
  off_total_yds_rank: number | null;
  def_total_yds: number | null;
  def_total_yds_rank: number | null;
  win_loss_streak: number | null;
  div_name: string | null;
  division_id: string | null;
  conference_id: string | null;
  conference_name: string | null;
  playoff_status: number | null;
  cap_available: number | null;
  cap_spent: number | null;
  cap_room: number | null;
  team_ovr: number | null;
  created_at: Date;
}