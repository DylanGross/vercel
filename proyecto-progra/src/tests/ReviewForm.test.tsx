import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '../components/Reseña';

describe('ReviewForm', () => {
  it('muestra error si la reseña está vacía', async () => {
    render(<ReviewForm bookId="test-book" />);
    const submitBtn = screen.getAllByText('Enviar Reseña')[0];
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/no puede estar vacía/i)).toBeInTheDocument();
  });

  it('muestra error si la reseña es muy corta', async () => {
    render(<ReviewForm bookId="test-book" />);
    fireEvent.change(screen.getByLabelText(/reseña/i), { target: { value: 'corta' } });
    const submitBtn = screen.getAllByText('Enviar Reseña')[0];
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/al menos 10 caracteres/i)).toBeInTheDocument();
  });

  // El flujo actual no permite rating inválido, así que este test se omite
});
