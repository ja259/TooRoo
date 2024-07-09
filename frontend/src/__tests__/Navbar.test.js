import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import '@testing-library/jest-dom/extend-expect';

describe('Navbar Component', () => {
    const user = { username: 'testuser' };
    const onLogout = jest.fn();

    const setup = () => {
        render(
            <Router>
                <Navbar user={user} onLogout={onLogout} />
            </Router>
        );
    };

    test('renders Navbar component', () => {
        setup();
        expect(screen.getByText('Following')).toBeInTheDocument();
        expect(screen.getByText('You All')).toBeInTheDocument();
        expect(screen.getByText('Timeline')).toBeInTheDocument();
    });

    test('highlights active link', () => {
        setup();
        fireEvent.click(screen.getByText('Following'));
        expect(screen.getByText('Following')).toHaveClass('active');
    });

    // Updated or additional tests
    test('renders all icons', () => {
        setup();
        expect(screen.getByLabelText('live')).toBeInTheDocument();
        expect(screen.getByLabelText('search')).toBeInTheDocument();
        expect(screen.getByLabelText('menu')).toBeInTheDocument();
    });

    test('calls onLogout when logout button is clicked', () => {
        setup();
        // Assuming there is a logout button or link in the Navbar
        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);
        expect(onLogout).toHaveBeenCalled();
    });
});
