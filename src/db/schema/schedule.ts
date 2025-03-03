// File: src/db/schema/schedule.ts
export interface Schedule {
  id: number; // Serial
  league_id: string; // UUID foreign key to leagues.id
  schedule_id: string | null;
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  home_team_id: string | null; // UUID foreign key to teams.id
  away_team_id: string | null; // UUID foreign key to teams.id
  home_score: number | null;
  away_score: number | null;
  status: number | null;
  is_game_of_the_week: boolean | null;
  created_at: Date;
}