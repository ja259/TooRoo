import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../Chat';
import '@testing-library/jest-dom/extend-expect';

const user = { blockedUsers: [] };

describe('Chat Component', () => {
    test('renders chat component with header and input', () => {
        render(<Chat user={user} />);
        expect(screen.getByText('Chat')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    test('sends a message', () => {
        render(<Chat user={user} />);
        const input = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(screen.getByRole('button', { name: /FaPaperPlane/i }));
        expect(input.value).toBe('');
    });
});
