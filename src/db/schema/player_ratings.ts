export interface PlayerRating {
    id: number; // Serial
    player_id: string; // UUID foreign key to players.id
    league_id: string; // UUID foreign key to leagues.id
    
    // Offensive ratings
    speed_rating: number | null;
    strength_rating: number | null;
    agility_rating: number | null;
    acceleration_rating: number | null;
    awareness_rating: number | null;
    catch_rating: number | null;
    carry_rating: number | null;
    throw_power_rating: number | null;
    throw_acc_rating: number | null;
    throw_acc_short_rating: number | null;
    throw_acc_mid_rating: number | null;
    throw_acc_deep_rating: number | null;
    route_run_short_rating: number | null;
    route_run_med_rating: number | null;
    route_run_deep_rating: number | null;
    release_rating: number | null;
    spec_catch_rating: number | null;
    cit_rating: number | null;
    break_tackle_rating: number | null;
    truck_rating: number | null;
    stiff_arm_rating: number | null;
    spin_move_rating: number | null;
    juke_move_rating: number | null;
    break_sack_rating: number | null;
    play_action_rating: number | null;
    throw_under_pressure_rating: number | null;
    throw_on_run_rating: number | null;
    lead_block_rating: number | null;
    impact_block_rating: number | null;
    run_block_rating: number | null;
    run_block_power_rating: number | null;
    run_block_finesse_rating: number | null;
    pass_block_rating: number | null;
    pass_block_power_rating: number | null;
    pass_block_finesse_rating: number | null;
    
    // Defensive ratings
    tackle_rating: number | null;
    hit_power_rating: number | null;
    pursuit_rating: number | null;
    play_rec_rating: number | null;
    zone_cover_rating: number | null;
    man_cover_rating: number | null;
    press_rating: number | null;
    block_shed_rating: number | null;
    power_moves_rating: number | null;
    finesse_moves_rating: number | null;
    
    // Special ratings
    kick_power_rating: number | null;
    kick_acc_rating: number | null;
    kick_ret_rating: number | null;
    
    // Physical attributes
    injury_rating: number | null;
    stamina_rating: number | null;
    toughness_rating: number | null;
    jump_rating: number | null;
    
    // Other attributes
    bcv_rating: number | null;
    change_of_direction_rating: number | null;
    
    created_at: Date;
    updated_at: Date | null;
  }