// File: src/db/schema/leagues.ts
export interface League {
  id: string; // UUID
  owner: string; // UUID foreign key to users.id (changed from user_id)
  name: string;
  league_identifier: string; // Custom identifier (e.g., "SVX")
  platform: string; // e.g., "xbsx", "ps5"
  madden_league_id: string;
  discord_server_id: string | null;
  import_url: string | null;
  last_import_at: Date | null;
  created_at: Date;
  updated_at: Date;
  members: string | null; // UUID array of members
}

export interface LeagueMember {
  id: string; // UUID
  league_id: string; // UUID foreign key to leagues.id
  user_id: string; // UUID foreign key to users.id
  role: string; // 'commissioner', 'owner', 'member'
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_level: string | null;
  subscription_price_id: string | null;
  subscription_created_at: Date | null;
  subscription_current_period_end: Date | null;
  subscription_cancel_at_period_end: boolean | null;
  team_id: string | null;
  created_at: Date;
  updated_at: Date;
}