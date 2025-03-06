'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Trophy,
  Users,
  User,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth/auth-context';

type SidebarNavItem = {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  submenu?: boolean;
  subMenuItems?: { title: string; href: string }[];
};

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Leagues',
    href: '/leagues',
    icon: <Trophy className="h-5 w-5" />,
    submenu: true,
    subMenuItems: [
      { title: 'My Leagues', href: '/leagues' },
      { title: 'Create League', href: '/leagues/create' },
      { title: 'Join League', href: '/leagues/join' },
    ],
  },
  {
    title: 'Teams',
    href: '/teams',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Players',
    href: '/players',
    icon: <User className="h-5 w-5" />,
  },
  {
    title: 'Statistics',
    href: '/stats',
    icon: <BarChart3 className="h-5 w-5" />,
    submenu: true,
    subMenuItems: [
      { title: 'Team Stats', href: '/stats/teams' },
      { title: 'Player Stats', href: '/stats/players' },
      { title: 'Game Stats', href: '/stats/games' },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Initialize open state for submenus based on current path
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    sidebarNavItems.forEach((item) => {
      if (item.submenu && item.subMenuItems) {
        const isActive = item.subMenuItems.some(
          (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + '/')
        );
        initialOpenState[item.title] = isActive;
      }
    });
    setOpenMenus(initialOpenState);
  }, [pathname]);

  // Toggle submenu open/closed
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Check if a nav item is active
  const isNavItemActive = (item: SidebarNavItem) => {
    if (item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))) {
      return true;
    }
    if (item.submenu && item.subMenuItems) {
      return item.subMenuItems.some(
        (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + '/')
      );
    }
    return false;
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Madden March</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-4">
            {sidebarNavItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isNavItemActive(item) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {openMenus[item.title] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    {openMenus[item.title] && item.subMenuItems && (
                      <div className="ml-6 mt-1 grid gap-1">
                        {item.subMenuItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                              pathname === subItem.href && "bg-accent/50 font-medium text-accent-foreground"
                            )}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      isNavItemActive(item) && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-2 px-2">
            <div className="flex-1 text-sm">
              <p className="font-medium">{user?.user_metadata?.name || user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 