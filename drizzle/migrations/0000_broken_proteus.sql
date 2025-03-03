CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"week" integer NOT NULL,
	"season" integer NOT NULL,
	"status" text NOT NULL,
	"home_score" integer,
	"away_score" integer,
	"stats" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "standings" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"team_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"calendar_year" integer,
	"rank" integer,
	"prev_rank" integer,
	"seed" integer,
	"total_wins" integer,
	"total_losses" integer,
	"total_ties" integer,
	"win_pct" numeric(5, 3),
	"home_wins" integer,
	"home_losses" integer,
	"home_ties" integer,
	"away_wins" integer,
	"away_losses" integer,
	"away_ties" integer,
	"div_wins" integer,
	"div_losses" integer,
	"div_ties" integer,
	"conf_wins" integer,
	"conf_losses" integer,
	"conf_ties" integer,
	"pts_for" integer,
	"pts_against" integer,
	"net_pts" integer,
	"pts_for_rank" integer,
	"pts_against_rank" integer,
	"off_total_yds" integer,
	"off_total_yds_rank" integer,
	"def_total_yds" integer,
	"def_total_yds_rank" integer,
	"win_loss_streak" integer,
	"div_name" varchar(50),
	"division_id" varchar(20),
	"conference_id" varchar(20),
	"conference_name" varchar(50),
	"playoff_status" integer,
	"cap_available" bigint,
	"cap_spent" bigint,
	"cap_room" bigint,
	"team_ovr" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "standings_league_id_team_id_week_index_season_index_unique" UNIQUE("league_id","team_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "league_members" (
	"league_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "league_members_league_id_user_id_pk" PRIMARY KEY("league_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"platform" text NOT NULL,
	"commissioner_id" uuid NOT NULL,
	"season" integer NOT NULL,
	"week" integer NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"name" text NOT NULL,
	"abbreviation" text NOT NULL,
	"owner_id" uuid,
	"roster" jsonb DEFAULT '[]'::jsonb,
	"depth_chart" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"team_id" uuid,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"overall" integer NOT NULL,
	"age" integer NOT NULL,
	"attributes" jsonb DEFAULT '{}'::jsonb,
	"stats" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discord_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"guild_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"status" text NOT NULL,
	"plan" text NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_defensive_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"player_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"team_id" varchar(20),
	"def_total_tackles" integer,
	"def_sacks" numeric(5, 1),
	"def_ints" integer,
	"def_forced_fum" integer,
	"def_fum_rec" integer,
	"def_deflections" integer,
	"def_tds" integer,
	"def_safeties" integer,
	"def_int_return_yds" integer,
	"def_catch_allowed" integer,
	"def_pts" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_defensive_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "weekly_kicking_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"player_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"team_id" varchar(20),
	"fg_att" integer,
	"fg_made" integer,
	"fg_longest" integer,
	"fg_50_plus_att" integer,
	"fg_50_plus_made" integer,
	"xp_att" integer,
	"xp_made" integer,
	"kickoff_att" integer,
	"kickoff_tbs" integer,
	"fg_comp_pct" numeric(5, 1),
	"xp_comp_pct" numeric(5, 1),
	"kick_pts" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_kicking_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "weekly_passing_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"player_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"team_id" varchar(20),
	"pass_att" integer,
	"pass_comp" integer,
	"pass_yards" integer,
	"pass_tds" integer,
	"pass_ints" integer,
	"pass_sacks" integer,
	"pass_longest" integer,
	"passer_rating" numeric(5, 1),
	"pass_comp_pct" numeric(5, 1),
	"pass_yards_per_att" numeric(5, 1),
	"pass_yards_per_game" numeric(5, 1),
	"pass_pts" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_passing_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "weekly_punting_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"player_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"team_id" varchar(20),
	"punt_att" integer,
	"punt_yards" integer,
	"punt_longest" integer,
	"punts_in_20" integer,
	"punt_tbs" integer,
	"punts_blocked" integer,
	"punt_net_yards" integer,
	"punt_net_yards_per_att" numeric(5, 1),
	"punt_yards_per_att" numeric(5, 1),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_punting_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "weekly_receiving_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"player_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"team_id" varchar(20),
	"rec_catches" integer,
	"rec_yards" integer,
	"rec_tds" integer,
	"rec_yards_after_catch" integer,
	"rec_drops" integer,
	"rec_longest" integer,
	"rec_yards_per_catch" numeric(5, 1),
	"rec_catch_pct" numeric(5, 1),
	"rec_yac_per_catch" numeric(5, 1),
	"rec_yards_per_game" numeric(5, 1),
	"rec_to_pct" numeric(5, 1),
	"rec_pts" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_receiving_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "weekly_rushing_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"player_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"team_id" varchar(20),
	"rush_att" integer,
	"rush_yards" integer,
	"rush_tds" integer,
	"rush_yards_per_att" numeric(5, 1),
	"rush_broken_tackles" integer,
	"rush_longest" integer,
	"rush_20_plus_yds" integer,
	"rush_yards_after_contact" integer,
	"rush_fum" integer,
	"rush_yards_per_game" numeric(5, 1),
	"rush_to_pct" numeric(5, 1),
	"rush_pts" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_rushing_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "weekly_team_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"team_id" integer,
	"stat_id" varchar(20),
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"total_wins" integer,
	"total_losses" integer,
	"total_ties" integer,
	"seed" integer,
	"off_total_yards" integer,
	"off_pass_yards" integer,
	"off_rush_yards" integer,
	"off_pass_tds" integer,
	"off_rush_tds" integer,
	"off_pts_per_game" numeric(5, 1),
	"off_1st_downs" integer,
	"off_3rd_down_att" integer,
	"off_3rd_down_conv" integer,
	"off_3rd_down_conv_pct" numeric(5, 1),
	"off_4th_down_att" integer,
	"off_4th_down_conv" integer,
	"off_4th_down_conv_pct" numeric(5, 1),
	"off_red_zones" integer,
	"off_red_zone_tds" integer,
	"off_red_zone_fgs" integer,
	"off_red_zone_pct" numeric(5, 1),
	"def_total_yards" integer,
	"def_pass_yards" integer,
	"def_rush_yards" integer,
	"def_pts_per_game" numeric(5, 1),
	"def_red_zones" integer,
	"def_red_zone_tds" integer,
	"def_red_zone_fgs" integer,
	"def_red_zone_pct" numeric(5, 1),
	"penalties" integer,
	"penalty_yards" integer,
	"to_giveaways" integer,
	"to_takeaways" integer,
	"to_diff" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "weekly_team_stats_league_id_stat_id_week_index_season_index_unique" UNIQUE("league_id","stat_id","week_index","season_index")
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"schedule_id" varchar(20),
	"week_index" integer,
	"season_index" integer,
	"stage_index" integer,
	"home_team_id" varchar(20),
	"away_team_id" varchar(20),
	"home_score" integer,
	"away_score" integer,
	"status" integer,
	"is_game_of_the_week" boolean,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "schedules_league_id_schedule_id_unique" UNIQUE("league_id","schedule_id")
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_members" ADD CONSTRAINT "league_members_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_members" ADD CONSTRAINT "league_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_commissioner_id_users_id_fk" FOREIGN KEY ("commissioner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discord_integrations" ADD CONSTRAINT "discord_integrations_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_defensive_stats" ADD CONSTRAINT "weekly_defensive_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_defensive_stats" ADD CONSTRAINT "weekly_defensive_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_kicking_stats" ADD CONSTRAINT "weekly_kicking_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_kicking_stats" ADD CONSTRAINT "weekly_kicking_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_passing_stats" ADD CONSTRAINT "weekly_passing_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_passing_stats" ADD CONSTRAINT "weekly_passing_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_punting_stats" ADD CONSTRAINT "weekly_punting_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_punting_stats" ADD CONSTRAINT "weekly_punting_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_receiving_stats" ADD CONSTRAINT "weekly_receiving_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_receiving_stats" ADD CONSTRAINT "weekly_receiving_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_rushing_stats" ADD CONSTRAINT "weekly_rushing_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_rushing_stats" ADD CONSTRAINT "weekly_rushing_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_team_stats" ADD CONSTRAINT "weekly_team_stats_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_team_stats" ADD CONSTRAINT "weekly_team_stats_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_standings_league_team" ON "standings" USING btree ("league_id","team_id");--> statement-breakpoint
CREATE INDEX "idx_standings_week" ON "standings" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_defensive_stats_league_player" ON "weekly_defensive_stats" USING btree ("league_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_defensive_stats_week" ON "weekly_defensive_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_kicking_stats_league_player" ON "weekly_kicking_stats" USING btree ("league_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_kicking_stats_week" ON "weekly_kicking_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_passing_stats_league_player" ON "weekly_passing_stats" USING btree ("league_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_passing_stats_week" ON "weekly_passing_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_punting_stats_league_player" ON "weekly_punting_stats" USING btree ("league_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_punting_stats_week" ON "weekly_punting_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_receiving_stats_league_player" ON "weekly_receiving_stats" USING btree ("league_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_receiving_stats_week" ON "weekly_receiving_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_rushing_stats_league_player" ON "weekly_rushing_stats" USING btree ("league_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_rushing_stats_week" ON "weekly_rushing_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_weekly_team_stats_league_team" ON "weekly_team_stats" USING btree ("league_id","team_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_team_stats_week" ON "weekly_team_stats" USING btree ("league_id","week_index","season_index");--> statement-breakpoint
CREATE INDEX "idx_schedules_league" ON "schedules" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "idx_schedules_week" ON "schedules" USING btree ("league_id","week_index","season_index");