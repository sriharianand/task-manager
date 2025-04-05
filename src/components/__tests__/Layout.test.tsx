import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';
import { store } from '../../store';

// Mock the Outlet component from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-mock">Outlet Content</div>,
  };
});

describe('Layout Component', () => {
  it('renders the app bar with title', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });
  
  it('renders navigation menu items', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Table')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
  
  it('renders the outlet content', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('outlet-mock')).toBeInTheDocument();
  });
}); 