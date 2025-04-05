import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TablePage from '../TablePage';
import tasksReducer from '../../store/tasksSlice';
import themeReducer from '../../store/themeSlice';

// Mock the TaskTable component
vi.mock('../../components/table/TaskTable', () => ({
  default: ({ tasks, loading, error }: any) => (
    <div data-testid="task-table">
      <div data-testid="task-count">{tasks.length}</div>
      <div data-testid="loading-state">{loading.toString()}</div>
      {error && <div data-testid="error-message">{error}</div>}
    </div>
  ),
}));

// Mock the TableFilters component
vi.mock('../../components/table/TableFilters', () => ({
  default: ({ onFilter }: any) => (
    <div data-testid="table-filters">
      <button 
        data-testid="filter-button"
        onClick={() => onFilter([{ id: '1', name: 'Filtered Task' }])}
      >
        Filter
      </button>
    </div>
  ),
}));

function setupStore() {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      theme: themeReducer,
    },
  });
}

describe('TablePage component', () => {
  let store: ReturnType<typeof setupStore>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    store = setupStore();
    user = userEvent.setup();
  });

  it('renders the page header', () => {
    render(
      <Provider store={store}>
        <TablePage />
      </Provider>
    );
    
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });

  it('renders the TaskTable component', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <TablePage />
      </Provider>
    );
    
    expect(getByTestId('task-table')).toBeInTheDocument();
  });

  it('renders the TableFilters component', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <TablePage />
      </Provider>
    );
    
    expect(getByTestId('table-filters')).toBeInTheDocument();
  });

  it('dispatches fetchTasks action on mount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <TablePage />
      </Provider>
    );
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('filters tasks when filter is applied', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <TablePage />
      </Provider>
    );
    
    // Click the filter button to filter tasks
    await user.click(getByTestId('filter-button'));
    
    // After filtering, length should be 1
    expect(getByTestId('task-count').textContent).toBe('1');
  });
}); 