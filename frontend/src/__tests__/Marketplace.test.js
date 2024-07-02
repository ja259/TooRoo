import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Marketplace from '../Marketplace';
import '@testing-library/jest-dom/extend-expect';

const mock = new MockAdapter(axios);

describe('Marketplace Component', () => {
    const products = [
        { id: 'product1', image: 'product1.jpg', name: 'Product 1', description: 'Description 1', price: 10 },
        { id: 'product2', image: 'product2.jpg', name: 'Product 2', description: 'Description 2', price: 20 }
    ];

    beforeEach(() => {
        mock.onGet('http://localhost:5000/api/marketplace').reply(200, products);
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders Marketplace component', async () => {
        render(<Marketplace />);
        expect(await screen.findByText('Marketplace')).toBeInTheDocument();
    });

    test('fetches and displays products', async () => {
        render(<Marketplace />);
        expect(await screen.findByText('Product 1')).toBeInTheDocument();
        expect(await screen.findByText('Product 2')).toBeInTheDocument();
    });

    test('displays error message on failure', async () => {
        mock.onGet('http://localhost:5000/api/marketplace').reply(500);
        render(<Marketplace />);
        expect(await screen.findByText('Failed to fetch products')).toBeInTheDocument();
    });
});
