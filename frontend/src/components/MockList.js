import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { fetchMocks, deleteMock } from '../services/api';

const MockList = ({ onEditMock }) => {
    const [mocks, setMocks] = useState([]);
    const [filteredMocks, setFilteredMocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadMocks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchMocks();
            setMocks(data);
            setFilteredMocks(data);
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

    useEffect(() => {
        const filtered = mocks.filter(mock =>
            mock.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mock.requester_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMocks(filtered);
    }, [searchTerm, mocks]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta configuración mock?')) {
            try {
                await deleteMock(id);
                loadMocks();
            } catch (err) {
                setError('Error al eliminar la configuración mock');
                console.error(err);
            }
        }
    };

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert('Copiado al portapapeles'),
            () => alert('Error al copiar')
        );
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

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Buscar por path o requesterId..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <Button
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                    >
                        Limpiar
                    </Button>
                )}
            </InputGroup>

            {filteredMocks.length === 0 ? (
                <Alert variant="info">
                    {searchTerm
                        ? 'No se encontraron resultados para la búsqueda.'
                        : 'No hay configuraciones mock definidas. Crea una nueva para comenzar.'}
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
                        {filteredMocks.map((mock) => (
                            <tr key={mock.id}>
                                <td>
                                    <Badge bg="secondary">{mock.path}</Badge>
                                </td>
                                <td>{mock.requester_id}</td>
                                <td>
                                    <pre className="response-preview mb-0">
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