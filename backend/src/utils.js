// backend/src/utils.js
function parseInput(data) {
    const lines = data.trim().split('\n');
    const n = parseInt(lines[0], 10);
    const agents = [];
  
    for (let i = 1; i <= n; i++) {
      const [opinion, receptivity] = lines[i].split(',').map(Number);
      agents.push({ opinion, receptivity });
    }
  
    const R_max = parseInt(lines[n + 1], 10);
  
    return { agents, R_max };
  }
  
  module.exports = { parseInput };
  