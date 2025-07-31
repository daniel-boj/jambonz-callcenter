// config/mistral.js
require('dotenv').config();
const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.MISTRAL_ENDPOINT || 'https://api.mistral.ai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});
