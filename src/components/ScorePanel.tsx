import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Score } from '@/types/agent';

export default function ScorePanel({ score }: { score: Score }) {
  const pct = Math.min(100, Math.max(0, score.final_score));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-lg border border-glow bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="h-5 w-5 text-warning" />
        <h2 className="text-lg font-semibold font-mono text-foreground">Score Breakdown</h2>
      </div>

      <div className="flex items-center justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
          className="relative h-32 w-32 flex items-center justify-center"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-muted" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none" strokeWidth="8"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={`${(pct / 100) * 327} 327`}
              initial={{ strokeDasharray: '0 327' }}
              animate={{ strokeDasharray: `${(pct / 100) * 327} 327` }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </svg>
          <span className="text-3xl font-mono font-bold text-foreground">{score.final_score}</span>
        </motion.div>
      </div>

      <div className="space-y-2.5">
        <Row label="Base Score" value={`${score.base}`} color="text-foreground" />
        <Row label="Speed Bonus" value={score.speed_bonus > 0 ? `+${score.speed_bonus}` : '0'} color="text-success" />
        <Row label="Efficiency Penalty" value={score.efficiency_penalty > 0 ? `-${score.efficiency_penalty}` : '0'} color="text-destructive" />
        <div className="border-t border-border pt-2">
          <Row label="Final Score" value={`${score.final_score}`} color="text-primary" bold />
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono text-muted-foreground">{label}</span>
      <span className={`text-sm font-mono ${bold ? 'font-bold' : 'font-medium'} ${color}`}>{value}</span>
    </div>
  );
}
