import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Search from '../Search';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Search Component', () => {
    const setup = () => {
        render(<Search />);
    };

    test('renders Search component', () => {
        setup();
        expect(screen.getByPlaceholderText('Search for users or posts...')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });

    test('displays error message on failed search', async () => {
        mock.onGet('http://localhost:5000/api/search?query=test').reply(500);
        setup();

        fireEvent.change(screen.getByPlaceholderText('Search for users or posts...'), { target: { value: 'test' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => expect(screen.getByText('Error fetching search results. Please try again.')).toBeInTheDocument());
    });

    test('displays search results', async () => {
        const searchResults = {
            users: [{ _id: '1', username: 'user1', avatar: 'avatar1.jpg' }],
            posts: [{ _id: '1', content: 'This is a post', author: { username: 'user2', avatar: 'avatar2.jpg' }, videoUrl: 'video.mp4' }]
        };

        mock.onGet('http://localhost:5000/api/search?query=test').reply(200, searchResults);
        setup();

        fireEvent.change(screen.getByPlaceholderText('Search for users or posts...'), { target: { value: 'test' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText('Users')).toBeInTheDocument();
            expect(screen.getByText('Posts')).toBeInTheDocument();
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByText('This is a post')).toBeInTheDocument();
        });
    });

    test('handles no search results', async () => {
        const searchResults = { users: [], posts: [] };
        mock.onGet('http://localhost:5000/api/search?query=test').reply(200, searchResults);
        setup();

        fireEvent.change(screen.getByPlaceholderText('Search for users or posts...'), { target: { value: 'test' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => expect(screen.getByText('No results found.')).toBeInTheDocument());
    });
});
