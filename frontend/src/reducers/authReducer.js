// src/reducers/authReducer.js
const initialState = {
    isAuthenticated: false,
    user: null,
    error: null
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                error: null
            };
        case 'LOGIN_FAIL':
            return {
                ...state,
                error: action.payload.error
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        default:
            return state;
    }
};

export default authReducer;
