// controllers/adminController.js
const MockResponse = require('../models/mockResponse');

exports.getAllMocks = (req, res) => {
    MockResponse.getAll((err, mockResponses) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al recuperar las respuestas mock',
                details: err.message
            });
        }

        res.status(200).json(mockResponses);
    });
};

exports.getMockById = (req, res) => {
    const id = req.params.id;

    MockResponse.getById(id, (err, mockResponse) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al recuperar la respuesta mock',
                details: err.message
            });
        }

        if (!mockResponse) {
            return res.status(404).json({
                error: 'Respuesta mock no encontrada'
            });
        }

        res.status(200).json(mockResponse);
    });
};

exports.createMock = (req, res) => {
    const { path, requesterId, responseBody } = req.body;

    if (!path || !requesterId || !responseBody) {
        return res.status(400).json({
            error: 'Se requieren los campos path, requesterId y responseBody'
        });
    }

    try {
        // Validar que responseBody sea un JSON válido
        JSON.parse(typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody));

        // Almacena responseBody como string JSON
        const responseBodyStr = typeof responseBody === 'string'
            ? responseBody
            : JSON.stringify(responseBody);

        MockResponse.create(path, requesterId, responseBodyStr, (err, id) => {
            if (err) {
                // Verificar si es un error de duplicado (UNIQUE constraint)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({
                        error: 'Ya existe una respuesta mock para esta combinación de path y requesterId'
                    });
                }

                return res.status(500).json({
                    error: 'Error al crear la respuesta mock',
                    details: err.message
                });
            }

            res.status(201).json({
                id: id,
                message: 'Respuesta mock creada correctamente'
            });
        });
    } catch (error) {
        return res.status(400).json({
            error: 'El campo responseBody debe ser un JSON válido',
            details: error.message
        });
    }
};

exports.updateMock = (req, res) => {
    const id = req.params.id;
    const { path, requesterId, responseBody } = req.body;

    if (!path || !requesterId || !responseBody) {
        return res.status(400).json({
            error: 'Se requieren los campos path, requesterId y responseBody'
        });
    }

    try {
        // Validar que responseBody sea un JSON válido
        JSON.parse(typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody));

        // Almacena responseBody como string JSON
        const responseBodyStr = typeof responseBody === 'string'
            ? responseBody
            : JSON.stringify(responseBody);

        MockResponse.update(id, path, requesterId, responseBodyStr, (err, changes) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al actualizar la respuesta mock',
                    details: err.message
                });
            }

            if (changes === 0) {
                return res.status(404).json({
                    error: 'Respuesta mock no encontrada'
                });
            }

            res.status(200).json({
                message: 'Respuesta mock actualizada correctamente'
            });
        });
    } catch (error) {
        return res.status(400).json({
            error: 'El campo responseBody debe ser un JSON válido',
            details: error.message
        });
    }
};

exports.deleteMock = (req, res) => {
    const id = req.params.id;

    MockResponse.delete(id, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al eliminar la respuesta mock',
                details: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: 'Respuesta mock no encontrada'
            });
        }

        res.status(200).json({
            message: 'Respuesta mock eliminada correctamente'
        });
    });
};


