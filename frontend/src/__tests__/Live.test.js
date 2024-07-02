import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Live from '../Live';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Live Component', () => {
    const liveVideos = [
        {
            _id: 'video1',
            url: 'video1.mp4',
            title: 'Live Video 1',
            author: { username: 'User1', avatar: 'user1.jpg' }
        },
        {
            _id: 'video2',
            url: 'video2.mp4',
            title: 'Live Video 2',
            author: { username: 'User2', avatar: 'user2.jpg' }
        }
    ];

    beforeEach(() => {
        mock.onGet('http://localhost:5000/api/live').reply(200, liveVideos);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders Live component', async () => {
        render(<Live />);
        expect(await screen.findByText('🔴 Live Videos')).toBeInTheDocument();
    });

    test('fetches and displays live videos', async () => {
        render(<Live />);
        expect(await screen.findByText('Live Video 1')).toBeInTheDocument();
        expect(await screen.findByText('Live Video 2')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/live').reply(500);
        render(<Live />);
        expect(await screen.findByText('Failed to fetch live videos')).toBeInTheDocument();
    });
});
