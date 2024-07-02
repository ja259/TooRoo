import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TermsAndPolicies from '../TermsAndPolicies';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);

describe('TermsAndPolicies Component', () => {
    let store;
    let navigate;

    beforeEach(() => {
        store = mockStore({
            auth: { isAuthenticated: false, user: null },
        });
        navigate = jest.fn();
    });

    test('renders Terms and Policies page', () => {
        render(
            <Provider store={store}>
                <Router>
                    <TermsAndPolicies />
                </Router>
            </Provider>
        );
        expect(screen.getByText(/Terms and Policies/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome to TooRoo!/i)).toBeInTheDocument();
        expect(screen.getByText(/1. Acceptance of Terms/i)).toBeInTheDocument();
        expect(screen.getByText(/2. User Accounts/i)).toBeInTheDocument();
        expect(screen.getByText(/3. User Conduct/i)).toBeInTheDocument();
        expect(screen.getByText(/4. Content Ownership/i)).toBeInTheDocument();
        expect(screen.getByText(/5. Privacy Policy/i)).toBeInTheDocument();
        expect(screen.getByText(/6. Termination/i)).toBeInTheDocument();
        expect(screen.getByText(/7. Changes to Terms/i)).toBeInTheDocument();
        expect(screen.getByText(/8. Contact Us/i)).toBeInTheDocument();
    });

    test('navigates to add profile picture page on agree', () => {
        render(
            <Provider store={store}>
                <Router>
                    <TermsAndPolicies />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/Agree/i));
        expect(navigate).toHaveBeenCalledWith('/add-profile-picture');
    });

    test('navigates to register page on decline', () => {
        render(
            <Provider store={store}>
                <Router>
                    <TermsAndPolicies />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/Decline/i));
        expect(navigate).toHaveBeenCalledWith('/register');
    });
});

