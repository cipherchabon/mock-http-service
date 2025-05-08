// src/App.js
import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import MockList from './components/MockList';
import MockForm from './components/MockForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [activePage, setActivePage] = useState('list');
    const [editingMock, setEditingMock] = useState(null);

    const handleEditMock = (mock) => {
        setEditingMock(mock);
        setActivePage('form');
    };

    const handleFormSubmit = () => {
        setEditingMock(null);
        setActivePage('list');
    };

    return (
        <Container fluid className="p-4">
            <h1 className="mb-4">Mock HTTP Service - Administrador</h1>

            <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                    <Nav.Link
                        active={activePage === 'list'}
                        onClick={() => { setActivePage('list'); setEditingMock(null); }}
                    >
                        Lista de Mocks
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        active={activePage === 'form'}
                        onClick={() => { setActivePage('form'); setEditingMock(null); }}
                    >
                        {editingMock ? 'Editar Mock' : 'Crear Nuevo Mock'}
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Row>
                <Col>
                    {activePage === 'list' ? (
                        <MockList onEditMock={handleEditMock} />
                    ) : (
                        <MockForm
                            initialMock={editingMock}
                            onSubmitSuccess={handleFormSubmit}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
