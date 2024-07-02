import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Following from '../Following';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Following Component', () => {
    const videoData = [
        {
            _id: '1',
            videoUrl: 'video1.mp4',
            author: { avatar: 'avatar1.jpg', username: 'user1' },
            description: 'Video 1 description',
            likes: ['user1', 'user2'],
            comments: [],
            shares: 5
        },
        {
            _id: '2',
            videoUrl: 'video2.mp4',
            author: { avatar: 'avatar2.jpg', username: 'user2' },
            description: 'Video 2 description',
            likes: ['user1'],
            comments: [],
            shares: 2
        }
    ];

    beforeEach(() => {
        mock.onGet('http://localhost:5000/api/posts/following-videos').reply(200, videoData);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders Following component', async () => {
        render(<Following />);
        expect(await screen.findByText('Loading...')).toBeInTheDocument();
    });

    test('displays video content', async () => {
        render(<Following />);
        expect(await screen.findByText('Video 1 description')).toBeInTheDocument();
        expect(await screen.findByText('Video 2 description')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/posts/following-videos').reply(500);
        render(<Following />);
        expect(await screen.findByText('Error fetching videos')).toBeInTheDocument();
    });
});
