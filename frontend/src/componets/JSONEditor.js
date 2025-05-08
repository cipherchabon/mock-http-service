// src/components/JSONEditor.js
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const JSONEditor = ({ value, onChange }) => {
    const [jsonValue, setJsonValue] = useState(value || '{}');
    const [isValid, setIsValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

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

    return (
        <div>
            <Form.Control
                as="textarea"
                rows={10}
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
            <div className="d-flex justify-content-end mt-2">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleFormat}
                >
                    Formatear JSON
                </button>
            </div>
        </div>
    );
};

export default JSONEditor;