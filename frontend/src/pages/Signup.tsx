import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', teamName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        teamName: form.teamName.trim(),
      });

      if (res.data.success && res.data.data?.message.includes('OTP')) {
        setOtpSent(true);
      } else {
        setError('Registration failed — invalid response');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: form.email.trim(),
        otp: otp.trim(),
      });

      if (res.data.success && res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/heal');
      } else {
        setError('OTP verification failed — invalid response');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-xl border border-border bg-card p-8"
          style={{ boxShadow: '0 0 40px hsl(187 92% 53% / 0.07)' }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4"
              style={{ boxShadow: 'var(--glow-primary)' }}
            >
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-mono font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start healing your codebase today
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive text-center font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Saiyam Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="Your Team Name"
                  value={form.teamName}
                  onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-mono font-semibold hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive text-center font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  Enter OTP (sent to {form.email})
                </label>
                <input
                  type="text"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-mono font-semibold hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-mono"
            >
              Log in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}