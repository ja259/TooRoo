import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QRCodeScanner from '../QRCodeScanner';

jest.mock('react-qr-scanner', () => (props) => {
    const handleScan = () => {
        props.onScan({ text: 'Mock QR Code Result' });
    };

    return (
        <div>
            <button onClick={handleScan}>Mock QR Scanner</button>
        </div>
    );
});

describe('QRCodeScanner Component', () => {
    test('renders QRCodeScanner component', () => {
        render(<QRCodeScanner />);
        expect(screen.getByText('QR Code Scanner')).toBeInTheDocument();
        expect(screen.getByText('No result')).toBeInTheDocument();
    });

    test('displays scan result', () => {
        render(<QRCodeScanner />);
        const mockScannerButton = screen.getByText('Mock QR Scanner');
        fireEvent.click(mockScannerButton);
        expect(screen.getByText('Mock QR Code Result')).toBeInTheDocument();
    });

    test('handles scan error', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<QRCodeScanner />);
        const mockScannerButton = screen.getByText('Mock QR Scanner');
        fireEvent.click(mockScannerButton);
        expect(console.error).toHaveBeenCalled();
        console.error.mockRestore();
    });
});
