import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../Profile';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';

const mock = new MockAdapter(axios);

describe('Profile Component', () => {
    const user = {
        _id: '1',
        username: 'testuser',
        avatar: 'avatar.jpg',
        bio: 'This is a bio',
        following: [],
        followers: [],
        posts: [],
        videos: [],
        isFollowing: false
    };

    beforeEach(() => {
        mock.onGet(`http://localhost:5000/api/users/1`).reply(200, user);
    });

    afterEach(() => {
        mock.reset();
    });

    const setup = (isCurrentUser = false) => {
        render(
            <Router>
                <Profile userId="1" isCurrentUser={isCurrentUser} />
            </Router>
        );
    };

    test('renders Profile component', async () => {
        setup();
        expect(await screen.findByText('testuser')).toBeInTheDocument();
    });

    test('displays user bio and avatar', async () => {
        setup();
        expect(await screen.findByText('This is a bio')).toBeInTheDocument();
        expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'avatar.jpg');
    });

    test('handles follow/unfollow action', async () => {
        setup();
        fireEvent.click(await screen.findByText('Follow'));
        await waitFor(() => {
            expect(mock.history.post.length).toBe(1);
        });
    });

    test('switches between text and video tabs', async () => {
        setup();
        fireEvent.click(await screen.findByText('Video'));
        expect(screen.getByText('Text')).not.toHaveClass('active');
        expect(screen.getByText('Video')).toHaveClass('active');
    });
});
