'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Vote,
  Users,
  Settings,
  BarChart3,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSidebar } from './sidebar-provider';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Elections',
    href: '/dashboard/elections',
    icon: Vote,
  },
  {
    name: 'Voters',
    href: '/dashboard/voters',
    icon: Users,
  },
  {
    name: 'Results',
    href: '/dashboard/results',
    icon: BarChart3,
  },
  {
    name: 'Audit Logs',
    href: '/dashboard/audit',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <div
      className={cn(
        'fixed left-0 top-8 h-[calc(100%-60px)] flex flex-col border border-l-0 bg-card transition-all duration-300 rounded-r-lg z-10',
        collapsed ? 'w-16' : 'w-64'
      )}
      suppressHydrationWarning
    >
      <div
        className={cn(
          'flex h-16 items-center justify-between border-b min-w-0',
          collapsed ? 'px-0 justify-center' : 'px-4'
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center min-w-0">
            <Image
              src="/logo.png"
              alt="Save Our Votes"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            'h-10 w-10 shrink-0',
            collapsed ? 'mx-auto' : 'ml-auto'
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav
        className={cn(
          'flex-1 space-y-1',
          collapsed ? 'pt-4 pb-0 px-0 flex flex-col items-center' : 'p-4'
        )}
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg text-sm font-medium transition-colors min-w-0 h-10',
                collapsed ? 'w-10 justify-center items-center mx-auto' : 'px-3',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div
        className={cn(
          'border-t flex items-center',
          collapsed ? 'pt-4 pb-4 px-0 justify-center' : 'p-4 justify-start'
        )}
      >
        <ThemeToggle />
      </div>
    </div>
  );
}
