import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Function to log in the user
export const login = async (emailOrPhone, password) => {
    const response = await axios.post(`${API_URL}login`, { emailOrPhone, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Function to log out the user
export const logout = () => {
    localStorage.removeItem('user');
};

export default {
    login,
    logout,
};
