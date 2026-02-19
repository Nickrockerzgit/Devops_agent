import type { AgentResults, AgentPhase, BugType, Fix, TimelineEntry } from '@/types/agent';
import { generateBranchName, calculateScore } from '@/types/agent';

const SAMPLE_FILES = [
  'src/utils.py', 'src/validator.py', 'src/auth.py', 'src/models.py',
  'src/api/routes.py', 'src/services/user_service.py', 'src/config.py',
  'tests/test_utils.py', 'src/middleware.py', 'src/database.py',
];

const BUG_TYPES: BugType[] = ['LINTING', 'SYNTAX', 'LOGIC', 'TYPE_ERROR', 'IMPORT', 'INDENTATION'];

const FIX_DESCRIPTIONS: Record<BugType, string[]> = {
  LINTING: ['remove the unused import statement', 'fix variable naming convention', 'remove trailing whitespace'],
  SYNTAX: ['add the missing colon at the correct position', 'fix unmatched parenthesis', 'add missing comma'],
  LOGIC: ['fix the off-by-one error in loop condition', 'correct boolean logic inversion', 'fix null check order'],
  TYPE_ERROR: ['cast return value to correct type', 'fix argument type mismatch', 'add type annotation'],
  IMPORT: ['update import path to correct module', 'add missing dependency import', 'remove circular import'],
  INDENTATION: ['fix indentation to 4 spaces', 'align block with parent scope', 'fix mixed tabs and spaces'],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFixes(count: number): Fix[] {
  return Array.from({ length: count }, () => {
    const bugType = randomItem(BUG_TYPES);
    const file = randomItem(SAMPLE_FILES);
    const line = Math.floor(Math.random() * 150) + 1;
    const desc = randomItem(FIX_DESCRIPTIONS[bugType]);
    const fixed = Math.random() > 0.12;
    return {
      file,
      bug_type: bugType,
      line,
      commit_message: `[AI-AGENT] Fix ${bugType.toLowerCase()} error in ${file}:${line}`,
      status: fixed ? 'Fixed' : 'Failed',
      description: desc,
    } as Fix;
  });
}

export type PhaseCallback = (phase: AgentPhase, log: string) => void;

export async function simulateAgentRun(
  repoUrl: string,
  teamName: string,
  teamLeader: string,
  retryLimit: number,
  onPhase: PhaseCallback,
): Promise<AgentResults> {
  const startTime = Date.now();
  const branchName = generateBranchName(teamName, teamLeader);
  const totalFailures = Math.floor(Math.random() * 8) + 5;
  const fixes = generateFixes(totalFailures);
  const timeline: TimelineEntry[] = [];

  const phases: { phase: AgentPhase; log: string; delay: number }[] = [
    { phase: 'cloning', log: `$ git clone ${repoUrl}`, delay: 1200 },
    { phase: 'analyzing', log: '> Scanning repository structure...', delay: 1500 },
    { phase: 'analyzing', log: `> Found ${totalFailures} source files to analyze`, delay: 800 },
    { phase: 'running_tests', log: '> pytest --tb=short -q ...', delay: 2000 },
    { phase: 'running_tests', log: `> ${totalFailures} FAILED, 42 passed`, delay: 1000 },
    { phase: 'classifying', log: '> Classifying bug types with AI...', delay: 1500 },
  ];

  for (const p of phases) {
    onPhase(p.phase, p.log);
    await sleep(p.delay);
  }

  for (const fix of fixes) {
    onPhase('classifying', `  ${fix.bug_type} error in ${fix.file} line ${fix.line}`);
    await sleep(300);
  }

  const iterations = Math.min(Math.floor(Math.random() * 3) + 2, retryLimit);

  for (let i = 1; i <= iterations; i++) {
    onPhase('generating_fixes', `> Iteration ${i}/${retryLimit}: Generating fixes...`);
    await sleep(1200);

    const iterFixes = fixes.filter((_, idx) => idx % iterations < i);
    for (const fix of iterFixes.slice(0, 3)) {
      onPhase('generating_fixes', `  Patching ${fix.file}:${fix.line}`);
      await sleep(400);
    }

    onPhase('committing', `> git commit -m "[AI-AGENT] Iteration ${i} fixes"`);
    await sleep(800);

    onPhase('pushing', `> git push origin ${branchName}`);
    await sleep(600);

    onPhase('monitoring_ci', `> Monitoring CI pipeline (iteration ${i})...`);
    await sleep(1500);

    const passed = i === iterations;
    timeline.push({
      iteration: i,
      status: passed ? 'PASSED' : 'FAILED',
      timestamp: new Date().toISOString(),
    });

    onPhase('monitoring_ci', `> CI ${passed ? 'PASSED ✓' : 'FAILED ✗'}`);
    await sleep(500);
  }

  const totalTime = (Date.now() - startTime) / 1000;
  const fixedCount = fixes.filter(f => f.status === 'Fixed').length;
  const score = calculateScore(totalTime, fixedCount);

  onPhase('complete', '> Agent run complete.');

  return {
    repository: repoUrl,
    team_name: teamName,
    team_leader: teamLeader,
    branch_name: branchName,
    total_failures: totalFailures,
    total_fixes_applied: fixedCount,
    iterations_used: iterations,
    retry_limit: retryLimit,
    ci_cd_status: timeline[timeline.length - 1]?.status || 'FAILED',
    total_time_seconds: Math.round(totalTime),
    score,
    fixes,
    timeline,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
