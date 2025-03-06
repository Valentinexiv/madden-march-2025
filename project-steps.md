# Implementation Plan

## Project Initialization
- [x] Step 1: Create Next.js 14 project with TypeScript
  - **Task**: Initialize a new Next.js 14 project with TypeScript and App Router
  - **Files**:
    - `package.json`: Basic project configuration
    - `tsconfig.json`: TypeScript configuration
    - `.gitignore`: Add standard Next.js ignores and .env.local
  - **Step Dependencies**: None


- [x] Step 2: Set up project folder structure
  - **Task**: Create necessary folders and structure for the application
  - **Files**:
    - `src/app`: Next.js app directory
    - `src/components`: Component directory for UI elements
    - `src/lib`: Utility functions and shared code
    - `src/db`: Database connections and ORM
    - `src/utils`: Helper utilities
  - **Step Dependencies**: Step 1
  - **User Instructions**: None

- [x] Step 3: Install core dependencies
  - **Task**: Install required dependencies for the project
  - **Files**:
    - `package.json`: Update with new dependencies
  - **Step Dependencies**: Step 1
  - **User Instructions**: Run the following:
    ```bash
    npm install @supabase/supabase-js drizzle-orm postgres @neondatabase/serverless
    npm install -D drizzle-kit
    npm install @tanstack/react-query zod framer-motion
    npm install react-hook-form @hookform/resolvers
    npm install date-fns recharts
    ```

