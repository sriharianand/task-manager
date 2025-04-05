import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnSelector, { Column } from '../ColumnSelector';

// Mock the drag and drop functionality
vi.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: Function }) => children({
    innerRef: vi.fn(),
    droppableProps: {},
    placeholder: null,
  }),
  Draggable: ({ children }: { children: Function }) => children({
    innerRef: vi.fn(),
    draggableProps: {},
    dragHandleProps: {},
  }),
}));

describe('ColumnSelector component', () => {
  const mockColumns: Column[] = [
    { id: 'id', label: 'ID', visible: true },
    { id: 'name', label: 'Name', visible: true },
    { id: 'status', label: 'Status', visible: false },
    { id: 'priority', label: 'Priority', visible: true },
  ];

  let user: ReturnType<typeof userEvent.setup>;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    user = userEvent.setup();
    onChange = vi.fn();
  });

  it('renders the button to open the dialog', () => {
    render(<ColumnSelector columns={mockColumns} onChange={onChange} />);
    
    const button = screen.getByRole('button', { name: /manage columns/i });
    expect(button).toBeInTheDocument();
  });

  it('opens the dialog when the button is clicked', async () => {
    render(<ColumnSelector columns={mockColumns} onChange={onChange} />);
    
    const button = screen.getByRole('button', { name: /manage columns/i });
    await user.click(button);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('lists all columns in the dialog', async () => {
    render(<ColumnSelector columns={mockColumns} onChange={onChange} />);
    
    const button = screen.getByRole('button', { name: /manage columns/i });
    await user.click(button);
    
    mockColumns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });
  });

  it('shows checkboxes for column visibility', async () => {
    render(<ColumnSelector columns={mockColumns} onChange={onChange} />);
    
    const button = screen.getByRole('button', { name: /manage columns/i });
    await user.click(button);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(mockColumns.length);
    
    checkboxes.forEach((checkbox, index) => {
      expect(checkbox).toHaveProperty('checked', mockColumns[index].visible);
    });
  });

  it('calls onChange when a checkbox is clicked', async () => {
    render(<ColumnSelector columns={mockColumns} onChange={onChange} />);
    
    const button = screen.getByRole('button', { name: /manage columns/i });
    await user.click(button);
    
    const checkbox = screen.getAllByRole('checkbox')[2]; // Status (initially false)
    await user.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'status', visible: true })
      ])
    );
  });

  it('has proper accessibility attributes', async () => {
    render(<ColumnSelector columns={mockColumns} onChange={onChange} />);
    
    // Button should have proper accessibility attributes
    const button = screen.getByRole('button', { name: /manage columns/i });
    expect(button).toHaveAttribute('aria-label', 'Manage visible columns');
    
    // After clicking the button, check dialog accessibility
    await user.click(button);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', expect.any(String));
    
    // Check the list of columns has proper role
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    
    // Check each list item has proper role and label
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockColumns.length);
    
    // Check checkboxes have proper accessibility
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox, index) => {
      expect(checkbox).toHaveAttribute('aria-checked', mockColumns[index].visible.toString());
      expect(checkbox).toHaveAccessibleName();
    });
  });
}); 