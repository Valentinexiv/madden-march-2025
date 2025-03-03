ALTER TABLE "weekly_defensive_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_defensive_stats" ALTER COLUMN "player_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_kicking_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_kicking_stats" ALTER COLUMN "player_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_passing_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_passing_stats" ALTER COLUMN "player_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_punting_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_punting_stats" ALTER COLUMN "player_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_receiving_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_receiving_stats" ALTER COLUMN "player_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_rushing_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_rushing_stats" ALTER COLUMN "player_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_team_stats" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "weekly_team_stats" ALTER COLUMN "team_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "league_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "home_team_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "away_team_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;