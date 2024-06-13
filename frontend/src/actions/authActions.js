import { login as loginService, logout as logoutService } from '../services/authService';

// Action types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';

// Check user authentication status
export const checkAuthentication = () => async (dispatch) => {
    try {
        // Assume we have a service function to check auth
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: LOGIN_SUCCESS, payload: { user } });
        } else {
            dispatch({ type: LOGIN_FAIL });
        }
    } catch (error) {
        dispatch({ type: LOGIN_FAIL });
    }
};

// Thunk action to handle login
export const login = (emailOrPhone, password) => async (dispatch) => {
    try {
        const data = await loginService(emailOrPhone, password);
        dispatch({ type: LOGIN_SUCCESS, payload: { user: data } });
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: { error: error.response ? error.response.data.message : 'Login failed' } });
    }
};

// Action to handle logout
export const logout = () => (dispatch) => {
    logoutService();
    dispatch({ type: LOGOUT });
};

