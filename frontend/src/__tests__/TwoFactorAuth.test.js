import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TwoFactorAuth from '../TwoFactorAuth';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('TwoFactorAuth Component', () => {
    const setup = () => {
        render(<TwoFactorAuth />);
    };

    test('renders TwoFactorAuth component', () => {
        setup();
        expect(screen.getByPlaceholderText('Enter the verification code')).toBeInTheDocument();
        expect(screen.getByText('Verify')).toBeInTheDocument();
    });

    test('displays error message on verification failure', async () => {
        mock.onPost('http://localhost:5000/api/verify-2fa').reply(400, { success: false });
        setup();

        fireEvent.change(screen.getByPlaceholderText('Enter the verification code'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Verify'));

        await waitFor(() => expect(screen.getByText('Invalid code. Please try again.')).toBeInTheDocument());
    });

    test('redirects on successful verification', async () => {
        mock.onPost('http://localhost:5000/api/verify-2fa').reply(200, { success: true });
        setup();

        fireEvent.change(screen.getByPlaceholderText('Enter the verification code'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Verify'));

        await waitFor(() => expect(window.location.pathname).toBe('/dashboard'));
    });
});
