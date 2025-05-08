// routes/api.js
const express = require('express');
const mockController = require('../controllers/mockController');

const router = express.Router();

// Esta ruta intercepta todas las peticiones GET a /api/*
router.get('*', mockController.handleMockRequest);

module.exports = router;
