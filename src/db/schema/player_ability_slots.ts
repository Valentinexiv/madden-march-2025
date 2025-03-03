// File: src/db/schema/player_ability_slots.ts
export interface PlayerAbilitySlot {
    id: string; // UUID
    player_id: string; // UUID foreign key to players.id
    league_id: string; // UUID foreign key to leagues.id
    ability_id: string | null; // UUID foreign key to player_abilities.id
    
    slot_index: number | null;
    locked: boolean | null;
    ovr_threshold: number | null;
    is_empty: boolean | null;
    
    created_at: Date;
    updated_at: Date | null;
  }