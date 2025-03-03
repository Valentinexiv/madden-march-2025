# Authentication System

This directory contains the authentication system for the Madden March application. It provides both client-side and server-side authentication utilities.

## Components

- `auth-context.tsx`: Provides a React context for authentication state and methods
- `hooks.ts`: Client-side hooks for authentication operations
- `server-auth.ts`: Server-side utilities for authentication

## Client-Side Authentication

The client-side authentication is handled through the `AuthProvider` component and the hooks in `hooks.ts`.

### AuthProvider

The `AuthProvider` component should be used to wrap your application to provide authentication context:

```tsx
import { AuthProvider } from '@/lib/auth/auth-context';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### Hooks

- `useAuth()`: Access the authentication context
- `useDiscordAuth()`: Handle Discord sign-in
- `useSignOut()`: Handle sign-out
- `useRequireAuth()`: Redirect if not authenticated (client-side)

Example usage:

```tsx
import { useAuth } from '@/lib/auth/auth-context';
import { useDiscordAuth } from '@/lib/auth/hooks';

export default function SignInButton() {
  const { user } = useAuth();
  const { handleDiscordSignIn, isLoading } = useDiscordAuth();

  if (user) {
    return <div>Signed in as {user.email}</div>;
  }

  return (
    <button onClick={handleDiscordSignIn} disabled={isLoading}>
      {isLoading ? 'Signing in...' : 'Sign in with Discord'}
    </button>
  );
}
```

## Server-Side Authentication

Server-side authentication is handled through the utilities in `server-auth.ts`.

### Functions

- `getServerSession()`: Get the current session
- `getServerUser()`: Get the current user
- `isAuthenticated()`: Check if the user is authenticated
- `requireAuth()`: Redirect if not authenticated (server-side)
- `redirectIfAuthenticated()`: Redirect if already authenticated

Example usage in a server component:

```tsx
import { requireAuth } from '@/lib/auth/server-auth';

export default async function ProtectedPage() {
  // This will redirect to /sign-in if not authenticated
  await requireAuth();

  return <div>Protected content</div>;
}
```

## Middleware

The application uses Next.js middleware (`src/middleware.ts`) to protect routes and handle redirects. The middleware:

1. Redirects unauthenticated users from protected routes to the sign-in page
2. Redirects authenticated users from auth routes to the dashboard
3. Handles API route authentication

## Authentication Flow

1. User visits a protected route
2. Middleware checks if the user is authenticated
3. If not authenticated, redirects to sign-in page
4. User signs in with Discord
5. After successful authentication, redirects back to the original route

## Protected Routes

The following routes are protected and require authentication:

- `/dashboard`
- `/leagues`
- `/profile`
- `/settings`
- API routes that contain user-specific data 