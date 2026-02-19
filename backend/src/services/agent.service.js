// src/services/agent.service.js
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const simpleGit = require('simple-git');
const { OpenAI } = require('openai');
const prisma = require('../../prisma/client');

const execAsync = promisify(exec);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AgentService {
  constructor() {
    this.workDir = path.join(__dirname, '../../temp_repos');
    this.retryLimit = parseInt(process.env.AGENT_RETRY_LIMIT || '5', 10);
  }

  /**
   * Main entry point - runs the autonomous agent
   */
  async runAgent({ repoUrl, teamName, leaderName, userId }) {
    const startTime = Date.now();
    const branchName = this.generateBranchName(teamName, leaderName);
    
    let run = null;
    let repoPath = null;

    try {
      // Create database run record
      run = await prisma.run.create({
        data: {
          userId,
          repoUrl: repoUrl,
          teamName,
          leaderName: leaderName,
          branchName,
          finalStatus: 'RUNNING',
        },
      });

      console.log(`[AGENT] Starting run ${run.id} for ${repoUrl}`);

      // Step 1: Clone repository
      repoPath = await this.cloneRepository(repoUrl, run.id);

      // Step 2: Analyze repository structure
      const repoStructure = await this.analyzeRepository(repoPath);

      // Step 3: Discover and run tests
      const testResults = await this.runTests(repoPath);

      if (testResults.failures.length === 0) {
        // No failures found - perfect repo!
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        await this.finishRun(run.id, 'PASSED', [], 0, totalTime, 0);
        
        return {
          success: true,
          message: 'No failures detected. Repository is healthy!',
          results: await this.generateResults(run.id),
        };
      }

      // Step 4: Classify failures
      const classifiedFailures = await this.classifyFailures(testResults.failures, repoPath);

      // Save detected failures to database (even if fixes fail)
      console.log(`[AGENT] Recording ${classifiedFailures.length} detected failures to database...`);
      for (const failure of classifiedFailures) {
        try {
          await prisma.fix.create({
            data: {
              runId: run.id,
              file: failure.file,
              bugType: failure.bug_type,
              lineNumber: failure.line,
              commitMessage: `[DETECTED] ${failure.bug_type} error in ${failure.file}:${failure.line}`,
              status: 'DETECTED', // Initial status before fixing
              description: failure.description || failure.message,
            },
          });
        } catch (dbError) {
          console.error(`[AGENT] Failed to save failure ${failure.file}:${failure.line}`, dbError.message);
        }
      }

      // Step 5: Setup Git branch
      await this.setupGitBranch(repoPath, branchName);

      // Step 5.5: Make initial commit documenting detected failures
      await this.createDetectionCommit(repoPath, classifiedFailures);

      // Step 6: Iterative fix generation and testing
      let iteration = 0;
      let allPassed = false;
      const timeline = [];

      while (iteration < this.retryLimit && !allPassed) {
        iteration++;
        console.log(`[AGENT] Iteration ${iteration}/${this.retryLimit}`);

        // Record iteration start
        await prisma.iteration.create({
          data: {
            runId: run.id,
            iterationNumber: iteration,
            status: 'RUNNING',
          },
        });

        // Generate fixes for remaining failures
        const fixes = await this.generateFixes(classifiedFailures, repoPath, iteration);

        if (fixes.length === 0) {
          console.log('[AGENT] No fixes generated (OpenAI might have failed)');
          console.log('[AGENT] Detected failures have been documented in initial commit');
          
          // Update iteration status to FAILED_RUN
          const iter = await prisma.iteration.findFirst({
            where: { runId: run.id, iterationNumber: iteration }
          });
          if (iter) {
            await prisma.iteration.update({
              where: { id: iter.id },
              data: { status: 'FAILED_RUN' }
            });
          }
          
          timeline.push({
            iteration,
            status: 'FAILED',
            timestamp: new Date().toISOString(),
          });
          
          // Don't break - exit loop and push branch with detection commit
          break;
        }

        // Apply fixes to files
        await this.applyFixes(fixes, repoPath);

        // Commit changes with [AI-AGENT] prefix
        await this.commitChanges(repoPath, `[AI-AGENT] Iteration ${iteration}: Applied ${fixes.length} fixes`);

        // Update fix status in database (from DETECTED to FIXED)
        for (const fix of fixes) {
          try {
            // Find the detected fix and update it
            const existingFix = await prisma.fix.findFirst({
              where: {
                runId: run.id,
                file: fix.file,
                lineNumber: fix.line,
                status: 'DETECTED'
              }
            });

            if (existingFix) {
              await prisma.fix.update({
                where: { id: existingFix.id },
                data: {
                  status: 'FIXED',
                  commitMessage: fix.commit_message,
                }
              });
            } else {
              // Create new if not found in DETECTED
              await prisma.fix.create({
                data: {
                  runId: run.id,
                  file: fix.file,
                  bugType: fix.bug_type,
                  lineNumber: fix.line,
                  commitMessage: fix.commit_message,
                  status: 'FIXED',
                  description: fix.description,
                },
              });
            }
          } catch (dbError) {
            console.error(`[AGENT] Failed to update fix ${fix.file}:${fix.line}`, dbError.message);
          }
        }

        // Re-run tests
        const retestResults = await this.runTests(repoPath);
        allPassed = retestResults.failures.length === 0;

        // Update iteration status (was created as RUNNING at start of loop)
        const iter = await prisma.iteration.findFirst({
          where: { runId: run.id, iterationNumber: iteration }
        });
        if (iter) {
          await prisma.iteration.update({
            where: { id: iter.id },
            data: { status: allPassed ? 'PASSED' : 'FAILED_RUN' }
          });
        }

        timeline.push({
          iteration,
          status: allPassed ? 'PASSED' : 'FAILED',
          timestamp: new Date().toISOString(),
        });

        if (allPassed) {
          console.log(`[AGENT] ✓ All tests passed at iteration ${iteration}`);
          break;
        }

        // Update remaining failures
        classifiedFailures.length = 0;
        classifiedFailures.push(...await this.classifyFailures(retestResults.failures, repoPath));
      }

      // Push branch to remote (always push, even if no fixes applied)
      console.log('[AGENT] Pushing branch to remote...');
      const pushed = await this.pushChanges(repoPath, branchName);
      
      if (pushed) {
        console.log(`[AGENT] ✓ Branch ${branchName} successfully pushed to remote`);
      } else {
        console.warn(`[AGENT] ✗ Failed to push branch ${branchName} - check GitHub token and permissions`);
      }

      // Finalize
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const finalStatus = allPassed ? 'PASSED' : 'FAILED';
      
      // Pass initial failure count to finishRun
      await this.finishRun(run.id, finalStatus, timeline, iteration, totalTime, testResults.failures.length);

      // Generate results.json
      const results = await this.generateResults(run.id);
      await this.saveResultsJson(results, repoPath);

      // Cleanup local clone (delete temp folder)
      console.log('[AGENT] Cleaning up local repository clone...');
      await this.cleanup(repoPath);
      console.log('[AGENT] ✓ Local clone deleted successfully');

      return {
        success: true,
        results,
        message: allPassed ? 'All tests passed!' : 'Some tests still failing after max iterations',
      };

    } catch (error) {
      console.error('[AGENT] Error:', error);
      
      if (run) {
        await prisma.run.update({
          where: { id: run.id },
          data: { 
            finalStatus: 'FAILED_RUN',
            errorMessage: error.message 
          },
        });
      }

      if (repoPath) {
        console.log('[AGENT] Cleaning up after error...');
        await this.cleanup(repoPath);
      }

      throw error;
    }
  }

  /**
   * Generate branch name: TEAM_NAME_LEADER_NAME_AI_Fix
   */
  generateBranchName(teamName, leaderName) {
    const sanitize = (str) => 
      str.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, '_').trim();
    
    return `${sanitize(teamName)}_${sanitize(leaderName)}_AI_Fix`;
  }

  /**
   * Clone repository to local workspace
   */
  async cloneRepository(repoUrl, runId) {
    const repoName = path.basename(repoUrl, '.git');
    const repoPath = path.join(this.workDir, `${repoName}_${runId}`);

    // Ensure work directory exists
    await fs.mkdir(this.workDir, { recursive: true });

    console.log(`[AGENT] Cloning ${repoUrl} to ${repoPath}`);
    
    // Use token for authentication if available
    let cloneUrl = repoUrl;
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (githubToken && repoUrl.includes('github.com')) {
      // Convert https://github.com/user/repo to https://token@github.com/user/repo
      cloneUrl = repoUrl.replace('https://github.com', `https://${githubToken}@github.com`);
      console.log('[AGENT] Using authenticated clone');
    }
    
    const git = simpleGit();
    await git.clone(cloneUrl, repoPath, ['--depth', '1']);
    
    // Configure git user for commits
    const repoGit = simpleGit(repoPath);
    await repoGit.addConfig('user.name', 'Nickrockerzgit', false, 'local');
    await repoGit.addConfig('user.email', 'rishabhjhade060@gmail.com', false, 'local');

    return repoPath;
  }

  /**
   * Analyze repository structure
   */
  async analyzeRepository(repoPath) {
    const structure = {
      hasTests: false,
      testFiles: [],
      sourceFiles: [],
      languages: new Set(),
    };

    const scanDir = async (dir, relativePath = '') => {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relPath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
          if (!item.name.startsWith('.') && item.name !== 'node_modules') {
            await scanDir(fullPath, relPath);
          }
        } else if (item.isFile()) {
          const ext = path.extname(item.name);
          
          // Detect test files
          if (item.name.includes('test') || item.name.includes('spec') || relPath.includes('test')) {
            structure.hasTests = true;
            structure.testFiles.push(relPath);
          }

          // Classify by language
          if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
            structure.languages.add('javascript');
            structure.sourceFiles.push(relPath);
          } else if (['.py'].includes(ext)) {
            structure.languages.add('python');
            structure.sourceFiles.push(relPath);
          } else if (['.java'].includes(ext)) {
            structure.languages.add('java');
            structure.sourceFiles.push(relPath);
          }
        }
      }
    };

    await scanDir(repoPath);
    structure.languages = Array.from(structure.languages);

    console.log(`[AGENT] Found ${structure.testFiles.length} test files, ${structure.sourceFiles.length} source files`);
    console.log(`[AGENT] Languages detected: ${structure.languages.join(', ')}`);

    return structure;
  }

  /**
   * Run tests and capture failures
   */
  async runTests(repoPath) {
    console.log('[AGENT] Running tests...');
    
    const failures = [];
    
    try {
      // Try different test runners based on files present
      const hasPackageJson = await fs.access(path.join(repoPath, 'package.json')).then(() => true).catch(() => false);
      const hasPytest = await fs.access(path.join(repoPath, 'pytest.ini'))
        .then(() => true)
        .catch(async () => {
          // Check if any test files exist
          const files = await fs.readdir(repoPath, { recursive: true });
          return files.some(f => f.includes('test_') || f.includes('_test.py'));
        });

      if (hasPackageJson) {
        // Install dependencies first
        // Note: We need dependencies to run tests, but bugs can exist before/after installation
        // Bug types like SYNTAX, IMPORT, TYPE_ERROR will still be detected in the test output
        console.log('[AGENT] Installing dependencies...');
        try {
          await execAsync('npm install --prefer-offline --no-audit', { cwd: repoPath, timeout: 120000 });
          console.log('[AGENT] Dependencies installed successfully');
        } catch (installError) {
          console.error('[AGENT] Failed to install dependencies:', installError.message);
          // Continue anyway - tests might still run
        }

        // JavaScript/TypeScript tests
        try {
          const { stdout, stderr } = await execAsync('npm test', { cwd: repoPath, timeout: 60000 });
          console.log('[AGENT] Tests passed! No failures detected.');
        } catch (error) {

            console.log("[AGENT] Tests failed, parsing output...", error);
          console.log('[AGENT] Tests failed, parsing output...');
          // Jest outputs failures to stderr, not stdout
          const output = error.stderr || error.stdout || '';
          
          // Debug: Log output length and first 500 chars
          console.log(`[AGENT] Test output length: ${output.length} characters`);
          console.log('[AGENT] Test output sample:', output.substring(0, 500));
          
          // Parse npm test output for failures
          failures.push(...this.parseTestOutput(output, 'javascript'));
        }
      }

      if (hasPytest) {
        // Python tests
        try {
          await execAsync('pytest --tb=short', { cwd: repoPath, timeout: 60000 });
        } catch (error) {
          failures.push(...this.parseTestOutput(error.stdout || error.stderr || '', 'python'));
        }
      }

      // If no test framework found, run basic linting
      if (!hasPackageJson && !hasPytest) {
        console.log('[AGENT] No test framework detected, running linters...');
        failures.push(...await this.runBasicLinting(repoPath));
      }

    } catch (error) {
      console.error('[AGENT] Test execution error:', error.message);
    }

    console.log(`[AGENT] Found ${failures.length} failures`);
    return { failures };
  }

  /**
   * Parse test output to extract failures
   */
  parseTestOutput(output, language) {
    const failures = [];
    const lines = output.split('\n');

    console.log('[AGENT] Parsing test output...');
    console.log(`[AGENT] Total lines: ${lines.length}`);
    
    // Strategy 1: Look for "at Object." pattern (Jest stack traces)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Jest format: "at Object.toBe (src/__tests__/file.test.ts:6:23)"
      // More flexible regex to handle various formats
      if (line.includes('at Object.') || line.includes('at ')) {
        const locationMatch = line.match(/at\s+[\w.]+\s*\(([^)]+\.(?:test|spec)\.[jt]sx?):(\d+):(\d+)\)/);
        
        if (locationMatch) {
          const filePath = locationMatch[1];
          const lineNum = parseInt(locationMatch[2], 10);
          
          // Look backwards for error message
          let errorMessage = 'Test failed';
          for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
            const prevLine = lines[j].trim();
            if (prevLine.includes('Expected:') || prevLine.includes('Received:')) {
              errorMessage = prevLine;
              break;
            } else if (prevLine.includes('expect(received)')) {
              errorMessage = prevLine;
              break;
            }
          }
          
          failures.push({
            file: filePath,
            line: lineNum,
            message: errorMessage,
            test: 'jest-test',
          });
          
          console.log(`[AGENT] Found failure: ${filePath}:${lineNum}`);
        }
      }
    }
    
    // Strategy 2: If no failures found with Strategy 1, parse summary line
    // "Tests:       4 failed, 4 passed, 8 total"
    if (failures.length === 0) {
      console.log('[AGENT] Trying alternative parsing method...');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Look for summary line
        if (line.includes('Tests:') && line.includes('failed')) {
          const failMatch = line.match(/(\d+)\s+failed/);
          if (failMatch) {
            const failCount = parseInt(failMatch[1], 10);
            console.log(`[AGENT] Found ${failCount} failed tests in summary`);
            
            // Look backwards for FAIL lines with file paths
            for (let j = i - 1; j >= 0 && failures.length < failCount; j--) {
              const prevLine = lines[j];
              
              // Match "FAIL src/__tests__/file.test.ts"
              if (prevLine.includes('FAIL') && (prevLine.includes('.test.') || prevLine.includes('.spec.'))) {
                const fileMatch = prevLine.match(/FAIL\s+(.+\.(?:test|spec)\.[jt]sx?)/);
                if (fileMatch) {
                  failures.push({
                    file: fileMatch[1],
                    line: 1,
                    message: 'Test failed (see test file)',
                    test: 'jest-test',
                  });
                  console.log(`[AGENT] Found failed test file: ${fileMatch[1]}`);
                }
              }
            }
          }
        }
      }
    }

    // Python pytest format
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('FAILED') && line.includes('.py')) {
        const match = line.match(/FAILED\s+(.+\.py)::(\w+)/);
        if (match) {
          failures.push({
            file: match[1],
            test: match[2],
            message: lines[i + 1] || 'Test failed',
            line: 0,
          });
          console.log(`[AGENT] Found failure in ${match[1]}`);
        }
      }
    }

    console.log(`[AGENT] Parsed ${failures.length} failures from output`);
    return failures;
  }

  /**
   * Run basic linting if no tests found
   */
  async runBasicLinting(repoPath) {
    const failures = [];
    
    try {
      // Try ESLint for JS/TS files
      try {
        const { stdout } = await execAsync('npx eslint . --format json', { 
          cwd: repoPath, 
          timeout: 30000 
        });
        
        const results = JSON.parse(stdout);
        for (const result of results) {
          for (const msg of result.messages) {
            failures.push({
              file: path.relative(repoPath, result.filePath),
              line: msg.line,
              message: msg.message,
              test: 'linting',
            });
          }
        }
      } catch (e) {
        // ESLint not available or no issues
      }

      // Try Flake8 for Python
      try {
        const { stdout } = await execAsync('flake8 . --format=json', { 
          cwd: repoPath,
          timeout: 30000 
        });
        
        const results = JSON.parse(stdout);
        Object.keys(results).forEach(file => {
          results[file].forEach(issue => {
            failures.push({
              file: path.relative(repoPath, file),
              line: issue.line_number,
              message: issue.text,
              test: 'linting',
            });
          });
        });
      } catch (e) {
        // Flake8 not available
      }

    } catch (error) {
      console.error('[AGENT] Linting error:', error.message);
    }

    return failures;
  }

  /**
   * Classify failures using AI
   */
  async classifyFailures(failures, repoPath) {
    console.log('[AGENT] Classifying failures with AI...');
    
    const classified = [];

    for (const failure of failures.slice(0, 20)) { // Limit to first 20 to avoid token limits
      try {
        const fileContent = await this.getFileContent(repoPath, failure.file, failure.line);
        
        const classification = await this.callOpenAI(`
You are a code analysis expert. Classify this bug into ONE category:
LINTING, SYNTAX, LOGIC, TYPE_ERROR, IMPORT, INDENTATION

File: ${failure.file}
Line: ${failure.line}
Error: ${failure.message}

Code context:
${fileContent}

Respond with ONLY the category and a brief fix description (max 10 words) in this format:
CATEGORY: description
        `.trim());

        const [category, ...descParts] = classification.split(':');
        const bugType = category.trim();
        const description = descParts.join(':').trim() || 'Fix the error';

        if (['LINTING', 'SYNTAX', 'LOGIC', 'TYPE_ERROR', 'IMPORT', 'INDENTATION'].includes(bugType)) {
          classified.push({
            file: failure.file,
            line: failure.line,
            bug_type: bugType,
            message: failure.message,
            description,
          });
        }
      } catch (error) {
        console.error(`[AGENT] Classification error for ${failure.file}:`, error.message);
        
        // Fallback classification without OpenAI - use keyword matching
        let bugType = 'SYNTAX'; // Default
        let description = 'fix the error';
        
        const errorMsg = failure.message.toLowerCase();
        
        if (errorMsg.includes('import') || errorMsg.includes('cannot find module') || errorMsg.includes('is not defined')) {
          bugType = 'IMPORT';
          description = 'fix missing import';
        } else if (errorMsg.includes('type') || errorMsg.includes('expected') || errorMsg.includes('received')) {
          bugType = 'TYPE_ERROR';
          description = 'fix type mismatch';
        } else if (errorMsg.includes('syntax') || errorMsg.includes('unexpected token')) {
          bugType = 'SYNTAX';
          description = 'fix syntax error';
        } else if (errorMsg.includes('lint') || errorMsg.includes('unused')) {
          bugType = 'LINTING';
          description = 'fix linting issue';
        } else if (errorMsg.includes('logic') || errorMsg.includes('assert') || errorMsg.includes('expect')) {
          bugType = 'LOGIC';
          description = 'fix logic error';
        } else if (errorMsg.includes('indent')) {
          bugType = 'INDENTATION';
          description = 'fix indentation';
        }
        
        classified.push({
          file: failure.file,
          line: failure.line || 1,
          bug_type: bugType,
          message: failure.message,
          description,
        });
        
        console.log(`[AGENT] Used fallback classification: ${bugType} for ${failure.file}:${failure.line}`);
      }
    }

    return classified;
  }

  /**
   * Generate fixes using AI
   */
  async generateFixes(classifiedFailures, repoPath, iteration) {
    console.log(`[AGENT] Generating fixes for ${classifiedFailures.length} failures...`);
    
    const fixes = [];

    for (const failure of classifiedFailures.slice(0, 10)) { // Process 10 per iteration
      try {
        const fileContent = await this.getFileContent(repoPath, failure.file, failure.line, 20);
        
        const fixedCode = await this.callOpenAI(`
You are an expert code fixer. Fix this ${failure.bug_type} error.

File: ${failure.file}
Line: ${failure.line}
Bug Type: ${failure.bug_type}
Error: ${failure.message}

Current code:
${fileContent}

Provide ONLY the fixed code for the problematic section. Do not include explanations.
        `.trim());

        fixes.push({
          file: failure.file,
          line: failure.line,
          bug_type: failure.bug_type,
          originalCode: fileContent,
          fixedCode: fixedCode.trim(),
          commit_message: `[AI-AGENT] Fix ${failure.bug_type.toLowerCase()} error in ${failure.file}:${failure.line}`,
          description: failure.description,
        });

      } catch (error) {
        console.error(`[AGENT] Fix generation error for ${failure.file}:`, error.message);
      }
    }

    return fixes;
  }

  /**
   * Apply fixes to files
   */
  async applyFixes(fixes, repoPath) {
    for (const fix of fixes) {
      try {
        const filePath = path.join(repoPath, fix.file);
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Simple replacement strategy - replace the old code with new code
        // In production, use proper AST manipulation
        content = content.replace(fix.originalCode, fix.fixedCode);
        
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`[AGENT] Applied fix to ${fix.file}:${fix.line}`);
        
      } catch (error) {
        console.error(`[AGENT] Failed to apply fix to ${fix.file}:`, error.message);
      }
    }
  }

  /**
   * Setup git branch
   */
  async setupGitBranch(repoPath, branchName) {
    const git = simpleGit(repoPath);
    
    try {
      // Create and checkout new branch
      await git.checkoutLocalBranch(branchName);
      console.log(`[AGENT] Created and checked out branch: ${branchName}`);
      
      // Set upstream for push
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        // Get remote URL and update with token
        const remotes = await git.getRemotes(true);
        const origin = remotes.find(r => r.name === 'origin');
        
        if (origin && origin.refs.push.includes('github.com')) {
          const authUrl = origin.refs.push.replace('https://github.com', `https://${githubToken}@github.com`);
          await git.remote(['set-url', 'origin', authUrl]);
          console.log('[AGENT] Updated remote URL with authentication');
        }
      }
    } catch (error) {
      console.error('[AGENT] Branch setup error:', error.message);
      throw error;
    }
  }

  /**
   * Create initial commit documenting detected failures
   */
  async createDetectionCommit(repoPath, classifiedFailures) {
    try {
      // Create DETECTED_FAILURES.md file documenting what was found
      const failureDoc = [
        '# AI Agent Detection Report',
        '',
        `Detected ${classifiedFailures.length} failures in automated test run:`,
        '',
        ...classifiedFailures.map((f, i) => 
          `${i + 1}. **${f.bug_type}** in \`${f.file}\`:${f.line}\n   - Error: ${f.message}\n   - Description: ${f.description}`
        ),
        '',
        '---',
        `Generated by DevOps AI Agent on ${new Date().toISOString()}`,
      ].join('\n');
      
      const docPath = path.join(repoPath, 'DETECTED_FAILURES.md');
      await fs.writeFile(docPath, failureDoc, 'utf-8');
      
      // Commit with [AI-AGENT] prefix
      await this.commitChanges(repoPath, `[AI-AGENT] Detection: Found ${classifiedFailures.length} failures`);
      
      console.log(`[AGENT] Created initial detection commit with ${classifiedFailures.length} failures documented`);
    } catch (error) {
      console.error('[AGENT] Failed to create detection commit:', error.message);
    }
  }

  /**
   * Commit changes
   */
  async commitChanges(repoPath, message) {
    const git = simpleGit(repoPath);
    
    try {
      await git.add('.');
      await git.commit(message);
      console.log(`[AGENT] Committed: ${message}`);
    } catch (error) {
      console.error('[AGENT] Commit error:', error.message);
    }
  }

  /**
   * Push changes to remote
   */
  async pushChanges(repoPath, branchName) {
    const git = simpleGit(repoPath);
    const githubToken = process.env.GITHUB_TOKEN;
    
    try {
      if (!githubToken) {
        console.warn('[AGENT] No GitHub token found. Skipping push.');
        console.warn('[AGENT] Add GITHUB_TOKEN to .env to enable pushing');
        return false;
      }
      
      // Push with set-upstream
      console.log(`[AGENT] Pushing branch ${branchName} to origin...`);
      await git.push('origin', branchName, ['--set-upstream']);
      console.log(`[AGENT] ✓ Successfully pushed to origin/${branchName}`);
      return true;
    } catch (error) {
      console.error('[AGENT] Push failed:', error.message);
      
      // Check if it's a token issue
      if (error.message.includes('authentication') || error.message.includes('403')) {
        console.error('[AGENT] Authentication failed. Check if:');
        console.error('  1. GITHUB_TOKEN is valid');
        console.error('  2. Token has "repo" scope');
        console.error('  3. You have write access to the repository');
      }
      
      return false;
    }
  }

  /**
   * Get file content around specific line
   */
  async getFileContent(repoPath, file, line, contextLines = 10) {
    try {
      const filePath = path.join(repoPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      const start = Math.max(0, line - contextLines);
      const end = Math.min(lines.length, line + contextLines);
      
      return lines.slice(start, end).join('\n');
    } catch (error) {
      return '';
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(prompt, maxTokens = 500) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using gpt-4o-mini (cheaper and faster) or use 'gpt-4o' for better quality
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.3,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('[AGENT] OpenAI API error:', error.message);
      throw error;
    }
  }

  /**
   * Finish run and calculate score
   */
  async finishRun(runId, status, timeline, iterations, totalTime, initialFailuresCount = 0) {
    const fixes = await prisma.fix.findMany({ where: { runId } });
    
    const baseScore = 100;
    const speedBonus = totalTime < 300 ? 10 : 0;
    const efficiencyPenalty = Math.max(0, (iterations - 20) * 2);
    const finalScore = baseScore + speedBonus - efficiencyPenalty;

    await prisma.run.update({
      where: { id: runId },
      data: {
        finalStatus: status,
        iterationsUsed: iterations,
        durationSeconds: totalTime,
        failuresDetected: initialFailuresCount, // Use the initial count, not fixes.length
        fixesApplied: fixes.filter(f => f.status === 'FIXED').length,
        commitCount: iterations,
        baseScore,
        speedBonus,
        efficiencyPenalty,
        finalScore,
      },
    });
  }

  /**
   * Generate results.json format
   */
  async generateResults(runId) {
    const run = await prisma.run.findUnique({
      where: { id: runId },
      include: {
        fixes: true,
        iterations: true,
      },
    });

    return {
      repository: run.repoUrl,
      team_name: run.teamName,
      team_leader: run.leaderName,
      branch_name: run.branchName,
      total_failures: run.failuresDetected,
      total_fixes_applied: run.fixesApplied,
      iterations_used: run.iterationsUsed,
      retry_limit: this.retryLimit,
      ci_cd_status: run.finalStatus === 'PASSED' ? 'PASSED' : 'FAILED',
      total_time_seconds: run.durationSeconds,
      score: {
        base: run.baseScore,
        speed_bonus: run.speedBonus,
        efficiency_penalty: run.efficiencyPenalty,
        final_score: run.finalScore,
      },
      fixes: run.fixes.map(f => ({
        file: f.file,
        bug_type: f.bugType,
        line: f.lineNumber,
        commit_message: f.commitMessage,
        status: f.status,
        description: f.description,
      })),
      timeline: run.iterations.map(t => ({
        iteration: t.iterationNumber,
        status: t.status,
        timestamp: t.timestamp.toISOString(),
      })),
    };
  }

  /**
   * Save results.json file
   */
  async saveResultsJson(results, repoPath) {
    const resultsPath = path.join(repoPath, 'results.json');
    await fs.writeFile(resultsPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`[AGENT] Saved results.json to ${resultsPath}`);
  }

  /**
   * Cleanup temporary files (delete everything except results.json)
   */
  async cleanup(repoPath) {
    try {
      const folderName = path.basename(repoPath);
      const resultsJsonPath = path.join(repoPath, 'results.json');
      
      // Get all items in the directory
      const items = await fs.readdir(repoPath, { withFileTypes: true });
      
      let deletedCount = 0;
      
      // Delete everything except results.json
      for (const item of items) {
        const itemPath = path.join(repoPath, item.name);
        
        if (item.name === 'results.json') {
          console.log(`[AGENT] 📄 Keeping results.json in ${folderName}`);
          continue;
        }
        
        try {
          if (item.isDirectory()) {
            await fs.rm(itemPath, { recursive: true, force: true });
          } else {
            await fs.unlink(itemPath);
          }
          deletedCount++;
        } catch (err) {
          console.error(`[AGENT] Failed to delete ${item.name}:`, err.message);
        }
      }
      
      console.log(`[AGENT] ✓ Cleaned up ${deletedCount} items from ${folderName}, kept results.json`);
    } catch (error) {
      console.error(`[AGENT] ✗ Cleanup error for ${repoPath}:`, error.message);
    }
  }
}

module.exports = new AgentService();
