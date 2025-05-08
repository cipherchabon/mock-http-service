// routes/admin.js
const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Rutas para administrar las respuestas mock
router.get('/mocks', adminController.getAllMocks);
router.get('/mocks/:id', adminController.getMockById);
router.post('/mocks', adminController.createMock);
router.put('/mocks/:id', adminController.updateMock);
router.delete('/mocks/:id', adminController.deleteMock);

module.exports = router;