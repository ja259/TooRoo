import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UserAnalytics from '../UserAnalytics';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('UserAnalytics Component', () => {
    const setup = () => {
        render(<UserAnalytics />);
    };

    test('renders UserAnalytics component', () => {
        setup();
        expect(screen.getByText('User Analytics')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/analytics').reply(500);
        setup();
        await waitFor(() => expect(screen.getByText('Failed to fetch analytics')).toBeInTheDocument());
    });

    test('displays analytics data on success', async () => {
        const analyticsData = {
            posts: 10,
            followers: 5,
            likes: 20,
            comments: 15
        };
        mock.onGet('http://localhost:5000/api/analytics').reply(200, analyticsData);
        setup();
        await waitFor(() => {
            expect(screen.getByText('Posts')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('Followers')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('Likes')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();
            expect(screen.getByText('Comments')).toBeInTheDocument();
            expect(screen.getByText('15')).toBeInTheDocument();
        });
    });
});
