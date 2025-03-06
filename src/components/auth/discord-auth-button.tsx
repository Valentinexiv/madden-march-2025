'use client';

import { Button } from '@/components/ui/button';
import { useDiscordAuth } from '@/lib/auth/hooks';
import { FaDiscord } from 'react-icons/fa';

interface DiscordAuthButtonProps {
  className?: string;
}

export function DiscordAuthButton({
  className = '',
}: DiscordAuthButtonProps) {
  const { handleDiscordSignIn, isLoading } = useDiscordAuth();

  return (
    <Button
      onClick={handleDiscordSignIn}
      disabled={isLoading}
      className={`bg-[#5865F2] hover:bg-[#4752C4] text-white ${className}`}
    >
      <FaDiscord className="mr-2 h-5 w-5" />
      {isLoading ? 'Connecting...' : 'Sign in with Discord'}
    </Button>
  );
} 