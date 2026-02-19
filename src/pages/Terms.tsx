import { motion } from 'framer-motion';

const sections = [
    {
        title: '1. Acceptance of Terms',
        body: `By accessing or using the Autonomous DevOps Agent service ("Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service. These terms apply to all users, including individuals and organizations.`,
    },
    {
        title: '2. Use of the Service',
        body: `You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to submit repositories containing malicious code, circumvent rate limits, or engage in any activity that disrupts the integrity of our platform or other users' agent runs.`,
    },
    {
        title: '3. Account Responsibilities',
        body: `You are responsible for maintaining the confidentiality of your API keys and account credentials. You are liable for all activity that occurs under your account. Notify us immediately at security@devopsagent.ai if you suspect unauthorized access.`,
    },
    {
        title: '4. Intellectual Property',
        body: `The Service, including its software, branding, UI design, and agent pipeline architecture, is the exclusive property of Autonomous DevOps Agent and its licensors. You retain ownership of your source code at all times. Agent-generated fixes are provided as suggestions — you retain full ownership and responsibility for any changes merged into your repositories.`,
    },
    {
        title: '5. Limitation of Liability',
        body: `The Service is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from agent runs, including code changes, failed CI pipelines, or data loss. Your use of agent-generated fixes is at your own discretion and risk.`,
    },
    {
        title: '6. Termination',
        body: `We reserve the right to suspend or terminate your account if you violate these Terms. You may cancel your subscription at any time from your account dashboard. Upon termination, your data will be retained for 30 days before deletion unless otherwise requested.`,
    },
    {
        title: '7. Modifications',
        body: `We may revise these Terms at any time. We will provide at least 14 days notice prior to material changes taking effect. Continued use of the Service after the effective date constitutes acceptance of the modified Terms.`,
    },
    {
        title: '8. Governing Law',
        body: `These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes shall be resolved through binding arbitration, except where prohibited by local law.`,
    },
];

export default function Terms() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-3xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-5">
                        Legal
                    </span>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
                    <p className="mt-3 text-muted-foreground text-sm font-mono">
                        Effective date: February 1, 2026
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="rounded-xl border border-border bg-card p-6"
                        >
                            <h2 className="text-base font-mono font-bold text-foreground mb-3">{s.title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 text-xs font-mono text-muted-foreground text-center"
                >
                    Questions? Contact us at{' '}
                    <a href="mailto:legal@devopsagent.ai" className="text-primary hover:underline">
                        legal@devopsagent.ai
                    </a>
                </motion.p>
            </div>
        </div>
    );
}
