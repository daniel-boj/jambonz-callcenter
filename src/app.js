const express = require('express');
const cors = require('cors');
const { handleInboundCall } = require('./controllers/inbound');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));
app.use(express.json());

// Routes
app.post('/api/inbound-call', handleInboundCall);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something got wrong!');
});

module.exports = app;
