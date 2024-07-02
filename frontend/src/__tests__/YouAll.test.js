import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import YouAll from '../YouAll';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('YouAll Component', () => {
    const setup = () => {
        render(<YouAll />);
    };

    test('renders YouAll component', () => {
        setup();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/media/you-all-videos').reply(500);
        setup();
        await waitFor(() => expect(screen.getByText('Error fetching videos')).toBeInTheDocument());
    });

    test('displays videos on success', async () => {
        const videos = [
            {
                _id: '1',
                videoUrl: 'video1.mp4',
                author: { username: 'user1', avatar: 'avatar1.jpg' },
                description: 'Video 1 Description',
                likes: [],
                comments: [],
                shares: 0
            }
        ];
        mock.onGet('http://localhost:5000/api/media/you-all-videos').reply(200, { videos });
        setup();
        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByText('Video 1 Description')).toBeInTheDocument();
            expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'avatar1.jpg');
        });
    });
});
