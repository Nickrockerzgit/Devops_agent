import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection({ onScrollToAgent }: { onScrollToAgent?: () => void }) {
  const navigate = useNavigate();

  const stats = [
    { value: '94%', label: 'Avg. healing score' },
    { value: '< 2min', label: 'Mean resolution time' },
    { value: '6 agents', label: 'Working in parallel' },
    { value: '100%', label: 'Automated pipeline' },
  ];

  return (
    <section className="relative hero-bg min-h-[92vh] flex flex-col items-center justify-center text-center px-8">
      <div className="hero-glow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-[900px] relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center px-5 h-9 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-8"
        >
          Powered by AI Agents — Zero manual intervention
        </motion.div>

        {/* Heading */}
        <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] leading-[1.05] font-bold tracking-[-0.02em] text-foreground">
          Autonomous{' '}
          <span className="text-gradient">CI/CD Healing</span>
          <br />
          for Your Codebase
        </h1>

        {/* Paragraph */}
        <p className="text-muted-foreground text-base sm:text-lg lg:text-xl mt-8 max-w-[720px] mx-auto leading-relaxed">
          Paste a GitHub URL. Our AI agents detect test failures, generate
          targeted fixes, validate patches, and commit to isolated branches —
          all autonomously.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-10 flex-wrap">
          <button
            onClick={() => navigate('/heal')}
            className="h-[52px] px-7 rounded-[14px] bg-primary text-primary-foreground font-semibold text-base shadow-[var(--glow-primary)] hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            Start Healing
            <ArrowRight className="h-4 w-4" />
          </button>

          <button className="h-[52px] px-7 rounded-[14px] bg-card border border-border text-foreground hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 inline-flex items-center gap-2">
            <Play className="h-4 w-4" />
            View Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-20 mt-20 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
