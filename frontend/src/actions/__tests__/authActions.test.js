import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { register, login, logout } from '../authActions';
import authService from '../../services/authService';

jest.mock('../../services/authService');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

beforeEach(() => {
  store = mockStore({
    auth: { user: null, isAuthenticated: false },
  });
});

describe('Auth Actions', () => {
  it('dispatches register action and returns success', async () => {
    authService.register.mockResolvedValue({ success: true, data: { token: 'token' } });

    await store.dispatch(register({ username: 'test', email: 'test@test.com', password: 'password' }));

    const actions = store.getActions();
    expect(actions[0].type).toEqual('auth/register/pending');
    expect(actions[1].type).toEqual('auth/register/fulfilled');
  });

  it('dispatches login action and returns success', async () => {
    authService.login.mockResolvedValue({ success: true, data: { token: 'token' } });

    await store.dispatch(login({ emailOrPhone: 'test@test.com', password: 'password' }));

    const actions = store.getActions();
    expect(actions[0].type).toEqual('auth/login/pending');
    expect(actions[1].type).toEqual('auth/login/fulfilled');
  });

  it('dispatches logout action', async () => {
    await store.dispatch(logout());

    const actions = store.getActions();
    expect(actions[0].type).toEqual('auth/logout/pending');
    expect(actions[1].type).toEqual('auth/logout/fulfilled');
  });
});
