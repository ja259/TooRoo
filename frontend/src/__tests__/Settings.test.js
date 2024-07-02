import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../Settings';
import '@testing-library/jest-dom/extend-expect';

describe('Settings Component', () => {
    const setDarkMode = jest.fn();

    const setup = () => {
        render(<Settings setDarkMode={setDarkMode} />);
    };

    test('renders Settings component', () => {
        setup();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark Mode')).toBeInTheDocument();
        expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
        expect(screen.getByText('Privacy Settings')).toBeInTheDocument();
        expect(screen.getByText('Language')).toBeInTheDocument();
    });

    test('toggles dark mode', () => {
        setup();
        const checkbox = screen.getByLabelText('Dark Mode');
        fireEvent.click(checkbox);
        expect(setDarkMode).toHaveBeenCalledWith(true);
        expect(document.body.classList).toContain('dark-mode');

        fireEvent.click(checkbox);
        expect(setDarkMode).toHaveBeenCalledWith(false);
        expect(document.body.classList).not.toContain('dark-mode');
    });

    test('calls setDarkMode with the correct value', () => {
        setup();
        fireEvent.click(screen.getByLabelText('Dark Mode'));
        expect(setDarkMode).toHaveBeenCalledWith(true);

        fireEvent.click(screen.getByLabelText('Dark Mode'));
        expect(setDarkMode).toHaveBeenCalledWith(false);
    });
});
