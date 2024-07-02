import authReducer from '../authReducer';
import { register, login, logout } from '../../actions/authActions';

describe('Auth Reducer', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    error: null,
  };

  it('handles register fulfilled', () => {
    const action = { type: register.fulfilled.type, payload: { token: 'token' } };
    const state = authReducer(initialState, action);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ token: 'token' });
    expect(state.error).toBeNull();
  });

  it('handles login fulfilled', () => {
    const action = { type: login.fulfilled.type, payload: { token: 'token' } };
    const state = authReducer(initialState, action);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ token: 'token' });
    expect(state.error).toBeNull();
  });

  it('handles logout fulfilled', () => {
    const action = { type: logout.fulfilled.type };
    const state = authReducer(initialState, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });
});
