import { motion } from 'framer-motion';

const systems = [
    { name: 'Agent API', uptime: '99.98%', status: 'Operational' },
    { name: 'CI/CD Runner', uptime: '99.95%', status: 'Operational' },
    { name: 'Repository Cloner', uptime: '100%', status: 'Operational' },
    { name: 'Fix Generation Engine', uptime: '99.91%', status: 'Operational' },
    { name: 'Score & Analytics', uptime: '100%', status: 'Operational' },
    { name: 'Webhook Delivery', uptime: '99.87%', status: 'Degraded Performance', degraded: true },
];

const incidents = [
    {
        date: 'Feb 12, 2026',
        title: 'Webhook delivery delays — resolved',
        body: 'Webhook delivery latency spiked briefly due to an upstream infrastructure event. Fully resolved within 14 minutes.',
        resolved: true,
    },
    {
        date: 'Jan 30, 2026',
        title: 'Fix generation engine latency — resolved',
        body: 'Model inference latency was elevated for 22 minutes. Auto-scaled and resolved.',
        resolved: true,
    },
];

export default function Status() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-3xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        System <span className="text-gradient">Status</span>
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Real-time status of all Autonomous DevOps Agent services.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <span className="text-sm font-mono text-success">All core systems operational</span>
                    </div>
                </motion.div>

                {/* System list */}
                <div className="rounded-xl border border-border bg-card overflow-hidden mb-10">
                    <div className="px-5 py-3 border-b border-border bg-muted/30">
                        <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Services — 30-day uptime</p>
                    </div>
                    {systems.map((sys, i) => (
                        <motion.div
                            key={sys.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 * i }}
                            className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={`h-2 w-2 rounded-full shrink-0 ${sys.degraded ? 'bg-warning animate-pulse-slow' : 'bg-success animate-pulse'
                                        }`}
                                />
                                <span className="text-sm font-mono text-foreground">{sys.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-muted-foreground">{sys.uptime}</span>
                                <span
                                    className={`text-xs font-mono font-semibold ${sys.degraded ? 'text-warning' : 'text-success'
                                        }`}
                                >
                                    {sys.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Past incidents */}
                <div>
                    <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mb-4">
                        Recent Incidents
                    </p>
                    <div className="space-y-4">
                        {incidents.map((inc, i) => (
                            <motion.div
                                key={inc.title}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.08 }}
                                className="rounded-xl border border-border bg-card p-5"
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="text-sm font-mono font-semibold text-foreground">{inc.title}</h3>
                                    <span className="text-[10px] font-mono text-success bg-success/10 border border-success/30 rounded-full px-2 py-0.5 shrink-0">
                                        Resolved
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{inc.body}</p>
                                <p className="text-[10px] font-mono text-muted-foreground mt-2">{inc.date}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
