/**
 * Cougar Rental API
 * Secrets loaded from environment only (no hardcoded credentials).
 */

const express = require('express');
const path = require('path');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

// Config from environment only; no hardcoded fallbacks
const config = {
  apiKey: process.env.API_KEY,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory "database" of cougars available for rent
const cougars = _.sortBy([
  { id: 1, name: 'Whiskers', age: 4, rating: 4.8, pricePerDay: 45 },
  { id: 2, name: 'Shadow', age: 6, rating: 4.9, pricePerDay: 55 },
  { id: 3, name: 'Blaze', age: 3, rating: 4.6, pricePerDay: 40 },
], 'pricePerDay');

// Health check (no secrets exposed)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API: list cougars
app.get('/api/cougars', (req, res) => {
  res.json(cougars);
});

// API: get single cougar (no auth - intentional)
app.get('/api/cougars/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cougar = cougars.find(c => c.id === id);
  if (!cougar) return res.status(404).json({ error: 'Cougar not found' });
  res.json(cougar);
});

// API: create booking — API key via X-API-Key header only (never in URL)
app.post('/api/bookings', (req, res) => {
  const clientKey = req.headers['x-api-key'];
  if (!config.apiKey || clientKey !== config.apiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  const { cougarId, startDate, endDate } = req.body;
  if (!cougarId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  res.json({
    bookingId: 'BKG-' + Date.now(),
    cougarId,
    startDate,
    endDate,
    status: 'confirmed',
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cougar Rental server running at http://localhost:${PORT}`);
});
