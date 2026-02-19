import { motion } from 'framer-motion';
import { Terminal, GitBranch, Cpu, Shield, Activity, FileCode } from 'lucide-react';

const sections = [
    {
        icon: GitBranch,
        title: 'Quick Start',
        desc: 'Get your first autonomous healing run in under 5 minutes.',
        items: ['Prerequisites', 'Connecting your repository', 'Running your first agent', 'Reading the results'],
    },
    {
        icon: Cpu,
        title: 'Agent Pipeline',
        desc: 'Deep dive into each agent phase and what it does.',
        items: ['Cloner Agent', 'Analyzer Agent', 'Patcher Agent', 'CI Monitor Agent', 'Result Aggregation'],
    },
    {
        icon: Terminal,
        title: 'CLI Reference',
        desc: 'All available commands and configuration flags.',
        items: ['agent run', 'agent status', 'agent config', 'agent logs'],
    },
    {
        icon: Shield,
        title: 'Security',
        desc: 'How we handle your code securely and privately.',
        items: ['Isolated environments', 'Branch scoping', 'Secret handling', 'Audit logs'],
    },
    {
        icon: Activity,
        title: 'Scoring System',
        desc: 'Understand how agent performance is measured.',
        items: ['Base score', 'Speed bonus', 'Efficiency penalty', 'Final calculation'],
    },
    {
        icon: FileCode,
        title: 'Bug Classification',
        desc: 'The taxonomy of bug types the agent detects and fixes.',
        items: ['LINTING', 'SYNTAX', 'LOGIC', 'TYPE_ERROR', 'IMPORT', 'INDENTATION'],
    },
];

export default function Documentation() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-6xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-5">
                        Documentation
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Everything you need to{' '}
                        <span className="text-gradient">build with agents</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
                        Comprehensive guides, references, and examples for integrating the Autonomous DevOps Agent into your pipeline.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sections.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.title}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 * i }}
                                className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <h2 className="text-sm font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                                        {s.title}
                                    </h2>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{s.desc}</p>
                                <ul className="space-y-1">
                                    {s.items.map((item) => (
                                        <li key={item} className="text-xs font-mono text-foreground/60 hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5">
                                            <span className="text-primary/50">→</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
