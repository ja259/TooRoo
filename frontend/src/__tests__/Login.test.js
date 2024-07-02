import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../Login';
import authService from '../services/authService';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../services/authService');

describe('Login Component', () => {
    test('renders Login component', () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    test('displays error message for empty fields', async () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(await screen.findByText('Please fill in all fields')).toBeInTheDocument();
    });

    test('calls login service on submit', async () => {
        authService.login.mockResolvedValue({ success: true });
        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.change(screen.getByPlaceholderText('Email or Phone'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        await screen.findByText('Login');
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    });

    test('displays error message on failed login', async () => {
        authService.login.mockResolvedValue({ success: false, message: 'Invalid credentials' });
        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.change(screen.getByPlaceholderText('Email or Phone'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });
});
