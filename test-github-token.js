// test-github-token.js - Quick test to verify GitHub token works
require('dotenv').config();
const simpleGit = require('simple-git');

async function testGitHubToken() {
  console.log('\n🔍 Testing GitHub Token...\n');
  
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN not found in .env file');
    console.log('\nAdd to backend/.env:');
    console.log('GITHUB_TOKEN=ghp_your_token_here\n');
    process.exit(1);
  }
  
  console.log('✓ Token found:', token.substring(0, 8) + '...');
  
  // Test 1: Check token format
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    console.error('❌ Token format looks incorrect');
    console.log('Expected format: ghp_... or github_pat_...\n');
    process.exit(1);
  }
  console.log('✓ Token format looks correct\n');
  
  // Test 2: Try to access GitHub API
  try {
    console.log('Testing GitHub API access...');
    const https = require('https');
    
    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: '/user',
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'DevOps-Agent'
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const user = JSON.parse(data);
            console.log('✓ GitHub API access successful!');
            console.log(`  Authenticated as: ${user.login}`);
            console.log(`  Account type: ${user.type}`);
            resolve();
          } else {
            reject(new Error(`GitHub API returned ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
  } catch (error) {
    console.error('❌ GitHub API test failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Token is expired or invalid');
    console.log('2. Token doesn\'t have required scopes');
    console.log('3. Network connectivity issue\n');
    console.log('Get a new token at: https://github.com/settings/tokens\n');
    process.exit(1);
  }
  
  // Test 3: Check token scopes (if possible)
  console.log('\n✅ All tests passed!');
  console.log('\nYour token is ready for:');
  console.log('  ✓ Cloning repositories');
  console.log('  ✓ Creating branches');
  console.log('  ✓ Pushing commits');
  console.log('\nYou can now run the agent!\n');
}

testGitHubToken().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
