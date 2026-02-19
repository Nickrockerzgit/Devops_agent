import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Play, Loader2 } from 'lucide-react';

interface RunFormProps {
  onSubmit: (repoUrl: string, teamName: string, teamLeader: string) => void;
  isRunning: boolean;
}

export default function RunForm({ onSubmit, isRunning }: RunFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl && teamName && teamLeader) {
      onSubmit(repoUrl, teamName, teamLeader);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-glow bg-card p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold font-mono text-foreground">Initialize Agent</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-1.5">
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            disabled={isRunning}
            className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="RIFT ORGANISERS"
              disabled={isRunning}
              className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">
              Team Leader
            </label>
            <input
              type="text"
              value={teamLeader}
              onChange={e => setTeamLeader(e.target.value)}
              placeholder="Saiyam Kumar"
              disabled={isRunning}
              className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isRunning || !repoUrl || !teamName || !teamLeader}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-mono font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Agent Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Agent
          </>
        )}
      </button>
    </motion.form>
  );
}
