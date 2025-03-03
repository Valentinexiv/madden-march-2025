// File: src/db/schema/teams.ts
export interface Team {
  id: string; // UUID
  league_id: string; // UUID foreign key to leagues.id
  team_id: string; // The Madden team identifier
  city_name: string | null;
  nick_name: string | null;
  abbr_name: string | null;
  display_name: string | null;
  div_name: string | null;
  logo_id: number | null;
  primary_color: number | null;
  secondary_color: number | null;
  ovr_rating: number | null;
  off_scheme: number | null;
  def_scheme: number | null;
  injury_count: number | null;
  user_name: string | null; // Name of user controlling this team
  created_at: Date;
  updated_at: Date;
}