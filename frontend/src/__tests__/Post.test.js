import React from 'react';
import { render, screen } from '@testing-library/react';
import Post from '../Post';
import '@testing-library/jest-dom/extend-expect';

describe('Post Component', () => {
    const post = {
        author: {
            username: 'user1',
            profilePicture: 'user1.jpg'
        },
        content: 'This is a post',
        videoUrl: 'video.mp4'
    };

    test('renders Post component', () => {
        render(<Post post={post} />);
        expect(screen.getByText('This is a post')).toBeInTheDocument();
    });

    test('displays post author and content', () => {
        render(<Post post={post} />);
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('This is a post')).toBeInTheDocument();
    });

    test('displays video if provided', () => {
        render(<Post post={post} />);
        expect(screen.getByRole('video')).toBeInTheDocument();
    });
});
