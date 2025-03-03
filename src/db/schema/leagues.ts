// File: src/db/schema/leagues.ts
export interface League {
  id: string; // UUID
  user_id: string; // UUID foreign key to users.id
  name: string;
  league_identifier: string; // Custom identifier (e.g., "SVX")
  platform: string; // e.g., "xbsx", "ps5"
  madden_league_id: string;
  discord_server_id: string | null;
  import_url: string | null;
  last_import_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface LeagueMember {
  league_id: string; // UUID foreign key to leagues.id
  user_id: string; // UUID foreign key to users.id
  role: string; // 'commissioner', 'owner', 'member'
}