// File: src/db/schema/players.ts (updated with all 57 columns)
export interface Player {
  id: string; // UUID
  league_id: string | null; // UUID foreign key to leagues.id
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
  home_town: string | null;
  home_state: number | null;
  birth_day: number | null;
  birth_month: number | null;
  birth_year: number | null;
  
  // Overalls and development
  player_best_ovr: number | null;
  player_scheme_ovr: number | null;
  team_scheme_ovr: number | null;
  legacy_score: number | null;
  portrait_id: number | null;
  presentation_id: number | null;
  
  // Active status
  is_active: boolean | null;
  is_on_practice_squad: boolean | null;
  is_on_ir: boolean | null;
  is_free_agent: boolean | null;
  
  // Development and scheme
  dev_trait: number | null; // Development trait
  scheme: number | null;
  
  // Contract data
  contract_salary: number | null;
  contract_bonus: number | null;
  contract_years_left: number | null;
  contract_length: number | null;
  re_sign_status: number | null;
  desired_salary: number | null;
  desired_bonus: number | null;
  desired_length: number | null;
  cap_hit: number | null;
  cap_release_penalty: number | null;
  cap_release_net_savings: number | null;
  
  created_at: Date | null;
  updated_at: Date | null;
}