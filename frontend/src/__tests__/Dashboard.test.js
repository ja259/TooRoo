import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import '@testing-library/jest-dom/extend-expect';

describe('Dashboard Component', () => {
    test('renders Dashboard component', () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );
        expect(screen.getByText('Welcome to TooRoo')).toBeInTheDocument();
    });

    test('renders navigation links', () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Feed')).toBeInTheDocument();
        expect(screen.getByText('Notifications')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });
});
