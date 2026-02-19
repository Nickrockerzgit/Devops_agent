import { cn } from '@/lib/utils';
import type { CIStatus, FixStatus, BugType } from '@/types/agent';

export function CIStatusBadge({ status }: { status: CIStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold tracking-wider',
      status === 'PASSED'
        ? 'bg-success/15 text-success border border-success/30'
        : 'bg-destructive/15 text-destructive border border-destructive/30'
    )}>
      <span className={cn(
        'h-2 w-2 rounded-full',
        status === 'PASSED' ? 'bg-success animate-pulse' : 'bg-destructive'
      )} />
      {status}
    </span>
  );
}

export function FixStatusBadge({ status }: { status: FixStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-mono font-medium',
      status === 'Fixed' ? 'text-success' : 'text-destructive'
    )}>
      {status === 'Fixed' ? '✓' : '✗'} {status}
    </span>
  );
}

export function BugTypeBadge({ type }: { type: BugType }) {
  const colors: Record<BugType, string> = {
    LINTING: 'bg-warning/15 text-warning border-warning/30',
    SYNTAX: 'bg-destructive/15 text-destructive border-destructive/30',
    LOGIC: 'bg-accent/15 text-accent border-accent/30',
    TYPE_ERROR: 'bg-primary/15 text-primary border-primary/30',
    IMPORT: 'bg-muted text-muted-foreground border-border',
    INDENTATION: 'bg-secondary text-secondary-foreground border-border',
  };
  return (
    <span className={cn(
      'inline-flex rounded px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider border',
      colors[type]
    )}>
      {type}
    </span>
  );
}
