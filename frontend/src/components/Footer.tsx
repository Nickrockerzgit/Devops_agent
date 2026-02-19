import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Github, Linkedin, Twitter } from 'lucide-react';

const productLinks = [
    { label: 'Pricing', to: '/pricing' },
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
];

const resourceLinks = [
    { label: 'Documentation', to: '/documentation' },
    { label: 'API Reference', to: '/api' },
    { label: 'Status Page', to: '/status' },
];

const legalLinks = [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
];

const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono font-semibold text-muted-foreground tracking-widest uppercase">
                {title}
            </p>
            <ul className="space-y-2">
                {links.map(({ label, to }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className="text-sm text-foreground/70 hover:text-primary transition-colors duration-200"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="border-t border-border bg-card/70 backdrop-blur-md mt-auto">
            {/* Main grid */}
            <div className="container max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                {/* Brand column — spans 2 cols on lg */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 w-fit">
                        <div
                            className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0"
                            style={{ boxShadow: 'var(--glow-primary)' }}
                        >
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-mono font-bold text-foreground tracking-tight">
                            AUTONOMOUS DEVOPS AGENT
                        </span>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                        Autonomous CI/CD healing powered by multi-agent AI pipelines. Zero manual
                        intervention, production-grade reliability.
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="h-8 w-8 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-110 transition-all duration-200"
                                onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-accent)')
                                }
                                onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
                                }
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>

                    {/* Newsletter — integrated into brand column */}
                    <div className="flex flex-col gap-2 pt-1">
                        <p className="text-sm font-mono font-semibold text-foreground">Stay in the loop</p>
                        <p className="text-xs text-muted-foreground">No spam. Only product updates.</p>

                        {subscribed ? (
                            <p className="text-sm font-mono text-primary mt-1">✓ You're subscribed. Thanks!</p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex items-center gap-2 mt-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your work email"
                                    required
                                    className="flex-1 min-w-0 h-9 rounded-md border border-border bg-muted px-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-mono font-semibold hover:brightness-110 transition-all duration-200 shrink-0"
                                    style={{ boxShadow: 'var(--glow-primary)' }}
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Nav columns */}
                <FooterColumn title="Product" links={productLinks} />
                <FooterColumn title="Resources" links={resourceLinks} />
                <FooterColumn title="Legal" links={legalLinks} />
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border">
                <div className="container max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs font-mono text-muted-foreground">
                        © 2026 Autonomous DevOps Agent. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
                            Privacy
                        </Link>
                        <span className="text-muted-foreground/40 text-xs">|</span>
                        <Link to="/terms" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
