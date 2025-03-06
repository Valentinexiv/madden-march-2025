'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FaUser, FaDiscord, FaGamepad, FaHistory, FaCog } from 'react-icons/fa';

const profileNavItems = [
  {
    title: 'Profile',
    href: '/profile',
    icon: <FaUser className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Discord Connections',
    href: '/profile/discord',
    icon: <FaDiscord className="mr-2 h-4 w-4" />,
  },
  {
    title: 'My Leagues',
    href: '/profile/leagues',
    icon: <FaGamepad className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Activity',
    href: '/profile/activity',
    icon: <FaHistory className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Settings',
    href: '/profile/settings',
    icon: <FaCog className="mr-2 h-4 w-4" />,
  },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {profileNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md',
            pathname === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 