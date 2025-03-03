// File: src/db/schema/player_abilities.ts
export interface PlayerAbility {
    id: string; // UUID
    player_id: string; // UUID foreign key to players.id
    league_id: string; // UUID foreign key to leagues.id
    
    signature_title: string | null;
    signature_description: string | null;
    signature_logo_id: number | null;
    signature_activation_description: string | null;
    signature_deactivation_description: string | null;
    ability_rank: string | null;
    is_passive: boolean | null;
    is_unlocked: boolean | null;
    market_ability_alias: string | null;
    
    created_at: Date;
    updated_at: Date | null;
  }