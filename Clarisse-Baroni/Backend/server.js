require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
const beneficiaryRoutes = require('./routes/beneficiaries');

const app = express();
const PORT = process.env.PORT || 3000;

/* ─── Connect to MongoDB ─────────────────────────────────── */

connectDB();

/* ─── Middleware ─────────────────────────────────────────── */

app.use(
  cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'null'],
    methods: ['GET', 'POST'],
  })
);

app.use(express.json());

/* ─── Routes ─────────────────────────────────────────────── */

app.use('/api/beneficiaries', beneficiaryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ─── Start server ───────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`FCA backend running on http://localhost:${PORT}`);
});

module.exports = app;