import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EditProfile from '../EditProfile';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('EditProfile Component', () => {
    const userId = '12345';
    const userData = {
        username: 'testuser',
        name: 'Test User',
        bio: 'This is a bio',
        pronouns: 'they/them',
        website: 'https://example.com',
        category: 'Technology',
        socialLinks: {
            facebook: 'https://facebook.com/testuser',
            twitter: 'https://twitter.com/testuser',
            instagram: 'https://instagram.com/testuser'
        }
    };

    beforeEach(() => {
        mock.onGet(`http://localhost:5000/api/users/${userId}`).reply(200, userData);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders EditProfile component', async () => {
        render(<EditProfile userId={userId} />);
        expect(await screen.findByPlaceholderText('Username')).toBeInTheDocument();
    });

    test('submits updated profile information', async () => {
        render(<EditProfile userId={userId} />);
        const usernameInput = await screen.findByPlaceholderText('Username');
        fireEvent.change(usernameInput, { target: { value: 'newusername' } });
        fireEvent.click(screen.getByText('Save'));
        expect(mock.history.put.length).toBe(1);
        expect(mock.history.put[0].data).toContain('newusername');
    });
});
