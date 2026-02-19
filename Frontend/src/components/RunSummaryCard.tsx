import { motion } from 'framer-motion';
import { GitBranch, Bug, Wrench, Clock, IterationCw } from 'lucide-react';
import type { AgentResults } from '@/types/agent';
import { CIStatusBadge } from './StatusBadge';

export default function RunSummaryCard({ results }: { results: AgentResults }) {
  const items = [
    { icon: GitBranch, label: 'Branch', value: results.branch_name },
    { icon: Bug, label: 'Failures Detected', value: results.total_failures },
    { icon: Wrench, label: 'Fixes Applied', value: results.total_fixes_applied },
    { icon: IterationCw, label: 'Iterations', value: `${results.iterations_used}/${results.retry_limit}` },
    { icon: Clock, label: 'Total Time', value: `${results.total_time_seconds}s` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-lg border border-glow bg-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-mono text-foreground">Run Summary</h2>
        <CIStatusBadge status={results.ci_cd_status} />
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-xs font-mono text-muted-foreground truncate">
          {results.repository}
        </p>
        <p className="text-xs font-mono text-muted-foreground">
          {results.team_name} • {results.team_leader}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-md bg-muted/50 border border-border p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-mono font-semibold text-foreground truncate">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
