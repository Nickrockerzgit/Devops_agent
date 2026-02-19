import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface TerminalLogProps {
  logs: string[];
  phase: string;
}

export default function TerminalLog({ logs, phase }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-glow bg-card overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-xs font-mono text-muted-foreground">agent-terminal</span>
        <span className="ml-auto text-[10px] font-mono text-primary uppercase tracking-widest">
          {phase.replace('_', ' ')}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="p-4 max-h-64 overflow-y-auto bg-background/50 scanline"
      >
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-mono leading-6 text-foreground/80"
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="inline-block w-2 h-4 bg-primary animate-terminal-blink ml-1" />
      </div>
    </motion.div>
  );
}
