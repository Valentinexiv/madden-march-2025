import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  separator?: boolean;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  separator = true,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      {separator && <Separator />}
    </div>
  );
}

interface PageHeaderActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeaderActions({
  children,
  className,
}: PageHeaderActionsProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {children}
    </div>
  );
}

interface PageHeaderBreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeaderBreadcrumbs({
  children,
  className,
}: PageHeaderBreadcrumbsProps) {
  return (
    <div className={cn('mb-2 flex items-center text-sm text-muted-foreground', className)}>
      {children}
    </div>
  );
}

interface PageHeaderTabsProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeaderTabs({
  children,
  className,
}: PageHeaderTabsProps) {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
} 