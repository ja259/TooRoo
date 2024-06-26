import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}register`, formData, { withCredentials: true });
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

const login = async (emailOrPhone, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { emailOrPhone, password }, { withCredentials: true });
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

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout
};

export default authService;
