// File: src/db/schema/players.ts (updated with all 57 columns)
export interface Player {
  id: string; // UUID
  league_id: string; // UUID foreign key to leagues.id
  team_id: string | null; // UUID foreign key to teams.id
  roster_id: string; // The Madden roster identifier
  
  // Basic info
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  position: string | null;
  jersey_num: number | null;
  
  // Physical attributes
  height: number | null;
  weight: number | null;
  age: number | null;
  
  // Career info
  rookie_year: number | null;
  years_pro: number | null;
  college: string | null;
  home_state: number | null;
  home_town: string | null;
  birth_day: number | null;
  birth_month: number | null;
  birth_year: number | null;
  
  // Overalls and development
  player_best_ovr: number | null;
  player_scheme_ovr: number | null;
  team_scheme_ovr: number | null;
  dev_trait: number | null; // Development trait
  
  // Contract data
  contract_salary: number | null;
  contract_bonus: number | null;
  contract_years_left: number | null;
  contract_length: number | null;
  cap_hit: number | null;
  cap_release_penalty: number | null;
  cap_release_net_savings: number | null;
  desired_length: number | null;
  desired_salary: number | null;
  desired_bonus: number | null;
  re_sign_status: number | null;
  
  // Active status
  is_free_agent: boolean | null;
  is_on_practice_squad: boolean | null;
  is_on_ir: boolean | null;
  is_active: boolean | null;
  
  // Draft information
  draft_round: number | null;
  draft_pick: number | null;
  
  // Game-related data
  injury_type: number | null;
  injury_length: number | null;
  portrait_id: number | null;
  presentation_id: number | null;
  scheme: number | null;
  
  // Performance indicators
  legacy_score: number | null;
  experience_points: number | null;
  skill_points: number | null;
  
  // Grades
  physical_grade: number | null;
  intangible_grade: number | null;
  production_grade: number | null;
  durability_grade: number | null;
  size_grade: number | null;
  
  created_at: Date;
  updated_at: Date | null;
}