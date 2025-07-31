require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const WebSocket = require('ws');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });
app.locals.wss = wss; // Hacer accesible el WebSocketServer

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[APP ERROR]', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

module.exports = { app, wss };
