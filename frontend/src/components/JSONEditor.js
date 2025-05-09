// src/components/JSONEditor.js
import React, { useState, useEffect } from 'react';
import { Form, Button, ButtonGroup } from 'react-bootstrap';

const JSONEditor = ({ value, onChange }) => {
    const [jsonValue, setJsonValue] = useState(value || '{}');
    const [isValid, setIsValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        try {
            // Formato lindo para mostrar
            setJsonValue(JSON.stringify(JSON.parse(value), null, 2));
            setIsValid(true);
            setErrorMsg('');
        } catch (err) {
            setJsonValue(value);
            setIsValid(false);
            setErrorMsg('JSON inválido');
        }
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setJsonValue(newValue);

        try {
            // Validar que sea un JSON válido
            JSON.parse(newValue);
            setIsValid(true);
            setErrorMsg('');
            onChange(newValue);
        } catch (err) {
            setIsValid(false);
            setErrorMsg(`Error: ${err.message}`);
        }
    };

    const handleFormat = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(jsonValue), null, 2);
            setJsonValue(formatted);
            onChange(formatted);
            setIsValid(true);
            setErrorMsg('');
        } catch (err) {
            setErrorMsg(`No se puede formatear: ${err.message}`);
        }
    };

    const handleMinify = () => {
        try {
            const minified = JSON.stringify(JSON.parse(jsonValue));
            setJsonValue(minified);
            onChange(minified);
            setIsValid(true);
            setErrorMsg('');
        } catch (err) {
            setErrorMsg(`No se puede minificar: ${err.message}`);
        }
    };

    const handleClear = () => {
        setJsonValue('{}');
        onChange('{}');
        setIsValid(true);
        setErrorMsg('');
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <Form.Control
                as="textarea"
                rows={isExpanded ? 20 : 10}
                value={jsonValue}
                onChange={handleChange}
                className={`font-monospace ${!isValid ? 'is-invalid' : ''}`}
                style={{ resize: 'vertical' }}
            />
            {!isValid && (
                <Form.Control.Feedback type="invalid">
                    {errorMsg}
                </Form.Control.Feedback>
            )}
            <div className="d-flex justify-content-between mt-2">
                <ButtonGroup>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleFormat}
                        title="Formatear JSON"
                    >
                        Formatear
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleMinify}
                        title="Minificar JSON"
                    >
                        Minificar
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleClear}
                        title="Limpiar editor"
                    >
                        Limpiar
                    </Button>
                </ButtonGroup>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={toggleExpand}
                    title={isExpanded ? "Reducir editor" : "Expandir editor"}
                >
                    {isExpanded ? "Reducir" : "Expandir"}
                </Button>
            </div>
        </div>
    );
};

export default JSONEditor;