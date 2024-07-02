import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../DarkModeToggle';
import '@testing-library/jest-dom/extend-expect';

describe('DarkModeToggle Component', () => {
    let setDarkModeMock;

    beforeEach(() => {
        setDarkModeMock = jest.fn();
    });

    test('renders DarkModeToggle button', () => {
        render(<DarkModeToggle darkMode={false} setDarkMode={setDarkModeMock} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('toggles dark mode', () => {
        render(<DarkModeToggle darkMode={false} setDarkMode={setDarkModeMock} />);
        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);
        expect(setDarkModeMock).toHaveBeenCalledWith(true);
    });

    test('renders Sun icon in dark mode', () => {
        render(<DarkModeToggle darkMode={true} setDarkMode={setDarkModeMock} />);
        expect(screen.getByRole('button').querySelector('svg')).toHaveAttribute('data-icon', 'sun');
    });

    test('renders Moon icon in light mode', () => {
        render(<DarkModeToggle darkMode={false} setDarkMode={setDarkModeMock} />);
        expect(screen.getByRole('button').querySelector('svg')).toHaveAttribute('data-icon', 'moon');
    });
});
