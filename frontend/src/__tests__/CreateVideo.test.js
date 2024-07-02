import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateVideo from '../CreateVideo';
import '@testing-library/jest-dom/extend-expect';

describe('CreateVideo Component', () => {
    test('renders CreateVideo component with button', () => {
        render(<CreateVideo />);
        expect(screen.getByText('Create Video')).toBeInTheDocument();
        expect(screen.getByText('Open Camera')).toBeInTheDocument();
    });

    test('handles open camera button click', () => {
        render(<CreateVideo />);
        fireEvent.click(screen.getByText('Open Camera'));
        expect(window.alert).toHaveBeenCalledWith('Open camera to record video or take picture.');
    });
});
