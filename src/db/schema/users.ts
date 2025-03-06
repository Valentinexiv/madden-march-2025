// File: src/db/schema/users.ts
export interface User {
  id: string; // UUID
  email: string | null;
  discord_id: string | null;
  username: string | null;
  avatar: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}