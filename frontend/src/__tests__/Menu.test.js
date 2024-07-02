import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from '../Menu';
import '@testing-library/jest-dom/extend-expect';

describe('Menu Component', () => {
    const user = { username: 'testuser', profilePicture: 'profile.jpg' };
    const onLogout = jest.fn();

    test('renders Menu component', () => {
        render(
            <Router>
                <Menu user={user} onLogout={onLogout} menuOpen={true} />
            </Router>
        );
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Inbox')).toBeInTheDocument();
    });

    test('calls onLogout when logout button is clicked', () => {
        render(
            <Router>
                <Menu user={user} onLogout={onLogout} menuOpen={true} />
            </Router>
        );
        fireEvent.click(screen.getByText('Logout'));
        expect(onLogout).toHaveBeenCalled();
    });
});
