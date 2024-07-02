import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoCall from '../VideoCall';
import '@testing-library/jest-dom/extend-expect';

describe('VideoCall Component', () => {
    const setup = () => {
        render(<VideoCall />);
    };

    test('renders VideoCall component', () => {
        setup();
        expect(screen.getByText('Start Video Call')).toBeInTheDocument();
    });

    test('starts and ends video call', async () => {
        setup();

        fireEvent.click(screen.getByText('Start Video Call'));
        expect(screen.getByText('End Call')).toBeInTheDocument();

        fireEvent.click(screen.getByText('End Call'));
        expect(screen.getByText('Start Video Call')).toBeInTheDocument();
    });

    test('handles video call errors', async () => {
        const mockGetUserMedia = jest.fn().mockRejectedValue(new Error('Error starting video call'));
        global.navigator.mediaDevices = { getUserMedia: mockGetUserMedia };

        setup();
        fireEvent.click(screen.getByText('Start Video Call'));

        expect(await screen.findByText('Start Video Call')).toBeInTheDocument();
        expect(mockGetUserMedia).toHaveBeenCalled();
    });
});
