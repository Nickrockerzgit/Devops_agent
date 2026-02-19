import { motion } from 'framer-motion';
import { Check, Zap, Shield, Building2 } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: '$0',
        period: '/month',
        description: 'Perfect for solo developers exploring AI-driven CI/CD healing.',
        icon: Zap,
        features: [
            '5 agent runs / month',
            'Up to 3 repositories',
            'Basic bug classification',
            'Terminal log output',
            'Community support',
        ],
        cta: 'Get Started Free',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For teams that need fast, reliable automated healing at scale.',
        icon: Shield,
        features: [
            'Unlimited agent runs',
            'Unlimited repositories',
            'Advanced bug classification',
            'Priority CI/CD monitoring',
            'Score reports & analytics',
            'Email support',
        ],
        cta: 'Start Pro Trial',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'Dedicated infrastructure and custom SLAs for large engineering orgs.',
        icon: Building2,
        features: [
            'Everything in Pro',
            'Dedicated agent cluster',
            'SSO & audit logs',
            'Custom retry policies',
            'SLA guarantee',
            'Dedicated support engineer',
        ],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background bg-grid">
            <div className="container max-w-6xl mx-auto px-4 py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center px-4 h-8 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-medium mb-6">
                        Simple, Transparent Pricing
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Choose your{' '}
                        <span className="text-gradient">healing plan</span>
                    </h1>
                    <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                        Start free, scale as your team grows. No hidden fees, no surprises.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, i) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                className={`relative rounded-xl border p-6 flex flex-col ${plan.highlighted
                                        ? 'border-primary/60 bg-primary/5'
                                        : 'border-border bg-card'
                                    }`}
                                style={
                                    plan.highlighted
                                        ? { boxShadow: '0 0 40px hsl(187 92% 53% / 0.12)' }
                                        : undefined
                                }
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold tracking-widest uppercase"
                                            style={{ boxShadow: 'var(--glow-primary)' }}>
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${plan.highlighted
                                            ? 'bg-primary/15 border-primary/30'
                                            : 'bg-muted border-border'
                                        }`}>
                                        <Icon className={`h-5 w-5 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <h2 className="text-lg font-mono font-bold text-foreground">{plan.name}</h2>
                                </div>

                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-sm text-muted-foreground font-mono">{plan.period}</span>
                                    )}
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                                            <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full h-10 rounded-lg text-sm font-mono font-semibold transition-all duration-200 ${plan.highlighted
                                            ? 'bg-primary text-primary-foreground hover:brightness-110 hover:-translate-y-px'
                                            : 'border border-border bg-muted text-foreground hover:bg-secondary hover:border-primary/40'
                                        }`}
                                    style={plan.highlighted ? { boxShadow: 'var(--glow-primary)' } : undefined}
                                >
                                    {plan.cta}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
