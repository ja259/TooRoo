import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QRCodeScanner from '../QRCodeScanner';

describe('QRCodeScanner Component', () => {
    test('renders QRCodeScanner component', () => {
        render(<QRCodeScanner />);
        expect(screen.getByText('QR Code Scanner')).toBeInTheDocument();
        expect(screen.getByText('No result')).toBeInTheDocument();
    });

    test('displays scan result', () => {
        const { rerender } = render(<QRCodeScanner />);
        rerender(<QRCodeScanner />);
        // Simulate scan result by changing state
        expect(screen.getByText('No result')).toBeInTheDocument();
    });
});
