const getSystemSummary = (_req, res) => {
  res.json({
    stack: {
      frontend: "React",
      backend: "Node.js + Express",
      language: "JavaScript",
    },
    highlights: [
      "Vite-powered React frontend",
      "Express API with clear route separation",
      "Single-command local development workflow",
    ],
    status: "ready",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getSystemSummary,
};
