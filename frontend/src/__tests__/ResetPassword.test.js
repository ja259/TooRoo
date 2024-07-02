import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../ResetPassword';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('ResetPassword Component', () => {
    const token = 'test-token';

    const setup = () => {
        render(
            <Router>
                <ResetPassword />
            </Router>
        );
    };

    test('renders ResetPassword component', () => {
        setup();
        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    test('displays error message for password mismatch', async () => {
        setup();
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
        expect(await screen.findByText('Passwords do not match!')).toBeInTheDocument();
    });

    test('calls API to reset password', async () => {
        mock.onPut(`http://localhost:5000/api/auth/reset-password/${token}`).reply(200);
        setup();
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
        await waitFor(() => expect(mock.history.put.length).toBe(1));
    });
});
