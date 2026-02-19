import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import type { TimelineEntry } from '@/types/agent';
import { CIStatusBadge } from './StatusBadge';

export default function CITimeline({ timeline, retryLimit }: { timeline: TimelineEntry[]; retryLimit: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-lg border border-glow bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Activity className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold font-mono text-foreground">CI/CD Timeline</h2>
      </div>

      <div className="relative pl-6 space-y-0">
        {/* vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

        {timeline.map((entry, i) => {
          const isLast = i === timeline.length - 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="relative pb-6 last:pb-0"
            >
              {/* dot */}
              <div className={`absolute -left-6 top-1 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center ${
                entry.status === 'PASSED'
                  ? 'border-success bg-success/20'
                  : 'border-destructive bg-destructive/20'
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  entry.status === 'PASSED' ? 'bg-success' : 'bg-destructive'
                } ${isLast && entry.status === 'PASSED' ? 'animate-pulse' : ''}`} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-foreground">
                    Iteration {entry.iteration}/{retryLimit}
                  </span>
                  <CIStatusBadge status={entry.status} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground sm:ml-auto">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
