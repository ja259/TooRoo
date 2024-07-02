import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Call from '../Call';
import '@testing-library/jest-dom/extend-expect';

describe('Call Component', () => {
    test('renders call buttons when not in call', () => {
        render(<Call />);
        expect(screen.getByRole('button', { name: /FaPhoneAlt/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /FaVideo/i })).toBeInTheDocument();
    });

    test('renders video and end call button when in call', async () => {
        render(<Call />);
        fireEvent.click(screen.getByRole('button', { name: /FaVideo/i }));
        expect(await screen.findByRole('button', { name: /End Call/i })).toBeInTheDocument();
    });
});
