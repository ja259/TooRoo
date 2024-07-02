import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Inbox from '../Inbox';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { store } from '../store';

const mock = new MockAdapter(axios);

describe('Inbox Component', () => {
    const user = {
        _id: 'user123',
        blockedUsers: []
    };
    
    const conversations = [
        {
            _id: 'conv1',
            partnerName: 'User1',
            partnerAvatar: 'user1.jpg',
            partnerId: 'partner1'
        },
        {
            _id: 'conv2',
            partnerName: 'User2',
            partnerAvatar: 'user2.jpg',
            partnerId: 'partner2'
        }
    ];

    const messages = [
        { _id: 'msg1', conversationId: 'conv1', senderId: 'user123', content: 'Hello User1' },
        { _id: 'msg2', conversationId: 'conv1', senderId: 'partner1', content: 'Hello User123' }
    ];

    beforeEach(() => {
        mock.onGet('http://localhost:5000/api/conversations').reply(200, conversations);
        mock.onGet('http://localhost:5000/api/messages/conv1').reply(200, messages);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders Inbox component', async () => {
        render(
            <Provider store={store}>
                <Inbox user={user} />
            </Provider>
        );
        expect(await screen.findByText('Inbox')).toBeInTheDocument();
    });

    test('fetches and displays conversations', async () => {
        render(
            <Provider store={store}>
                <Inbox user={user} />
            </Provider>
        );
        expect(await screen.findByText('User1')).toBeInTheDocument();
        expect(await screen.findByText('User2')).toBeInTheDocument();
    });

    test('fetches and displays messages for a selected conversation', async () => {
        render(
            <Provider store={store}>
                <Inbox user={user} />
            </Provider>
        );
        fireEvent.click(await screen.findByText('User1'));
        expect(await screen.findByText('Hello User1')).toBeInTheDocument();
        expect(await screen.findByText('Hello User123')).toBeInTheDocument();
    });

    test('sends a new message', async () => {
        render(
            <Provider store={store}>
                <Inbox user={user} />
            </Provider>
        );
        fireEvent.click(await screen.findByText('User1'));
        const input = await screen.findByPlaceholderText('Type a message...');
        fireEvent.change(input, { target: { value: 'New Message' } });
        fireEvent.click(screen.getByRole('button', { name: /send/i }));
        await waitFor(() => {
            expect(input).toHaveValue('');
        });
    });
});
