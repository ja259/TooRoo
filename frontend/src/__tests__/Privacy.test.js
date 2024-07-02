import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Privacy from '../Privacy';
import '@testing-library/jest-dom/extend-expect';

describe('Privacy Component', () => {
    test('renders Privacy component', () => {
        render(<Privacy />);
        expect(screen.getByText('Privacy Settings')).toBeInTheDocument();
    });

    test('changes profile visibility', () => {
        render(<Privacy />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'friends' } });
        expect(screen.getByRole('combobox').value).toBe('friends');
    });

    test('triggers block list management', () => {
        render(<Privacy />);
        fireEvent.click(screen.getByText('Manage'));
        // Add any further assertions for block list management if applicable
    });

    test('toggles activity status', () => {
        render(<Privacy />);
        fireEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox').checked).toBe(true);
    });
});
