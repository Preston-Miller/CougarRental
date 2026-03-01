/**
 * Cougar Rental API - Security scanner test target
 * Contains intentional vulnerabilities for testing
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const _ = require('lodash'); // vulnerable: 4.17.15 has prototype pollution CVE

// --- INTENTIONAL: Hardcoded secrets (common agent mistake) ---
const API_KEY = 'REPLACE_ME_API_KEY_HARDCODED_SECRET';
const DB_PASSWORD = 'REPLACE_ME_DB_PASSWORD_HARDCODED';
const JWT_SECRET = 'REPLACE_ME_JWT_SECRET_HARDCODED';
const STRIPE_SECRET = 'REPLACE_ME_STRIPE_SECRET_HARDCODED';
const AWS_ACCESS_KEY = 'REPLACE_ME_AWS_ACCESS_KEY_HARDCODED';
const AWS_SECRET_KEY = 'REPLACE_ME_AWS_SECRET_KEY_HARDCODED';

const app = express();
const PORT = process.env.PORT || 3000;

// Load .env if present (we also expose it via a route below - intentional)
require('dotenv').config();

// In production we'd use process.env - but fallback to hardcoded (bad!)
const config = {
  apiKey: process.env.API_KEY || API_KEY,
  dbUrl: process.env.DATABASE_URL || `postgres://admin:${DB_PASSWORD}@localhost:5432/cougar_rental`,
  jwtSecret: process.env.JWT_SECRET || JWT_SECRET,
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

// --- INTENTIONAL: Debug route that exposes .env contents ---
app.get('/api/debug/config', (req, res) => {
  // Common mistake: exposing config in "debug" or "health" endpoints
  const envPath = path.join(__dirname, '.env');
  let envContents = '';
  if (fs.existsSync(envPath)) {
    envContents = fs.readFileSync(envPath, 'utf8');
  }
  res.json({
    config,
    envFileContents: envContents || 'No .env file',
    nodeEnv: process.env.NODE_ENV,
  });
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

// API: "create booking" - accepts API key in query string (bad practice)
app.post('/api/bookings', (req, res) => {
  const clientKey = req.query.api_key || req.headers['x-api-key'];
  if (clientKey !== config.apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
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
  console.log('Debug config (intentional): GET /api/debug/config');
});
