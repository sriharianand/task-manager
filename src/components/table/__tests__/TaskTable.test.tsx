import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import TaskTable from '../TaskTable';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../../theme';

// Mock components and hooks
vi.mock('../TaskDetailsDrawer', () => ({
  default: () => <div data-testid="task-details-drawer-mock" />
}));

vi.mock('../ColumnSelector', () => ({
  default: () => <div data-testid="column-selector-mock" />
}));

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [],
  })
}));

describe('TaskTable component', () => {
  const mockTasks = [
    {
      id: 'TASK-001',
      name: 'Test Task',
      status: 'in_progress',
      dueDate: '2025-04-15',
      estimatedHours: 8,
      description: 'Test description',
      assignee: 'Test User',
      remarks: 'Test remarks',
      priority: 'high'
    }
  ];

  it('renders loading state correctly', () => {
    const { getByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <TaskTable tasks={[]} loading={true} error={null} />
      </ThemeProvider>
    );
    
    expect(getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const { getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <TaskTable tasks={[]} loading={false} error={'Error message'} />
      </ThemeProvider>
    );
    
    expect(getByText('Error: Error message')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    const { getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <TaskTable tasks={[]} loading={false} error={null} />
      </ThemeProvider>
    );
    
    expect(getByText('No tasks found')).toBeInTheDocument();
  });

  it('renders task table with data', () => {
    const { getByText, getAllByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <TaskTable tasks={mockTasks} loading={false} error={null} />
      </ThemeProvider>
    );
    
    // Check column headers are rendered
    expect(getByText('ID')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
    
    // Table headers should be present
    const headers = getAllByRole('columnheader');
    expect(headers.length).toBeGreaterThan(0);
  });
}); 