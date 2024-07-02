import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VirtualEvents from '../VirtualEvents';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('VirtualEvents Component', () => {
    const setup = () => {
        render(<VirtualEvents />);
    };

    test('renders VirtualEvents component', () => {
        setup();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/virtual-events').reply(500);
        setup();
        await waitFor(() => expect(screen.getByText('Error fetching events')).toBeInTheDocument());
    });

    test('displays events on success', async () => {
        const events = [{ _id: '1', title: 'Event 1', description: 'Event 1 Description', host: { username: 'user1' } }];
        mock.onGet('http://localhost:5000/api/virtual-events').reply(200, events);
        setup();
        await waitFor(() => {
            expect(screen.getByText('Event 1')).toBeInTheDocument();
            expect(screen.getByText('Event 1 Description')).toBeInTheDocument();
            expect(screen.getByText('Hosted by: user1')).toBeInTheDocument();
        });
    });
});
