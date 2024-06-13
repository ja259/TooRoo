import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Function to log in the user
export const login = async (emailOrPhone, password) => {
    try {
        const response = await axios.post(`${API_URL}login`, { emailOrPhone, password });
        if (response.data.token) {
            // Storing user details and token in local storage to keep user logged in
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        // Return detailed error information for proper error handling in the UI
        return {
            success: false,
            message: error.response?.data?.message || 'Unable to login. Please check your credentials.'
        };
    }
};

// Function to log out the user
export const logout = () => {
    // Clear user token and profile data from local storage to log user out
    localStorage.removeItem('user');
};

// Optionally, you might want to include a utility function to check if the user is logged in
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

export default {
    login,
    logout,
    getCurrentUser
};
