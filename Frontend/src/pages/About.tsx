import { motion } from 'framer-motion';
import { Cpu, GitBranch, Shield, Zap, Target, Globe } from 'lucide-react';

const stats = [
    { value: '50K+', label: 'Bugs Auto-Fixed' },
    { value: '2,000+', label: 'Repos Healed' },
    { value: '99.4%', label: 'Uptime SLA' },
    { value: '< 2 min', label: 'Avg. Resolution' },
];

const values = [
    {
        icon: Target,
        title: 'Mission',
        body:
            'To eliminate the human bottleneck in CI/CD pipelines — giving engineering teams back the time they spend debugging failed builds, so they can focus on building.',
    },
    {
        icon: Globe,
        title: 'Vision',
        body:
            'A world where software deployments are self-healing. Where broken pipelines are a solved problem, not a 2am wake-up call.',
    },
    {
        icon: Shield,
        title: 'Principles',
        body:
            'Transparency of agent reasoning. Auditability of every commit. Zero compromise on code quality. These are non-negotiable.',
    },
];

const agents = [
    { icon: GitBranch, name: 'Cloner Agent', desc: 'Forks & clones repositories with full history.' },
    { icon: Cpu, name: 'Analyzer Agent', desc: 'Scans source for failures, classifies bug types.' },
    { icon: Zap, name: 'Patcher Agent', desc: 'Generates targeted, minimal code fixes per bug.' },
    { icon: Shield, name: 'CI Monitor Agent', desc: 'Watches pipeline runs and triggers re-runs.' },
];

export default function About() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-6xl mx-auto px-4 py-20 space-y-24">

                {/* Hero block */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-6">
                        Built by engineers, for engineers
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        About{' '}
                        <span className="text-gradient">Autonomous DevOps Agent</span>
                    </h1>
                    <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                        We built a multi-agent AI system that detects, classifies, patches, and validates
                        code failures — autonomously, without human intervention.
                    </p>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="rounded-xl border border-border bg-card p-6 text-center"
                        >
                            <div className="text-3xl font-bold text-foreground">{s.value}</div>
                            <div className="text-sm text-muted-foreground mt-1 font-mono">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mission / Vision / Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {values.map((v, i) => {
                        const Icon = v.icon;
                        return (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4"
                                    style={{ boxShadow: 'var(--glow-accent)' }}>
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-base font-mono font-bold text-foreground mb-2">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Agent roster */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold font-mono text-foreground mb-6 text-center">
                        The Agent Pipeline
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {agents.map((a, i) => {
                            const Icon = a.icon;
                            return (
                                <motion.div
                                    key={a.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    className="rounded-lg border border-border bg-muted/40 p-4 flex flex-col gap-2"
                                >
                                    <Icon className="h-5 w-5 text-primary" />
                                    <p className="text-sm font-mono font-semibold text-foreground">{a.name}</p>
                                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
