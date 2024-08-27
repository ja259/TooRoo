import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = async (username, email, phone, password, securityQuestions) => {
  try {
    const response = await axios.post(
      `${API_URL}register`,
      { username, email, phone, password, securityQuestions },
      { withCredentials: true }
    );
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'Registration failed.';
    if (error.response) {
      if (error.response.status === 409) {
        errorMessage = error.response.data.message || 'User already exists. Please use a different email or username.';
      } else {
        errorMessage = error.response.data.message || errorMessage;
      }
    }
    return { success: false, message: errorMessage };
  }
};

const login = async (emailOrPhone, password) => {
  try {
    const response = await axios.post(
      `${API_URL}login`,
      { emailOrPhone, password },
      { withCredentials: true }
    );
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    // Check if additional steps are required after login
    if (response.data.twoFactorRequired) {
      return {
        success: true,
        data: response.data,
        twoFactorRequired: true,
      };
    }

    if (response.data.newUser) {
      return {
        success: true,
        data: response.data,
        newUser: true,
      };
    }

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'Unable to login. Please check your credentials.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return { success: false, message: errorMessage };
  }
};

const forgotPassword = async (email) => {
  try {
    await axios.post(`${API_URL}forgot-password`, { email });
    return { success: true, message: 'Password reset link has been sent to your email.' };
  } catch (error) {
    let errorMessage = 'Failed to send password reset link.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return { success: false, message: errorMessage };
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  forgotPassword,
  logout
};

export default authService;
