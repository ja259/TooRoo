import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Function to register the user
export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}register`, { username, email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed.'
        };
    }
};

// Function to log in the user
export const login = async (emailOrPhone, password) => {
    try {
        const response = await axios.post(`${API_URL}login`, { emailOrPhone, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Unable to login. Please check your credentials.'
        };
    }
};

// Function to log out the user
export const logout = () => {
    localStorage.removeItem('user');
};

export default {
    register,
    login,
    logout
};
