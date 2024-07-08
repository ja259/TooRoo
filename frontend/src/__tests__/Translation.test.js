import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Translation from '../Translation';

jest.mock('axios');

describe('Translation Component', () => {
    test('renders Translation component', () => {
        render(<Translation />);
        expect(screen.getByText('Translation')).toBeInTheDocument();
    });

    test('handles text input change', () => {
        render(<Translation />);
        const textarea = screen.getByPlaceholderText('Enter text to translate');
        fireEvent.change(textarea, { target: { value: 'Hello' } });
        expect(textarea.value).toBe('Hello');
    });

    test('handles translation', async () => {
        axios.post.mockResolvedValue({ data: { translatedText: 'Hola' } });

        render(<Translation />);
        const textarea = screen.getByPlaceholderText('Enter text to translate');
        fireEvent.change(textarea, { target: { value: 'Hello' } });

        const button = screen.getByText('Translate');
        fireEvent.click(button);

        const translatedText = await screen.findByText('Hola');
        expect(translatedText).toBeInTheDocument();
    });

    test('handles translation error', async () => {
        console.error = jest.fn();
        axios.post.mockRejectedValue(new Error('Translation error'));

        render(<Translation />);
        const textarea = screen.getByPlaceholderText('Enter text to translate');
        fireEvent.change(textarea, { target: { value: 'Hello' } });

        const button = screen.getByText('Translate');
        fireEvent.click(button);

        await screen.findByText('Translation');

        expect(console.error).toHaveBeenCalledWith('Error translating text:', expect.any(Error));
    });
});
