import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardCharts from '../DashboardCharts';
import { Task } from '../../../store/tasksSlice';

// Mock the recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data }: any) => <div data-testid="pie">{JSON.stringify(data)}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ dataKey }: any) => <div data-testid="bar" data-key={dataKey}></div>,
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: ({ dataKey }: any) => <div data-testid="line" data-key={dataKey}></div>,
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey}></div>,
  YAxis: () => <div data-testid="y-axis"></div>,
  CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
  Tooltip: () => <div data-testid="tooltip"></div>,
  Legend: () => <div data-testid="legend"></div>,
  Cell: () => <div data-testid="cell"></div>,
}));

// Mock the mui material components
vi.mock('@mui/material', () => {
  return {
    Paper: ({ children, ...props }: any) => (
      <div data-testid="paper" {...props}>{children}</div>
    ),
    Typography: ({ children, ...props }: any) => (
      <div data-testid="typography" {...props}>{children}</div>
    ),
    useTheme: () => ({
      palette: {
        background: { paper: '#fff' },
        text: { primary: '#000' },
        action: { hover: '#f5f5f5' },
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      shadows: ['none', '0px 2px 1px -1px rgba(0,0,0,0.2)'],
    }),
    Box: ({ children, ...props }: any) => (
      <div data-testid="box" {...props}>{children}</div>
    ),
  };
});

describe('DashboardCharts component', () => {
  const mockTasks: Task[] = [
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
  ];

  it('renders charts', () => {
    render(
      <DashboardCharts tasks={mockTasks} />
    );
    
    expect(screen.getAllByTestId('box')).not.toHaveLength(0);
    expect(screen.getAllByTestId('paper')).not.toHaveLength(0);
    expect(screen.getAllByTestId('typography')).not.toHaveLength(0);
    
    // Check for line charts presence
    expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    
    // Check for pie chart presence
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('handles empty tasks array', () => {
    render(
      <DashboardCharts tasks={[]} />
    );
    
    // Even with empty tasks, the component should render charts
    expect(screen.getAllByTestId('box')).not.toHaveLength(0);
    expect(screen.getAllByTestId('paper')).not.toHaveLength(0);
  });
}); 