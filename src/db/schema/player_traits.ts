export interface PlayerTrait {
    id: string; // UUID
    player_id: string; // UUID foreign key to players.id
    league_id: string; // UUID foreign key to leagues.id
    
    // Quarterback traits
    tight_spiral_trait: number | null;
    sense_pressure_trait: number | null;
    throw_away_trait: number | null;
    high_motor_trait: number | null;
    qb_style_trait: number | null;
    
    // Defensive traits
    strip_ball_trait: number | null;
    play_ball_trait: number | null;
    big_hit_trait: number | null;
    dl_bull_rush_trait: number | null;
    dl_swim_trait: number | null;
    dl_spin_trait: number | null;
    lb_style_trait: number | null;
    
    // Offensive traits
    drops_open_pass_trait: number | null;
    break_tackle_trait: number | null;
    fight_for_yards_trait: number | null;
    hpc_trait: number | null; // High point catch trait
    pos_catch_trait: number | null;
    rac_catch_trait: number | null;
    feet_in_bounds_trait: number | null;
    cover_ball_trait: number | null;
    
    // General traits
    clutch_trait: number | null;
    penalty_trait: number | null;
    predict_trait: number | null;
    run_style: number | null;
    
    created_at: Date;
    updated_at: Date | null;
  }