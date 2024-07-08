import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LocationSharing from '../LocationSharing';

describe('LocationSharing Component', () => {
    beforeAll(() => {
        global.navigator.geolocation = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce((success) => Promise.resolve(success({
                    coords: {
                        latitude: 51.1,
                        longitude: 45.3,
                    }
                })))
                .mockImplementationOnce((_, error) => Promise.resolve(error({
                    code: 1,
                    message: 'User denied geolocation'
                })))
        };
    });

    test('renders LocationSharing component', () => {
        render(<LocationSharing />);
        expect(screen.getByText('Share Your Location')).toBeInTheDocument();
        expect(screen.getByText('Share Location')).toBeInTheDocument();
    });

    test('fetches and displays location', async () => {
        render(<LocationSharing />);
        fireEvent.click(screen.getByText('Share Location'));
        expect(await screen.findByText('Latitude: 51.1')).toBeInTheDocument();
        expect(await screen.findByText('Longitude: 45.3')).toBeInTheDocument();
    });

    test('handles geolocation error', async () => {
        console.error = jest.fn();

        render(<LocationSharing />);
        fireEvent.click(screen.getByText('Share Location'));

        expect(console.error).toHaveBeenCalledWith('Error fetching location:', {
            code: 1,
            message: 'User denied geolocation'
        });
    });
});
