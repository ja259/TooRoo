import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Notifications from '../Notifications';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Notifications Component', () => {
    const notifications = [
        { _id: '1', message: 'Notification 1' },
        { _id: '2', message: 'Notification 2' }
    ];

    beforeEach(() => {
        mock.onGet('http://localhost:5000/api/notifications').reply(200, notifications);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders Notifications component', async () => {
        render(<Notifications />);
        expect(await screen.findByText('Notifications')).toBeInTheDocument();
    });

    test('fetches and displays notifications', async () => {
        render(<Notifications />);
        await waitFor(() => {
            expect(screen.getByText('Notification 1')).toBeInTheDocument();
            expect(screen.getByText('Notification 2')).toBeInTheDocument();
        });
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/notifications').reply(500);
        render(<Notifications />);
        expect(await screen.findByText('Failed to fetch notifications')).toBeInTheDocument();
    });
});
