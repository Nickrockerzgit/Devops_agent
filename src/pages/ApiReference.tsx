import { motion } from 'framer-motion';
import { Terminal, Lock, Zap } from 'lucide-react';

const endpoints = [
    {
        method: 'POST',
        path: '/v1/runs',
        desc: 'Initiate a new autonomous agent run on a repository.',
        color: 'text-success bg-success/10 border-success/30',
    },
    {
        method: 'GET',
        path: '/v1/runs/:id',
        desc: 'Retrieve the status and results of an existing run.',
        color: 'text-primary bg-primary/10 border-primary/30',
    },
    {
        method: 'GET',
        path: '/v1/runs/:id/logs',
        desc: 'Stream real-time terminal logs from an active run.',
        color: 'text-primary bg-primary/10 border-primary/30',
    },
    {
        method: 'DELETE',
        path: '/v1/runs/:id',
        desc: 'Cancel a running agent job immediately.',
        color: 'text-destructive bg-destructive/10 border-destructive/30',
    },
    {
        method: 'GET',
        path: '/v1/repos',
        desc: 'List all repositories connected to your account.',
        color: 'text-primary bg-primary/10 border-primary/30',
    },
    {
        method: 'POST',
        path: '/v1/repos',
        desc: 'Connect a new GitHub repository to the agent platform.',
        color: 'text-success bg-success/10 border-success/30',
    },
];

export default function ApiReference() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-6xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-5">
                        API Reference
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        REST <span className="text-gradient">API Reference</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                        Integrate agent runs directly into your CI/CD workflow using our REST API.
                        All endpoints require Bearer token authentication.
                    </p>
                </motion.div>

                {/* Auth note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 mb-10"
                >
                    <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-mono font-semibold text-foreground">Authentication</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Pass your API key as a Bearer token:{' '}
                            <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                Authorization: Bearer YOUR_API_KEY
                            </code>
                        </p>
                    </div>
                </motion.div>

                {/* Base URL */}
                <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 flex items-center gap-3 mb-8 font-mono text-sm">
                    <Zap className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Base URL:</span>
                    <span className="text-foreground">https://api.devopsagent.ai</span>
                </div>

                {/* Endpoint list */}
                <div className="space-y-3">
                    {endpoints.map((ep, i) => (
                        <motion.div
                            key={ep.path}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.06 }}
                            className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-primary/40 transition-colors"
                        >
                            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest shrink-0 ${ep.color}`}>
                                {ep.method}
                            </span>
                            <code className="text-sm font-mono text-foreground shrink-0">{ep.path}</code>
                            <p className="text-sm text-muted-foreground sm:ml-auto">{ep.desc}</p>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Terminal className="h-3.5 w-3.5 text-primary/60" />
                                <span className="text-xs font-mono text-primary/60 hover:text-primary cursor-pointer transition-colors">
                                    Try it
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
