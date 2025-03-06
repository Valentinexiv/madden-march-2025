import { Metadata } from 'next';
import { ProfileNav } from '@/components/auth/profile-nav';

export const metadata: Metadata = {
  title: 'Profile | Madden March 2025',
  description: 'Manage your Madden March 2025 profile and preferences',
};

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 shrink-0">
          <ProfileNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 