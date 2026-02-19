import { motion } from 'framer-motion';

const sections = [
    {
        title: '1. Information We Collect',
        body: `We collect information you provide directly — such as your name, email address, and GitHub repository URLs you submit for analysis. We also collect usage metadata including run logs, agent results, and performance metrics to improve our system. We do not access or store the contents of your source code beyond what is necessary to perform the analysis during an active agent run.`,
    },
    {
        title: '2. How We Use Your Information',
        body: `We use collected data solely to provide, maintain, and improve the Autonomous DevOps Agent service. This includes running agent pipelines on your behalf, generating fix reports, and calculating performance scores. We do not sell or share your personal data with third parties for advertising or marketing purposes.`,
    },
    {
        title: '3. Data Retention',
        body: `Agent run results and logs are retained for 90 days by default. You may request deletion of your data at any time by contacting our support team. Repository clones created by the agent are ephemeral and are destroyed immediately after each run completes.`,
    },
    {
        title: '4. Security',
        body: `We use industry-standard encryption in transit (TLS 1.3) and at rest (AES-256). Agent runs are executed in isolated, sandboxed environments with no persistent access to your infrastructure. API keys are hashed and never stored in plaintext.`,
    },
    {
        title: '5. Third-Party Services',
        body: `We use a limited set of infrastructure providers (cloud compute, monitoring) to operate our service. These providers are contractually bound to protect your data and may not use it for any purpose beyond operating our infrastructure.`,
    },
    {
        title: '6. Your Rights',
        body: `Depending on your jurisdiction, you may have rights to access, correct, or request deletion of data we hold about you. To exercise these rights, contact us at privacy@devopsagent.ai. We will respond within 30 days.`,
    },
    {
        title: '7. Changes to This Policy',
        body: `We may update this Privacy Policy occasionally. We will notify you of material changes via email or an in-app notice. Continued use of the service after changes take effect constitutes your acceptance of the revised policy.`,
    },
];

export default function Privacy() {
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
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
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
                    <a href="mailto:privacy@devopsagent.ai" className="text-primary hover:underline">
                        privacy@devopsagent.ai
                    </a>
                </motion.p>
            </div>
        </div>
    );
}
