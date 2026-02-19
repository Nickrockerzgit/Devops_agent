import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/pricing', label: 'Pricing', end: false },
    { to: '/about', label: 'About Us', end: false },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className="sticky top-0 z-50 w-full border-b border-border bg-card/70 backdrop-blur-md"
            style={{ boxShadow: '0 1px 30px hsl(187 92% 53% / 0.06)' }}
        >
            <div className="container max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
                {/* Left — Logo */}
                <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
                    <div
                        className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center"
                        style={{ boxShadow: 'var(--glow-primary)' }}
                    >
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-mono font-bold text-foreground tracking-tight hidden sm:block">
                        AUTONOMOUS DEVOPS AGENT
                    </span>
                </NavLink>

                {/* Center — Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                cn(
                                    'relative px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {label}
                                    {isActive && (
                                        <span
                                            className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-primary"
                                            style={{ boxShadow: '0 0 8px hsl(187 92% 53% / 0.6)' }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Right — Auth buttons */}
                <div className="hidden md:flex items-center gap-2">
                    <NavLink
                        to="/login"
                        className="h-9 px-4 rounded-lg border border-primary/40 bg-primary/5 text-primary text-sm font-medium font-mono hover:bg-primary/10 hover:border-primary/70 transition-all duration-200 inline-flex items-center"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/signup"
                        className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold font-mono hover:brightness-110 hover:-translate-y-px transition-all duration-200 inline-flex items-center"
                        style={{ boxShadow: 'var(--glow-primary)' }}
                    >
                        Sign Up
                    </NavLink>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-card/90 backdrop-blur-md px-4 pb-4 pt-2 space-y-1">
                    {navLinks.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                                )
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                        <NavLink
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-md border border-primary/40 bg-primary/5 text-primary text-sm font-medium font-mono text-center hover:bg-primary/10 transition-colors"
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/signup"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold font-mono text-center hover:brightness-110 transition-all"
                            style={{ boxShadow: 'var(--glow-primary)' }}
                        >
                            Sign Up
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
}
