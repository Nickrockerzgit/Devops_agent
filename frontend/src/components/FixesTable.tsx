import { motion } from 'framer-motion';
import { FileCode } from 'lucide-react';
import type { Fix } from '@/types/agent';
import { FixStatusBadge, BugTypeBadge } from './StatusBadge';
import { formatFixDescription } from '@/types/agent';

export default function FixesTable({ fixes }: { fixes: Fix[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-lg border border-glow bg-card overflow-hidden"
    >
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <FileCode className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold font-mono text-foreground">Fixes Applied</h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground">{fixes.length} total</span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">File</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">Bug Type</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">Line</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">Commit Message</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {fixes.map((fix, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-foreground">{fix.file}</td>
                <td className="px-4 py-3"><BugTypeBadge type={fix.bug_type} /></td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{fix.line}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground max-w-xs truncate">{fix.commit_message}</td>
                <td className="px-4 py-3"><FixStatusBadge status={fix.status} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border/50">
        {fixes.map((fix, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-foreground">{fix.file}:{fix.line}</span>
              <FixStatusBadge status={fix.status} />
            </div>
            <div className="flex items-center gap-2">
              <BugTypeBadge type={fix.bug_type} />
            </div>
            <p className="text-[11px] font-mono text-muted-foreground">{formatFixDescription(fix)}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
