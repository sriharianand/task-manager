import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import TableFilters from '../TableFilters';
import { Task } from '../../../store/tasksSlice';

describe('TableFilters component', () => {
  const mockTasks: Task[] = [
    {
      id: 'TASK-001',
      name: 'Task 1',
      status: 'in_progress',
      dueDate: '2025-04-15',
      estimatedHours: 8,
      description: 'Test description 1',
      assignee: 'User 1',
      remarks: 'Test remarks 1',
      priority: 'high'
    },
    {
      id: 'TASK-002',
      name: 'Task 2',
      status: 'completed',
      dueDate: '2025-04-12',
      estimatedHours: 4,
      description: 'Test description 2',
      assignee: 'User 2',
      remarks: 'Test remarks 2',
      priority: 'medium'
    }
  ];

  const onFilterMock = vi.fn();

  it('renders the search input', () => {
    const { getByPlaceholderText } = render(
      <TableFilters tasks={mockTasks} onFilter={onFilterMock} />
    );
    
    expect(getByPlaceholderText('Search by name or description')).toBeInTheDocument();
  });

  it('calls onFilter when search input changes', () => {
    const { getByPlaceholderText } = render(
      <TableFilters tasks={mockTasks} onFilter={onFilterMock} />
    );
    
    const searchInput = getByPlaceholderText('Search by name or description');
    fireEvent.change(searchInput, { target: { value: 'Task 1' } });
    
    // Filter function should be called
    expect(onFilterMock).toHaveBeenCalled();
  });

  it('renders filter selects for status, priority, and assignee', () => {
    const { getByLabelText } = render(
      <TableFilters tasks={mockTasks} onFilter={onFilterMock} />
    );
    
    expect(getByLabelText('Status')).toBeInTheDocument();
    expect(getByLabelText('Priority')).toBeInTheDocument();
    expect(getByLabelText('Assignee')).toBeInTheDocument();
  });

  it('renders reset button', () => {
    const { getByText } = render(
      <TableFilters tasks={mockTasks} onFilter={onFilterMock} />
    );
    
    expect(getByText('Reset')).toBeInTheDocument();
  });
}); 