
// src/components/MockList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { fetchMocks, deleteMock } from '../services/api';

const MockList = ({ onEditMock }) => {
    const [mocks, setMocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMocks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchMocks();
            setMocks(data);
        } catch (err) {
            setError('Error al cargar las configuraciones mock');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMocks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta configuración mock?')) {
            try {
                await deleteMock(id);
                // Recargar la lista después de eliminar
                loadMocks();
            } catch (err) {
                setError('Error al eliminar la configuración mock');
                console.error(err);
            }
        }
    };

    // Función para truncar y formatear el JSON para mostrar en la tabla
    const formatResponsePreview = (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            const stringified = JSON.stringify(parsed, null, 2);
            return stringified.length > 100
                ? stringified.substring(0, 100) + '...'
                : stringified;
        } catch (err) {
            return 'Error al parsear JSON';
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Configuraciones Mock</h2>
                <Button variant="primary" onClick={() => onEditMock(null)}>
                    Crear Nuevo Mock
                </Button>
            </div>

            {mocks.length === 0 ? (
                <Alert variant="info">
                    No hay configuraciones mock definidas. Crea una nueva para comenzar.
                </Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Requester ID</th>
                            <th>Respuesta (Preview)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mocks.map((mock) => (
                            <tr key={mock.id}>
                                <td>
                                    <Badge bg="secondary">{mock.path}</Badge>
                                </td>
                                <td>{mock.requester_id}</td>
                                <td>
                                    <pre className="response-preview">
                                        {formatResponsePreview(mock.response_body)}
                                    </pre>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => onEditMock(mock)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(mock.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default MockList;

