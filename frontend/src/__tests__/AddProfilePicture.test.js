import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddProfilePicture from '../AddProfilePicture';

describe('AddProfilePicture Component', () => {
  it('renders AddProfilePicture component', () => {
    render(
      <Router>
        <AddProfilePicture />
      </Router>
    );
    expect(screen.getByText(/Add Profile Picture/i)).toBeInTheDocument();
  });

  it('handles file input change', () => {
    render(
      <Router>
        <AddProfilePicture />
      </Router>
    );
    const fileInput = screen.getByLabelText(/Add Profile Picture/i);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files[0]).toEqual(file);
  });

  it('navigates to dashboard on save', () => {
    render(
      <Router>
        <AddProfilePicture />
      </Router>
    );
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('navigates to dashboard on skip', () => {
    render(
      <Router>
        <AddProfilePicture />
      </Router>
    );
    const skipButton = screen.getByText(/Skip/i);
    fireEvent.click(skipButton);
    expect(window.location.pathname).toBe('/dashboard');
  });
});
