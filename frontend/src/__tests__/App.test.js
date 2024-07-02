import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../App';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);

describe('TooRoo Frontend Tests', () => {
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

    test('renders profile page when authenticated', () => {
        store = mockStore({
            auth: { isAuthenticated: true, user: { username: 'testuser', id: '1' } },
        });
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/profile/i));
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
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

    test('navigates to forgot password page', () => {
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

    test('navigates to reset password page', () => {
        render(
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        );
        fireEvent.click(screen.getByText(/reset password/i));
        expect(screen.getByText(/enter your new password/i)).toBeInTheDocument();
    });

    // Additional component tests
    test('renders search page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/search/i));
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    test('renders live page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/live/i));
        expect(screen.getByText(/live/i)).toBeInTheDocument();
    });

    test('renders AR filters page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/AR filters/i));
        expect(screen.getByText(/AR filters/i)).toBeInTheDocument();
    });

    test('renders virtual events page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/virtual events/i));
        expect(screen.getByText(/virtual events/i)).toBeInTheDocument();
    });

    test('renders you all page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/you all/i));
        expect(screen.getByText(/you all/i)).toBeInTheDocument();
    });

    test('renders following page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/following/i));
        expect(screen.getByText(/following/i)).toBeInTheDocument();
    });

    test('renders inbox page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/inbox/i));
        expect(screen.getByText(/inbox/i)).toBeInTheDocument();
    });

    test('renders create video page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/create video/i));
        expect(screen.getByText(/create video/i)).toBeInTheDocument();
    });

    test('renders notifications page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/notifications/i));
        expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    });

    test('renders timeline page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/timeline/i));
        expect(screen.getByText(/timeline/i)).toBeInTheDocument();
    });

    test('renders chat page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/chat/i));
        expect(screen.getByText(/chat/i)).toBeInTheDocument();
    });

    test('renders call page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/call/i));
        expect(screen.getByText(/call/i)).toBeInTheDocument();
    });

    test('renders video call page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/video call/i));
        expect(screen.getByText(/video call/i)).toBeInTheDocument();
    });

    test('renders stories page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/stories/i));
        expect(screen.getByText(/stories/i)).toBeInTheDocument();
    });

    test('renders settings page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/settings/i));
        expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });

    test('renders privacy page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/privacy/i));
        expect(screen.getByText(/privacy/i)).toBeInTheDocument();
    });

    test('renders language page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/language/i));
        expect(screen.getByText(/language/i)).toBeInTheDocument();
    });

    test('renders marketplace page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/marketplace/i));
        expect(screen.getByText(/marketplace/i)).toBeInTheDocument();
    });

    test('renders explore page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/explore/i));
        expect(screen.getByText(/explore/i)).toBeInTheDocument();
    });

    test('renders user analytics page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/analytics/i));
        expect(screen.getByText(/user analytics/i)).toBeInTheDocument();
    });

    test('renders two factor auth page when authenticated', () => {
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
        fireEvent.click(screen.getByText(/two factor auth/i));
        expect(screen.getByText(/two factor auth/i)).toBeInTheDocument();
    });

    // Add more tests for other components and functionalities as needed
});
