-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email_notifications BOOLEAN DEFAULT FALSE,
  discord_notifications BOOLEAN DEFAULT TRUE,
  discord_dm_notifications BOOLEAN DEFAULT TRUE,
  discord_channel_notifications BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Add constraint to ensure one preference record per user
ALTER TABLE user_preferences ADD CONSTRAINT unique_user_preferences UNIQUE (user_id); 