import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BottomNav from '../BottomNav';
import '@testing-library/jest-dom/extend-expect';

describe('BottomNav Component', () => {
    test('renders BottomNav component', () => {
        render(
            <Router>
                <BottomNav />
            </Router>
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Inbox')).toBeInTheDocument();
        expect(screen.getByText('Notifications')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('renders create video button', () => {
        render(
            <Router>
                <BottomNav />
            </Router>
        );
        expect(screen.getByRole('link', { name: '' })).toBeInTheDocument();
    });
});
