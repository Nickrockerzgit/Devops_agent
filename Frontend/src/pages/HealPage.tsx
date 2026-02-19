import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Download } from 'lucide-react';
import type { AgentResults, AgentPhase } from '@/types/agent';
import { simulateAgentRun } from '@/lib/agent-simulation';
import RunForm from '@/components/RunForm';
import TerminalLog from '@/components/TerminalLog';
import RunSummaryCard from '@/components/RunSummaryCard';
import ScorePanel from '@/components/ScorePanel';
import FixesTable from '@/components/FixesTable';
import CITimeline from '@/components/CITimeline';

const HealPage = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [phase, setPhase] = useState<AgentPhase>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [results, setResults] = useState<AgentResults | null>(null);

    const handleRun = useCallback(
        async (repoUrl: string, teamName: string, teamLeader: string) => {
            setIsRunning(true);
            setResults(null);
            setLogs([]);
            setPhase('idle');

            const res = await simulateAgentRun(repoUrl, teamName, teamLeader, 5, (p, log) => {
                setPhase(p);
                setLogs((prev) => [...prev, log]);
            });

            setResults(res);
            setIsRunning(false);
        },
        [],
    );

    const downloadResults = () => {
        if (!results) return;
        const blob = new Blob([JSON.stringify(results, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'results.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-background bg-grid">
            {/* Sticky Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center"
                            style={{ boxShadow: 'var(--glow-primary)' }}
                        >
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-base font-mono font-bold text-foreground tracking-tight">
                                AUTONOMOUS DEVOPS AGENT
                            </h2>
                            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                                Multi-Agent AI Pipeline
                            </p>
                        </div>
                    </div>
                    {results && (
                        <button
                            onClick={downloadResults}
                            className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary transition-colors"
                        >
                            <Download className="h-3.5 w-3.5" />
                            results.json
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
                <RunForm onSubmit={handleRun} isRunning={isRunning} />

                <AnimatePresence>
                    {logs.length > 0 && <TerminalLog logs={logs} phase={phase} />}
                </AnimatePresence>

                {results && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <RunSummaryCard results={results} />
                            </div>
                            <ScorePanel score={results.score} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <FixesTable fixes={results.fixes} />
                            </div>
                            <CITimeline timeline={results.timeline} retryLimit={results.retry_limit} />
                        </div>
                    </motion.div>
                )}

                {/* Idle helper text */}
                {!isRunning && !results && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
                            <Bot className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-mono text-muted-foreground">
                            Enter a repository URL to begin autonomous analysis
                        </p>
                        <span className="inline-block w-2 h-4 bg-primary/50 animate-terminal-blink mt-2" />
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default HealPage;
