// routes/apiRoutes.js
const express = require('express');
const { handleInboundCall } = require('../controllers/inboundController');

const router = express.Router();

router.post('/inbound', handleInboundCall);

module.exports = router;
