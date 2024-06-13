import { login as loginService, logout as logoutService } from '../services/authService';

// Action types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';

/**
 * Check user authentication status and rehydrate the app state on load.
 */
export const checkAuthentication = () => async (dispatch) => {
    try {
        // Retrieves the user from local storage if available
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            dispatch({ type: LOGIN_SUCCESS, payload: { user } });
        } else {
            dispatch({ type: LOGIN_FAIL });
        }
    } catch (error) {
        console.error('Failed to retrieve user:', error);
        dispatch({ type: LOGIN_FAIL });
    }
};

/**
 * Thunk action to handle user login
 * @param {string} emailOrPhone - User's email or phone number
 * @param {string} password - User's password
 */
export const login = (emailOrPhone, password) => async (dispatch) => {
    try {
        const data = await loginService(emailOrPhone, password);
        if (data && data.token) {
            localStorage.setItem('user', JSON.stringify(data)); // Store the user token to keep the session
            dispatch({ type: LOGIN_SUCCESS, payload: { user: data } });
        } else {
            dispatch({ type: LOGIN_FAIL, payload: { error: 'Invalid login credentials' } });
        }
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: { error: error.response ? error.response.data.message : 'Login failed' } });
    }
};

/**
 * Action to handle user logout
 */
export const logout = () => (dispatch) => {
    logoutService();  // Ensure the service cleans up any server-side or cookie-based tokens
    localStorage.removeItem('user');  // Clear user from local storage to clean the session
    dispatch({ type: LOGOUT });
};
