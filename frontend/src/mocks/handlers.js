import { rest } from 'msw';

export const handlers = [
  // Example handler for a login request
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ token: 'fake-token', user: { id: 1, username: 'testuser' } })
    );
  }),
  // Add more handlers for different API endpoints as needed
];
