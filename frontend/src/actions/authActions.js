import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data, success, message } = await authService.register(username, email, password);
      if (success) {
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      } else {
        return rejectWithValue(message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ emailOrPhone, password }, { rejectWithValue }) => {
    try {
      const { data, success, message } = await authService.login(emailOrPhone, password);
      if (success) {
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      } else {
        return rejectWithValue(message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
  localStorage.removeItem('user');
});

const authActions = {
  register,
  login,
  logout
};

export default authActions;
