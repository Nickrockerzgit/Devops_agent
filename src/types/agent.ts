export type BugType = 'LINTING' | 'SYNTAX' | 'LOGIC' | 'TYPE_ERROR' | 'IMPORT' | 'INDENTATION';
export type FixStatus = 'Fixed' | 'Failed';
export type CIStatus = 'PASSED' | 'FAILED';
export type AgentPhase = 
  | 'idle' 
  | 'cloning' 
  | 'analyzing' 
  | 'running_tests' 
  | 'classifying' 
  | 'generating_fixes' 
  | 'committing' 
  | 'pushing' 
  | 'monitoring_ci' 
  | 'complete';

export interface Fix {
  file: string;
  bug_type: BugType;
  line: number;
  commit_message: string;
  status: FixStatus;
  description: string;
}

export interface TimelineEntry {
  iteration: number;
  status: CIStatus;
  timestamp: string;
}

export interface Score {
  base: number;
  speed_bonus: number;
  efficiency_penalty: number;
  final_score: number;
}

export interface AgentResults {
  repository: string;
  team_name: string;
  team_leader: string;
  branch_name: string;
  total_failures: number;
  total_fixes_applied: number;
  iterations_used: number;
  retry_limit: number;
  ci_cd_status: CIStatus;
  total_time_seconds: number;
  score: Score;
  fixes: Fix[];
  timeline: TimelineEntry[];
}

export interface AgentState {
  phase: AgentPhase;
  results: AgentResults | null;
  isRunning: boolean;
  logs: string[];
  currentIteration: number;
}

export function generateBranchName(teamName: string, leaderName: string): string {
  const sanitize = (s: string) =>
    s.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, '_').trim();
  return `${sanitize(teamName)}_${sanitize(leaderName)}_AI_Fix`;
}

export function formatFixDescription(fix: Fix): string {
  return `${fix.bug_type} error in ${fix.file} line ${fix.line} → Fix: ${fix.description}`;
}

export function calculateScore(totalTimeSeconds: number, totalCommits: number): Score {
  const base = 100;
  const speed_bonus = totalTimeSeconds < 300 ? 10 : 0;
  const efficiency_penalty = Math.max(0, (totalCommits - 20) * 2);
  return {
    base,
    speed_bonus,
    efficiency_penalty,
    final_score: base + speed_bonus - efficiency_penalty,
  };
}
