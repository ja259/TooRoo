import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ForgotPassword from '../ForgotPassword';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('ForgotPassword Component', () => {
    test('renders ForgotPassword component', () => {
        render(<ForgotPassword />);
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });

    test('submits forgot password request', async () => {
        mock.onPost('http://localhost:5000/api/auth/forgot-password').reply(200, {
            success: true,
            message: 'Password reset link has been sent to your email.'
        });

        render(<ForgotPassword />);
        const emailInput = screen.getByPlaceholderText('Enter your email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByText('Reset Password'));
        expect(await screen.findByText('Password reset link has been sent to your email.')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onPost('http://localhost:5000/api/auth/forgot-password').reply(500);

        render(<ForgotPassword />);
        const emailInput = screen.getByPlaceholderText('Enter your email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByText('Reset Password'));
        expect(await screen.findByText('Failed to send password reset link. Please try again.')).toBeInTheDocument();
    });
});
