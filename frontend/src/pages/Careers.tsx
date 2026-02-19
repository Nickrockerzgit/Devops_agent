import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const roles = [
    { title: 'Senior AI/ML Engineer', team: 'Core AI', location: 'Remote', type: 'Full-time' },
    { title: 'Frontend Engineer (React/TypeScript)', team: 'Product', location: 'Remote', type: 'Full-time' },
    { title: 'DevOps Platform Engineer', team: 'Infrastructure', location: 'Remote', type: 'Full-time' },
    { title: 'Technical Writer', team: 'Developer Experience', location: 'Remote', type: 'Contract' },
];

export default function Careers() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-6xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14 max-w-2xl mx-auto"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-5">
                        Careers
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Build the future of <span className="text-gradient">autonomous software</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground text-lg">
                        We're a small, focused team solving a hard problem. If you want your work to matter, come build with us.
                    </p>
                </motion.div>

                <div className="space-y-4 max-w-3xl mx-auto">
                    {roles.map((role, i) => (
                        <motion.div
                            key={role.title}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors group cursor-pointer"
                        >
                            <div className="space-y-1">
                                <h2 className="text-base font-semibold font-mono text-foreground group-hover:text-primary transition-colors">
                                    {role.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
                                    <span className="bg-muted border border-border rounded px-2 py-0.5">{role.team}</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />{role.location}
                                    </span>
                                    <span>{role.type}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-primary shrink-0">
                                <span className="text-xs font-mono">Apply</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-muted-foreground mt-10 font-mono"
                >
                    Don't see a fit?{' '}
                    <a href="mailto:careers@devopsagent.ai" className="text-primary hover:underline">
                        Send us your resume anyway.
                    </a>
                </motion.p>
            </div>
        </div>
    );
}
