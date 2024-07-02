import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Timeline from '../Timeline';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Timeline Component', () => {
    const setup = () => {
        render(<Timeline />);
    };

    test('renders Timeline component', () => {
        setup();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/timeline-posts').reply(500);
        setup();
        await waitFor(() => expect(screen.getByText('Error fetching posts')).toBeInTheDocument());
    });

    test('displays posts on success', async () => {
        const posts = [
            {
                _id: '1',
                content: 'This is a post',
                author: { username: 'user1', profilePicture: 'avatar1.jpg' },
                likes: 0
            }
        ];
        mock.onGet('http://localhost:5000/api/timeline-posts').reply(200, posts);
        setup();
        await waitFor(() => {
            expect(screen.getByText('This is a post')).toBeInTheDocument();
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByAltText('user1')).toHaveAttribute('src', 'avatar1.jpg');
        });
    });

    test('handles like button click', async () => {
        const posts = [
            {
                _id: '1',
                content: 'This is a post',
                author: { username: 'user1', profilePicture: 'avatar1.jpg' },
                likes: 0
            }
        ];
        mock.onGet('http://localhost:5000/api/timeline-posts').reply(200, posts);
        mock.onPut('http://localhost:5000/api/posts/1/like').reply(200);
        setup();
        await waitFor(() => {
            fireEvent.click(screen.getByTitle('Like'));
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });
});
