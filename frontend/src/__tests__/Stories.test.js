import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Stories from '../Stories';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Stories Component', () => {
    const setup = () => {
        render(<Stories />);
    };

    test('renders Stories component', () => {
        setup();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/stories').reply(500);
        setup();
        await waitFor(() => expect(screen.getByText('Error fetching stories')).toBeInTheDocument());
    });

    test('displays stories on success', async () => {
        const stories = [{ _id: '1', imageUrl: 'image1.jpg', author: { username: 'user1' } }];
        mock.onGet('http://localhost:5000/api/stories').reply(200, stories);
        setup();
        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByAltText('story')).toHaveAttribute('src', 'image1.jpg');
        });
    });
});
