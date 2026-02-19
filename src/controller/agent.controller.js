// src/controller/agent.controller.js
const agentService = require('../services/agent.service');

const runAgent = async (req, res) => {
  try {
    const { repoUrl, teamName, leaderName } = req.body;

    if (!repoUrl || !teamName || !leaderName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // User ID from JWT (protect middleware se aayega)
    const userId = req.user.userId;

    // Agent trigger karo
    const result = await agentService.runAgent({
      repoUrl,
      teamName,
      leaderName,
      userId,
    });

    console.log("Result from agentService:", result);

    // Return result directly (already has success, message, results)
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { runAgent };