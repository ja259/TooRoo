import axios from 'axios';
import authService from '../authService';

jest.mock('axios');

describe('Auth Service', () => {
  it('registers a user successfully', async () => {
    axios.post.mockResolvedValue({ data: { token: 'token' } });

    const response = await authService.register('username', 'email', 'phone', 'password', []);
    expect(response.success).toBe(true);
    expect(response.data.token).toBe('token');
  });

  it('logs in a user successfully', async () => {
    axios.post.mockResolvedValue({ data: { token: 'token' } });

    const response = await authService.login('emailOrPhone', 'password');
    expect(response.success).toBe(true);
    expect(response.data.token).toBe('token');
  });

  it('logs out a user', () => {
    authService.logout();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