- [x] Step 4: Configure environment variables
  - **Task**: Set up environment variables structure
  - **Files**:
    - `.env.local`: Create with placeholders
    - `.env.example`: Example env file without secrets
  - **Step Dependencies**: Step 1
  - **User Instructions**: Create `.env.local` with the following:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    ```

## Database Setup
- [x] Step 5: Set up Supabase connection
  - **Task**: Create Supabase client utility for database interactions
  - **Files**:
    - `src/lib/supabase/server.ts`: Server-side Supabase client
    - `src/lib/supabase/client.ts`: Client-side Supabase client
  - **Step Dependencies**: Step 4
  - **User Instructions**: Create a Supabase project and update `.env.local` with your credentials

- [x] Step 6: Configure Drizzle ORM
  - **Task**: Set up Drizzle ORM for database interactions
  - **Files**:
    - `src/db/index.ts`: Database connection configuration
    - `drizzle.config.ts`: Drizzle configuration file
  - **Step Dependencies**: Step 5
  - **User Instructions**: None

- [x] Step 7: Import database schema
  - **Task**: Import the previously created database schema
  - **Files**:
    - `src/db/schema.ts`: Database schema definitions
  - **Step Dependencies**: Step 6
  - **User Instructions**: Provide the schema.ts file created earlier

- [x] Step 8: Create database migration
  - **Task**: Create and run initial migration to set up database tables
  - **Files**:
    - `drizzle/migrations`: Generated migration files
  - **Step Dependencies**: Step 7
  - **User Instructions**: Run `npx drizzle-kit generate:pg` and then apply the migrations in your Supabase SQL editor

## Authentication
- [x] Step 9: Create authentication context
  - **Task**: Create context for Supabase authentication
  - **Files**:
    - `src/lib/auth/auth-context.tsx`: Authentication context provider
    - `src/lib/auth/hooks.ts`: Authentication hooks
  - **Step Dependencies**: Step 5
  - **User Instructions**: None

- [x] Step 10: Build sign in/sign up components
  - **Task**: Create authentication UI components
  - **Files**:
    - `src/components/auth/sign-in-form.tsx`: Sign in form component
    - `src/components/auth/sign-up-form.tsx`: Sign up form component
    - `src/components/auth/auth-form.tsx`: Shared form elements
  - **Step Dependencies**: Step 9
  - **User Instructions**: None

- [x] Step 11: Create authentication pages
  - **Task**: Create pages for sign in, sign up, and password reset
  - **Files**:
    - `src/app/(auth)/sign-in/page.tsx`: Sign in page
    - `src/app/(auth)/sign-up/page.tsx`: Sign up page
    - `src/app/(auth)/reset-password/page.tsx`: Password reset page
  - **Step Dependencies**: Step 10
  - **User Instructions**: None

- [x] Step 12: Implement authentication middleware
  - **Task**: Create middleware to protect routes and redirect unauthenticated users
  - **Files**:
    - `src/middleware.ts`: Next.js middleware for authentication
  - **Step Dependencies**: Step 9
  - **User Instructions**: None

## UI Framework
- [x] Step 13: Set up Shadcn UI
  - **Task**: Install and configure Shadcn UI components
  - **Files**:
    - `components.json`: Shadcn configuration
    - `src/lib/utils.ts`: Utility functions for UI
  - **Step Dependencies**: Step 3
  - **User Instructions**: Run `npx shadcn-ui@latest init` and follow the prompts

- [x] Step 14: Install essential UI components
  - **Task**: Add core Shadcn UI components
  - **Files**:
    - `src/components/ui`: Component directory
  - **Step Dependencies**: Step 13
  - **User Instructions**: Run the following commands:
    ```bash
    npx shadcn-ui@latest add button card form input toast dialog dropdown-menu avatar alert
    ```

- [x] Step 15: Create layout components
  - **Task**: Build reusable layout components
  - **Files**:
    - `src/components/layout/navbar.tsx`: Main navigation component
    - `src/components/layout/sidebar.tsx`: Sidebar navigation
    - `src/components/layout/page-header.tsx`: Page headers
    - `src/app/dashboard/layout.tsx`: Dashboard layout
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

## API Routes
- [x] Step 16: Create base API utilities
  - **Task**: Set up common API utilities and error handling
  - **Files**:
    - `src/lib/api-response.ts`: API response utilities
    - `src/lib/validation.ts`: Request validation utilities
  - **Step Dependencies**: Step 7
  - **User Instructions**: None

- [x] Step 17: Create League Teams API endpoint
  - **Task**: Implement API endpoint for receiving league teams data
  - **Files**:
    - `src/app/api/[userId]/[platform]/[leagueId]/leagueteams/route.ts`: API route
    - `src/lib/validators/team-validators.ts`: Validation schemas
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

- [x] Step 18: Create Standings API endpoint
  - **Task**: Implement API endpoint for receiving standings data
  - **Files**:
    - `src/app/api/[userId]/[platform]/[leagueId]/standings/route.ts`: API route
    - `src/lib/validators/standings-validators.ts`: Validation schemas
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

- [x] Step 19: Create Team Roster API endpoint
  - **Task**: Implement API endpoint for receiving roster data
  - **Files**:
    - `src/app/api/[userId]/[platform]/[leagueId]/team/[teamId]/roster/route.ts`: API route
    - `src/lib/validators/roster-validators.ts`: Validation schemas
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

- [x] Step 20: Create Weekly Stats API endpoint
  - **Task**: Implement API endpoint for receiving weekly stats
  - **Files**:
    - `src/app/api/[userId]/[platform]/[leagueId]/week/[weekType]/[weekNumber]/[dataType]/route.ts`: API route
    - `src/lib/validators/stats-validators.ts`: Validation schemas
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

- [x] Step 21: Create Free Agents API endpoint
  - **Task**: Implement API endpoint for receiving free agents data
  - **Files**:
    - `src/app/api/[userId]/[platform]/[leagueId]/freeagents/roster/route.ts`: API route
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

## Data Processing
- [ ] Step 22: Create data transformation utilities
  - **Task**: Create utilities to map JSON data to database schema
  - **Files**:
    - `src/lib/transformers/team-transformer.ts`: Team data transformer
    - `src/lib/transformers/player-transformer.ts`: Player data transformer
    - `src/lib/transformers/stats-transformer.ts`: Stats data transformer
  - **Step Dependencies**: Step 7, Step 16
  - **User Instructions**: None

- [x] Step 23: Implement database transaction utility
  - **Task**: Create utility for handling database transactions
  - **Files**:
    - `src/lib/db-transaction.ts`: Transaction utility
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

## League Management
- [x] Step 24: Create league creation functionality
  - **Task**: Implement database operations for creating leagues
  - **Files**:
    - `src/lib/actions/league-actions.ts`: League CRUD operations
  - **Step Dependencies**: Step 7
  - **User Instructions**: None

- [x] Step 25: Build League setup form
  - **Task**: Create form for league setup
  - **Files**:
    - `src/components/leagues/league-form.tsx`: League creation form
    - `src/lib/validators/league-validators.ts`: League validation schemas
  - **Step Dependencies**: Step 14, Step 24
  - **User Instructions**: None

- [x] Step 26: Create league settings page
  - **Task**: Create UI for managing league settings
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/settings/page.tsx`: Settings page
    - `src/components/leagues/league-settings.tsx`: Settings components
  - **Step Dependencies**: Step 25
  - **User Instructions**: None

## Dashboard Features
- [x] Step 27: Implement league list and creation page
  - **Task**: Create main page for listing and creating leagues
  - **Files**:
    - `src/app/dashboard/leagues/page.tsx`: Leagues list page
    - `src/components/leagues/league-card.tsx`: League card component
    - `src/components/leagues/create-league-button.tsx`: Create league button
  - **Step Dependencies**: Step 24, Step 25
  - **User Instructions**: None

