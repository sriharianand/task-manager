import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '../DashboardPage';
import tasksReducer from '../../store/tasksSlice';
import themeReducer from '../../store/themeSlice';

// Mock the recharts components if DashboardPage uses charts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie"></div>,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar"></div>,
  XAxis: () => <div data-testid="x-axis"></div>,
  YAxis: () => <div data-testid="y-axis"></div>,
  CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
  Tooltip: () => <div data-testid="tooltip"></div>,
  Legend: () => <div data-testid="legend"></div>,
}));

// Mock the API call
vi.mock('../../store/tasksSlice', async () => {
  const actual = await vi.importActual('../../store/tasksSlice');
  return {
    ...actual,
    fetchTasks: vi.fn().mockImplementation(() => {
      return {
        type: 'tasks/fetchTasks/fulfilled',
        payload: {
          status: 'success',
          totalTasks: 3,
          tasks: [
            {
              id: '1',
              name: 'Task 1',
              status: 'in_progress',
              dueDate: new Date().toISOString(),
              estimatedHours: 8,
              description: 'Task 1 description',
              assignee: 'John Doe',
              remarks: 'Some remarks',
              priority: 'medium',
            },
            {
              id: '2',
              name: 'Task 2',
              status: 'completed',
              dueDate: new Date().toISOString(),
              estimatedHours: 4,
              description: 'Task 2 description',
              assignee: 'Jane Smith',
              remarks: 'Some remarks',
              priority: 'high',
            },
            {
              id: '3',
              name: 'Task 3',
              status: 'not_started',
              dueDate: new Date().toISOString(),
              estimatedHours: 2,
              description: 'Task 3 description',
              assignee: 'John Doe',
              remarks: 'Some remarks',
              priority: 'low',
            },
          ],
        },
      };
    }),
  };
});

describe('DashboardPage component', () => {
  let store: ReturnType<typeof setupStore>;

  function setupStore() {
    return configureStore({
      reducer: {
        tasks: tasksReducer,
        theme: themeReducer,
      },
    });
  }

  beforeEach(() => {
    store = setupStore();
  });

  it('renders the dashboard page title', () => {
    const { getByText } = render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );
    
    expect(getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays metric cards for task counts', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );
    
    // Allow time for the async actions to complete
    await vi.waitFor(() => {
      expect(getByText('Total Tasks')).toBeInTheDocument();
      expect(getByText('Completed')).toBeInTheDocument();
      expect(getByText('In Progress')).toBeInTheDocument();
    });
  });

  it('dispatches fetchTasks action on mount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );
    
    expect(dispatchSpy).toHaveBeenCalled();
  });
}); 