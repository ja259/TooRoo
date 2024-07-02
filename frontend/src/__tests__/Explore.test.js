import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Explore from '../Explore';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Explore Component', () => {
    const exploreData = [
        { id: 1, image: 'image1.jpg', title: 'Title 1', description: 'Description 1' },
        { id: 2, image: 'image2.jpg', title: 'Title 2', description: 'Description 2' }
    ];

    beforeEach(() => {
        mock.onGet('http://localhost:5000/api/explore').reply(200, exploreData);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders Explore component', async () => {
        render(<Explore />);
        expect(await screen.findByText('Explore')).toBeInTheDocument();
    });

    test('displays explore items', async () => {
        render(<Explore />);
        expect(await screen.findByText('Title 1')).toBeInTheDocument();
        expect(await screen.findByText('Title 2')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/explore').reply(500);
        render(<Explore />);
        expect(await screen.findByText('Failed to fetch content')).toBeInTheDocument();
    });
});
