import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = async (username, email, phone, password, securityQuestions) => {
  try {
    const response = await axios.post(`${API_URL}register`, { username, email, phone, password, securityQuestions });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Registration failed.' };
  }
};

const login = async (emailOrPhone, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { emailOrPhone, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Unable to login. Please check your credentials.' };
  }
};

const forgotPassword = async (email) => {
  try {
    await axios.post(`${API_URL}forgot-password`, { email });
    return { success: true, message: 'Password reset link has been sent to your email.' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to send password reset link.' };
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  forgotPassword,
  logout,
};

export default authService;
