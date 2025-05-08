// controllers/mockController.js
const MockResponse = require('../models/mockResponse');

exports.handleMockRequest = (req, res) => {
    const path = req.path;
    const requesterId = req.query.requesterId;

    if (!requesterId) {
        return res.status(400).json({
            error: 'Se requiere el parámetro requesterId'
        });
    }

    MockResponse.getByPathAndRequesterId(path, requesterId, (err, mockResponse) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al recuperar la respuesta mock',
                details: err.message
            });
        }

        if (!mockResponse) {
            return res.status(404).json({
                error: 'No se encontró una respuesta mock para esta combinación de path y requesterId',
                path: path,
                requesterId: requesterId
            });
        }

        try {
            // Parsear el JSON almacenado y devolverlo
            const responseBody = JSON.parse(mockResponse.response_body);
            return res.status(200).json(responseBody);
        } catch (error) {
            return res.status(500).json({
                error: 'Error al parsear la respuesta mock almacenada',
                details: error.message
            });
        }
    });
};

