import { AuthStatus } from '@/components/auth/auth-status';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Madden March 2025</h1>
        <p className="text-lg text-gray-600">Your Madden franchise data dashboard</p>
      </header>

      <main className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Authentication Status</h2>
        <div className="p-4 border rounded">
          <AuthStatus />
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Madden March. All rights reserved.</p>
      </footer>
    </div>
  );
}
