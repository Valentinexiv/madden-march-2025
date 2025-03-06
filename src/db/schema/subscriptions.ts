// File: src/db/schema/subscriptions.ts
export interface Subscription {
  id: string; // UUID
  user_id: string; // UUID foreign key to users.id
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  plan: string;
  current_period_end: Date;
  created_at: Date;
  updated_at: Date;
}