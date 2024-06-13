import { createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService, logout as logoutService, register as registerService } from '../services/authService';

// Thunk to handle user registration
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerService(username, email, password);
      localStorage.setItem('user', JSON.stringify(data)); // Store user info in localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);

// Thunk to handle user login
export const login = createAsyncThunk(
  'auth/login',
  async ({ emailOrPhone, password }, { rejectWithValue }) => {
    try {
      const data = await loginService(emailOrPhone, password);
      localStorage.setItem('user', JSON.stringify(data));  // Store user info in localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

// Thunk to handle user logout
export const logout = createAsyncThunk('auth/logout', async () => {
  logoutService();
  localStorage.removeItem('user');  // Clear user data from localStorage
});

export default {
  register,
  login,
  logout
};
