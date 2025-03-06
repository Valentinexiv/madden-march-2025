// File: src/db/schema/player_abilities.ts
export interface PlayerAbility {
    id: string; // UUID
    player_id: string; // UUID foreign key to players.id
    slot_id: string; // UUID foreign key to player_ability_slots.id
    
    ability_title: string | null;
    ability_description: string | null;
    ability_logo_id: number | null;
    ability_rank: string | null;
    
    is_passive: boolean | null;
    is_unlocked: boolean | null;
    
    unlock_requirement: string | null;
    activation_description: string | null;
    deactivation_description: string | null;
    
    created_at: Date | null;
    updated_at: Date | null;
  }