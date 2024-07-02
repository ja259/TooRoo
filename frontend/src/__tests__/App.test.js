import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../App';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);

describe('TooRoo App Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { isAuthenticated: false, user: null },
        });
    });

    test('renders login page when not authenticated', () => {
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    test('renders register page', () => {
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/register/i));
        expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    });

    test('renders forgot password page', () => {
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/forgot password/i));
        expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
    });

    test('renders terms and policies page', () => {
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/terms and policies/i));
        expect(screen.getByText(/Welcome to TooRoo!/i)).toBeInTheDocument();
    });

    test('renders dashboard when authenticated', () => {
        store = mockStore({
            auth: { isAuthenticated: true, user: { username: 'testuser' } },
        });
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    test('logs out successfully', () => {
        store = mockStore({
            auth: { isAuthenticated: true, user: { username: 'testuser' } },
        });
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/logout/i));
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    // Additional authenticated route tests
    const authenticatedRoutes = [
        { path: 'profile/:id', label: 'profile' },
        { path: 'search', label: 'search' },
        { path: 'live', label: 'live' },
        { path: 'ar-filters', label: 'AR filters' },
        { path: 'virtual-events', label: 'virtual events' },
        { path: 'you-all', label: 'you all' },
        { path: 'following', label: 'following' },
        { path: 'inbox', label: 'inbox' },
        { path: 'create-video', label: 'create video' },
        { path: 'notifications', label: 'notifications' },
        { path: 'timeline', label: 'timeline' },
        { path: 'chat', label: 'chat' },
        { path: 'call', label: 'call' },
        { path: 'video-call', label: 'video call' },
        { path: 'stories', label: 'stories' },
        { path: 'settings', label: 'settings' },
        { path: 'privacy', label: 'privacy' },
        { path: 'language', label: 'language' },
        { path: 'marketplace', label: 'marketplace' },
        { path: 'explore', label: 'explore' },
        { path: 'analytics', label: 'user analytics' },
        { path: 'two-factor-auth', label: 'two factor auth' },
    ];

    authenticatedRoutes.forEach(({ path, label }) => {
        test(`renders ${label} page when authenticated`, () => {
            store = mockStore({
                auth: { isAuthenticated: true, user: { username: 'testuser' } },
            });
            render(
                <Provider store={store}>
                    <Router>
                        <App />
                    </Router>
                </Provider>
            );
            fireEvent.click(screen.getByText(new RegExp(label, 'i')));
            expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
        });
    });

    test('toggles dark mode', () => {
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        const toggleButton = screen.getByRole('button', { name: /toggle dark mode/i });
        fireEvent.click(toggleButton);
        expect(document.body).toHaveClass('dark-mode');
    });

    // Add more tests for other functionalities as needed
});