- [ ] Step 28: Create league dashboard page
  - **Task**: Create main dashboard page for a league
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/page.tsx`: League dashboard
    - `src/components/leagues/league-header.tsx`: League header component
    - `src/components/leagues/league-stats-summary.tsx`: Stats summary component
  - **Step Dependencies**: Step 27
  - **User Instructions**: None

- [ ] Step 29: Build teams overview page
  - **Task**: Create page showing all teams in a league
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/teams/page.tsx`: Teams list page
    - `src/components/teams/team-card.tsx`: Team card component
    - `src/components/teams/teams-list.tsx`: Teams list component
  - **Step Dependencies**: Step 28
  - **User Instructions**: None

- [ ] Step 30: Create team detail page
  - **Task**: Create page showing detailed team information
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/teams/[teamId]/page.tsx`: Team page
    - `src/components/teams/team-header.tsx`: Team header component
    - `src/components/teams/team-stats.tsx`: Team stats component
  - **Step Dependencies**: Step 29
  - **User Instructions**: None

- [ ] Step 31: Implement roster page
  - **Task**: Create page showing team roster
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/teams/[teamId]/roster/page.tsx`: Roster page
    - `src/components/players/player-card.tsx`: Player card component
    - `src/components/players/roster-table.tsx`: Roster table component
  - **Step Dependencies**: Step 30
  - **User Instructions**: None

- [ ] Step 32: Create player detail page
  - **Task**: Create page showing detailed player information
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/players/[playerId]/page.tsx`: Player page
    - `src/components/players/player-header.tsx`: Player header component
    - `src/components/players/player-stats.tsx`: Player stats component
    - `src/components/players/player-ratings.tsx`: Player ratings component
  - **Step Dependencies**: Step 31
  - **User Instructions**: None

- [ ] Step 33: Implement standings page
  - **Task**: Create page showing league standings
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/standings/page.tsx`: Standings page
    - `src/components/standings/standings-table.tsx`: Standings table component
  - **Step Dependencies**: Step 28
  - **User Instructions**: None

- [ ] Step 34: Create schedule page
  - **Task**: Create page showing league schedule and game results
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/schedule/page.tsx`: Schedule page
    - `src/components/schedule/schedule-list.tsx`: Schedule list component
    - `src/components/schedule/game-card.tsx`: Game card component
  - **Step Dependencies**: Step 28
  - **User Instructions**: None

## Data Visualization
- [ ] Step 35: Create reusable chart components
  - **Task**: Build reusable chart components for data visualization
  - **Files**:
    - `src/components/charts/bar-chart.tsx`: Bar chart component
    - `src/components/charts/line-chart.tsx`: Line chart component
    - `src/components/charts/radar-chart.tsx`: Radar chart component
    - `src/components/charts/stat-card.tsx`: Stat card component
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

- [ ] Step 36: Implement team stats visualization
  - **Task**: Create visualizations for team performance metrics
  - **Files**:
    - `src/components/teams/team-stats-charts.tsx`: Team stats charts
  - **Step Dependencies**: Step 35
  - **User Instructions**: None

- [ ] Step 37: Create player comparison feature
  - **Task**: Implement feature to compare players side by side
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/players/compare/page.tsx`: Comparison page
    - `src/components/players/player-comparison.tsx`: Player comparison component
    - `src/components/players/player-selector.tsx`: Player selector component
  - **Step Dependencies**: Step 32, Step 35
  - **User Instructions**: None

- [ ] Step 38: Create league import instructions
  - **Task**: Create page with instructions for importing league data
  - **Files**:
    - `src/app/dashboard/leagues/[leagueId]/import/page.tsx`: Import page
    - `src/components/leagues/import-instructions.tsx`: Instructions component
    - `src/components/leagues/url-generator.tsx`: URL generator component
  - **Step Dependencies**: Step 26
  - **User Instructions**: None

## Discord Integration
- [ ] Step 39: Set up Discord OAuth
  - **Task**: Implement Discord authentication flow
  - **Files**:
    - `src/lib/discord/oauth.ts`: Discord OAuth utilities
    - `src/app/api/discord/auth/route.ts`: Discord auth endpoint
    - `src/app/api/discord/callback/route.ts`: Discord callback endpoint
  - **Step Dependencies**: Step 12
  - **User Instructions**: Create a Discord application in the Developer Portal and add your Discord Client ID and Secret to `.env.local`

- [ ] Step 40: Create Discord server selection UI
  - **Task**: Build UI for selecting Discord servers
  - **Files**:
    - `src/components/discord/server-selector.tsx`: Server selector component
    - `src/app/dashboard/leagues/[leagueId]/discord/page.tsx`: Discord setup page
  - **Step Dependencies**: Step 39
  - **User Instructions**: None

- [ ] Step 41: Implement Discord notification settings
  - **Task**: Create UI for configuring notifications
  - **Files**:
    - `src/components/discord/notification-settings.tsx`: Notification settings component
    - `src/lib/actions/discord-actions.ts`: Discord settings operations
  - **Step Dependencies**: Step 40
  - **User Instructions**: None

