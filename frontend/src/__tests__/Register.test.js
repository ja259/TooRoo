import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '../Register';
import authService from '../services/authService';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../services/authService');

describe('Register Component', () => {
    const setup = () => {
        render(
            <Router>
                <Register />
            </Router>
        );
    };

    test('renders Register component', () => {
        setup();
        expect(screen.getByText('Create an Account')).toBeInTheDocument();
    });

    test('displays error message for password mismatch', async () => {
        setup();
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));
        expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    });

    test('calls register service on submit', async () => {
        authService.register.mockResolvedValue({ success: true });
        setup();
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));
        await screen.findByText('Create an Account');
        expect(authService.register).toHaveBeenCalled();
    });
});
