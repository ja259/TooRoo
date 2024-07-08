import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Feed from '../Feed';
import '@testing-library/jest-dom/extend-expect';

describe('Feed Component', () => {
    const user = {
        posts: [
            { _id: '1', content: 'Post 1' },
            { _id: '2', content: 'Post 2' }
        ]
    };

    const onLike = jest.fn();
    const onComment = jest.fn();

    test('renders Feed component', () => {
        render(<Feed user={user} onPost={jest.fn()} onLike={onLike} onComment={onComment} />);
        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 2')).toBeInTheDocument();
    });

    test('calls onLike when like button is clicked', () => {
        render(<Feed user={user} onPost={jest.fn()} onLike={onLike} onComment={onComment} />);
        fireEvent.click(screen.getByText('Like')); // Assuming your Post component has a "Like" button with this text
        expect(onLike).toHaveBeenCalledWith('1'); // Ensure it was called with the correct post ID
    });

    test('calls onComment when comment is submitted', () => {
        render(<Feed user={user} onPost={jest.fn()} onLike={onLike} onComment={onComment} />);
        fireEvent.submit(screen.getByTestId('comment-form'), { target: { comment: { value: 'Nice post!' } } }); // Assuming you have a form with data-testid="comment-form"
        expect(onComment).toHaveBeenCalledWith('1', 'Nice post!'); // Ensure it was called with the correct post ID and comment
    });
});
