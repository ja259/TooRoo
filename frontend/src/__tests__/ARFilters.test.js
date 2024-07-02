import React from 'react';
import { render, screen } from '@testing-library/react';
import ARFilters from '../ARFilters';
import '@testing-library/jest-dom/extend-expect';

describe('ARFilters Component', () => {
    test('renders ARFilters component with heading', () => {
        render(<ARFilters />);
        expect(screen.getByText('AR Filters and Effects')).toBeInTheDocument();
    });

    test('renders video element', () => {
        render(<ARFilters />);
        expect(screen.getByRole('video')).toBeInTheDocument();
    });

    test('renders filter buttons', () => {
        render(<ARFilters />);
        expect(screen.getByText('Filter 1')).toBeInTheDocument();
        expect(screen.getByText('Filter 2')).toBeInTheDocument();
        expect(screen.getByText('Filter 3')).toBeInTheDocument();
    });
});
