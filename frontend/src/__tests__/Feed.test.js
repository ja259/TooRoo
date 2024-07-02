import React from 'react';
import { render, screen } from '@testing-library/react';
import Feed from '../Feed';
import '@testing-library/jest-dom/extend-expect';

describe('Feed Component', () => {
    const user = {
        posts: [
            { _id: '1', content: 'Post 1' },
            { _id: '2', content: 'Post 2' }
        ]
    };

    test('renders Feed component', () => {
        render(<Feed user={user} onPost={jest.fn()} onLike={jest.fn()} onComment={jest.fn()} />);
        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
});
