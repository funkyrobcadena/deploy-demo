const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from your deployed app!',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint — PaaS platforms use this to verify the app is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/version', (req, res) => {
  res.json({ version: process.env.APP_VERSION || 'dev' });
});

// Returns the current server time in a couple of common formats
app.get('/time', (req, res) => {
  const now = new Date();
  res.json({
    iso: now.toISOString(),
    unix: Math.floor(now.getTime() / 1000),
  });
});

// Echoes back whatever JSON body the caller sends
app.post('/echo', (req, res) => {
  res.json({ youSent: req.body });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