- [ ] Step 42: Create Discord notification service
  - **Task**: Implement service for sending Discord notifications
  - **Files**:
    - `src/lib/discord/webhook.ts`: Discord webhook utility
    - `src/lib/discord/templates.ts`: Notification templates
  - **Step Dependencies**: Step 41
  - **User Instructions**: None

## Subscription Management
- [ ] Step 43: Set up Stripe integration
  - **Task**: Implement Stripe for payment processing
  - **Files**:
    - `src/lib/stripe/client.ts`: Stripe client utility
  - **Step Dependencies**: Step 12
  - **User Instructions**: Create a Stripe account and add your Stripe secret key to `.env.local`

- [ ] Step 44: Create pricing page
  - **Task**: Build page showing subscription plans
  - **Files**:
    - `src/app/(marketing)/pricing/page.tsx`: Pricing page
    - `src/components/subscription/pricing-card.tsx`: Pricing card component
    - `src/components/subscription/checkout-button.tsx`: Checkout button component
  - **Step Dependencies**: Step 43
  - **User Instructions**: Set up subscription products in Stripe dashboard

- [ ] Step 45: Implement checkout flow
  - **Task**: Create checkout process for subscriptions
  - **Files**:
    - `src/app/api/stripe/checkout/route.ts`: Checkout API endpoint
    - `src/app/api/stripe/portal/route.ts`: Customer portal endpoint
  - **Step Dependencies**: Step 44
  - **User Instructions**: Configure success and cancel URLs in Stripe dashboard

- [ ] Step 46: Set up Stripe webhooks
  - **Task**: Implement webhook handling for Stripe events
  - **Files**:
    - `src/app/api/webhooks/stripe/route.ts`: Stripe webhook endpoint
    - `src/lib/stripe/webhook-handlers.ts`: Event handlers
  - **Step Dependencies**: Step 43
  - **User Instructions**: Set up webhook endpoint in Stripe dashboard and add webhook secret to `.env.local`

## Analytics and Performance
- [ ] Step 47: Integrate PostHog analytics
  - **Task**: Set up PostHog for user analytics
  - **Files**:
    - `src/lib/analytics/posthog.ts`: PostHog client
    - `src/app/layout.tsx`: Update to include analytics
  - **Step Dependencies**: Step 12
  - **User Instructions**: Create a PostHog account and add your API key to `.env.local`

- [ ] Step 48: Implement caching strategy
  - **Task**: Set up React Query for data fetching and caching
  - **Files**:
    - `src/lib/react-query/provider.tsx`: React Query provider
    - `src/lib/react-query/queries.ts`: Common query definitions
  - **Step Dependencies**: Step 27
  - **User Instructions**: None

- [ ] Step 49: Create optimized data loading hooks
  - **Task**: Build custom hooks for efficient data fetching
  - **Files**:
    - `src/lib/hooks/use-league-data.ts`: League data hook
    - `src/lib/hooks/use-team-data.ts`: Team data hook
    - `src/lib/hooks/use-player-data.ts`: Player data hook
  - **Step Dependencies**: Step 48
  - **User Instructions**: None

## Deployment and Finalization
- [ ] Step 50: Set up error boundary and 404 pages
  - **Task**: Create error handling UI
  - **Files**:
    - `src/app/not-found.tsx`: 404 page
    - `src/app/error.tsx`: Error page
    - `src/components/error-boundary.tsx`: Error boundary component
  - **Step Dependencies**: Step 15
  - **User Instructions**: None

- [ ] Step 51: Create landing page
  - **Task**: Build marketing landing page
  - **Files**:
    - `src/app/(marketing)/page.tsx`: Home page
    - `src/components/marketing/hero.tsx`: Hero section
    - `src/components/marketing/features.tsx`: Features section
    - `src/app/(marketing)/layout.tsx`: Marketing layout
  - **Step Dependencies**: Step 15
  - **User Instructions**: None

- [ ] Step 52: Configure deployment settings
  - **Task**: Prepare project for deployment
  - **Files**:
    - `next.config.js`: Next.js configuration
    - `vercel.json`: Vercel specific settings
  - **Step Dependencies**: All previous steps
  - **User Instructions**: Create a Vercel account and connect your GitHub repository

- [ ] Step 53: Create documentation
  - **Task**: Build documentation pages
  - **Files**:
    - `src/app/(marketing)/docs/page.tsx`: Documentation home
    - `src/app/(marketing)/docs/api/page.tsx`: API documentation
    - `src/app/(marketing)/docs/getting-started/page.tsx`: Getting started guide
  - **Step Dependencies**: Step 51
  - **User Instructions**: None