import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Language from '../Language';
import '@testing-library/jest-dom/extend-expect';

describe('Language Component', () => {
    const user = { language: 'en' };
    const onUpdateLanguage = jest.fn();

    test('renders Language component', () => {
        render(<Language user={user} onUpdateLanguage={onUpdateLanguage} />);
        expect(screen.getByText('Language Settings')).toBeInTheDocument();
    });

    test('changes language', () => {
        render(<Language user={user} onUpdateLanguage={onUpdateLanguage} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'es' } });
        expect(onUpdateLanguage).toHaveBeenCalledWith('es');
    });
});
