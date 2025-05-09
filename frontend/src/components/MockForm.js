// src/components/MockForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Modal } from 'react-bootstrap';
import { createMock, updateMock } from '../services/api';
import JSONEditor from './JSONEditor';

const MockForm = ({ initialMock, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        path: '',
        requesterId: '',
        responseBody: '{}'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validated, setValidated] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        if (initialMock) {
            try {
                setFormData({
                    path: initialMock.path,
                    requesterId: initialMock.requester_id,
                    responseBody: initialMock.response_body
                });
                setIsEditing(true);
            } catch (err) {
                setError('Error al cargar los datos del mock para edición');
                console.error(err);
            }
        }
    }, [initialMock]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleJsonChange = (newJson) => {
        setFormData({
            ...formData,
            responseBody: newJson
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        // Validar que el responseBody sea un JSON válido
        try {
            JSON.parse(formData.responseBody);
        } catch (err) {
            setError('La respuesta debe ser un JSON válido');
            return;
        }

        try {
            setError(null);
            setSuccess(null);

            if (isEditing && initialMock) {
                await updateMock(initialMock.id, {
                    path: formData.path,
                    requesterId: formData.requesterId,
                    responseBody: formData.responseBody
                });
                setSuccess('Configuración mock actualizada correctamente');
            } else {
                await createMock({
                    path: formData.path,
                    requesterId: formData.requesterId,
                    responseBody: formData.responseBody
                });
                setSuccess('Configuración mock creada correctamente');
            }

            // Limpiar el formulario después de éxito
            if (!isEditing) {
                setFormData({
                    path: '',
                    requesterId: '',
                    responseBody: '{}'
                });
            }

            setTimeout(() => {
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
            }, 1500);

        } catch (err) {
            setError(err.message || 'Error al guardar la configuración mock');
            console.error(err);
        }
    };

    // Helper para generar URL de ejemplo
    const getExampleUrl = () => {
        const baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
        const path = formData.path || '/example/path';
        const requesterId = formData.requesterId || 'exampleRequesterId';
        return `${baseUrl}/api${path}?requesterId=${requesterId}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert('URL copiada al portapapeles'),
            () => alert('Error al copiar la URL')
        );
    };

    const testResponse = async () => {
        try {
            const response = await fetch(getExampleUrl());
            const data = await response.json();
            setTestResult({
                status: response.status,
                data: data
            });
            setShowTestModal(true);
        } catch (err) {
            setError('Error al probar la respuesta: ' + err.message);
        }
    };

    return (
        <div>
            <h2>{isEditing ? 'Editar Configuración Mock' : 'Crear Nueva Configuración Mock'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Path</Form.Label>
                    <Form.Control
                        type="text"
                        name="path"
                        value={formData.path}
                        onChange={handleInputChange}
                        placeholder="/ejemplo/ruta"
                        required
                    />
                    <Form.Text className="text-muted">
                        El path debe comenzar con / (ejemplo: /api/productos)
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                        Por favor ingresa un path válido
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Requester ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="requesterId"
                        value={formData.requesterId}
                        onChange={handleInputChange}
                        placeholder="ID del solicitante"
                        required
                    />
                    <Form.Text className="text-muted">
                        Identificador único del solicitante
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                        Por favor ingresa un requesterId
                    </Form.Control.Feedback>
                </Form.Group>

                <Card className="mb-3">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>URL de Ejemplo</span>
                        <div>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-2"
                                onClick={() => copyToClipboard(getExampleUrl())}
                            >
                                Copiar URL
                            </Button>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={testResponse}
                                disabled={!formData.path || !formData.requesterId}
                            >
                                Probar Respuesta
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <code>{getExampleUrl()}</code>
                    </Card.Body>
                </Card>

                <Form.Group className="mb-3">
                    <Form.Label>Respuesta JSON</Form.Label>
                    <JSONEditor
                        value={formData.responseBody}
                        onChange={handleJsonChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isEditing ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={onSubmitSuccess}
                >
                    Cancelar
                </Button>
            </Form>

            <Modal show={showTestModal} onHide={() => setShowTestModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Resultado de la Prueba</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Status: {testResult?.status}</h5>
                    <pre className="bg-light p-3 rounded">
                        {JSON.stringify(testResult?.data, null, 2)}
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTestModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MockForm;

