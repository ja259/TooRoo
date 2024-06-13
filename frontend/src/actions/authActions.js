// src/actions/authActions.js
import { login as loginService, logout as logoutService } from '../services/authService';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';

export const login = (emailOrPhone, password) => async (dispatch) => {
    try {
        const data = await loginService(emailOrPhone, password);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message || 'Login failed' });
    }
};

export const logout = () => (dispatch) => {
    logoutService();
    dispatch({ type: LOGOUT });
};

