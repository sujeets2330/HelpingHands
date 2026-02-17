import axios from 'axios';


const API_URL = 'http://localhost:9090';

export const register = async (name, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Registration failed.' };
    }
};


export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
