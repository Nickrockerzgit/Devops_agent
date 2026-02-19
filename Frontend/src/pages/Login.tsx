import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/heal');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div
                    className="rounded-xl border border-border bg-card p-8"
                    style={{ boxShadow: '0 0 40px hsl(187 92% 53% / 0.07)' }}
                >
                    {/* Icon + title */}
                    <div className="flex flex-col items-center mb-8">
                        <div
                            className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4"
                            style={{ boxShadow: 'var(--glow-primary)' }}
                        >
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-xl font-mono font-bold text-foreground">Welcome Back</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Log in to your agent dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@company.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                disabled={loading}
                                className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                disabled={loading}
                                className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-xs font-mono text-primary hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-mono font-semibold hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-primary hover:underline font-mono"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
