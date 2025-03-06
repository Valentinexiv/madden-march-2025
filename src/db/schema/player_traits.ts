export interface PlayerTrait {
    id: string; // UUID
    player_id: string; // UUID foreign key to players.id
    
    // Quarterback traits
    sense_pressure_trait: number | null;
    throw_away_trait: number | null;
    tight_spiral_trait: number | null;
    high_motor_trait: number | null;
    qb_style_trait: number | null;
    
    // Defensive traits
    predict_trait: number | null;
    play_ball_trait: number | null;
    big_hit_trait: number | null;
    strip_ball_trait: number | null;
    dl_bull_rush_trait: number | null;
    dl_swim_trait: number | null;
    dl_spin_trait: number | null;
    lb_style_trait: number | null;
    
    // Offensive traits
    fight_for_yards_trait: number | null;
    cover_ball_trait: number | null;
    drop_open_pass_trait: number | null;
    hp_catch_trait: number | null; // High point catch trait
    pos_catch_trait: number | null;
    yac_catch_trait: number | null;
    feet_in_bounds_trait: number | null;
    
    // General traits
    penalty_trait: number | null;
    clutch_trait: number | null;
    run_style: number | null;
    decision_maker_trait: number | null;
    
    created_at: Date | null;
    updated_at: Date | null;
  }