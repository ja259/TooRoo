import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}register`, { username, email, password }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    const { data } = response;
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
      setAuthToken(data.token);
    }
    return {
      success: true,
      data: data
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
    console.log('Sending login request:', { emailOrPhone, password });
    const response = await axios.post(`${API_URL}login`, { emailOrPhone, password }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    const { data } = response;
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
      setAuthToken(data.token);
    }
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Login error:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || 'Unable to login. Please check your credentials.'
    };
  }
};

const logout = () => {
  localStorage.removeItem('user');
  setAuthToken(null);
};

const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getUser
};

export default authService;

