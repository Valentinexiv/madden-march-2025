// File: src/db/schema/schedule.ts
export interface Schedule {
  id: string; // UUID
  league_id: string | null; // UUID foreign key to leagues.id
  schedule_id: string; // Madden schedule identifier
  week_index: number | null;
  season_index: number | null;
  stage_index: number | null;
  home_team_id: string | null; // Foreign key to teams.team_id
  away_team_id: string | null; // Foreign key to teams.team_id
  home_score: number | null;
  away_score: number | null;
  status: number | null;
  is_game_of_the_week: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}