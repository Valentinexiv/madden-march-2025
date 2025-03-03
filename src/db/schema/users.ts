// File: src/db/schema/users.ts
export interface User {
  id: string; // UUID
  username: string;
  email: string;
  discord_id: string | null;
  discord_username: string | null;
  created_at: Date;
  updated_at: Date;
}