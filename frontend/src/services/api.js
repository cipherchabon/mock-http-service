// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const fetchMocks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/mocks`, {
            headers: defaultHeaders,
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching mocks:', error);
        throw error;
    }
};

export const createMock = async (mockData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/mocks`, {
            method: 'POST',
            headers: defaultHeaders,
            credentials: 'include',
            body: JSON.stringify(mockData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating mock:', error);
        throw error;
    }
};

export const updateMock = async (id, mockData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/mocks/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            credentials: 'include',
            body: JSON.stringify(mockData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating mock:', error);
        throw error;
    }
};

export const deleteMock = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/mocks/${id}`, {
            method: 'DELETE',
            headers: defaultHeaders,
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting mock:', error);
        throw error;
    }
};
