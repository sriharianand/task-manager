import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, CircularProgress, Pagination, Typography, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useVirtualizer } from '@tanstack/react-virtual';
import StyledThemeProvider from '../../theme/StyledThemeProvider';
import {
  TableContainer,
  StyledTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderRow,
  TableHeaderCell,
  StatusCell,
  PriorityCell,
  TableFooter,
  NoDataContainer,
  LoadingContainer,
} from './StyledTable';
import { Task } from '../../store/tasksSlice';
import TaskDetailsDrawer from './TaskDetailsDrawer';
import { Column } from './ColumnSelector';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  columns: Column[];
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

const ROWS_PER_PAGE = 10;

const TaskTable: React.FC<TaskTableProps> = ({ tasks, loading, error, columns }) => {
  const theme = useTheme();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'dueDate', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);

  const itemsPerPage = 10;
  const parentRef = useRef<HTMLDivElement>(null);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Sort tasks based on current sort config
  const sortedTasks = useMemo(() => {
    if (!tasks.length) return [];
    
    return [...tasks].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Task];
      const bValue = b[sortConfig.key as keyof Task];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tasks, sortConfig]);

  // Paginate tasks
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return sortedTasks.slice(start, start + ROWS_PER_PAGE);
  }, [sortedTasks, currentPage]);

  // Setup virtualization
  const rowVirtualizer = useVirtualizer({
    count: paginatedTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52, // estimated row height
    overscan: 5,
  });

  // Reset to first page when sorting or filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortConfig]);

  // Format the status and priority for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Function to handle row selection via keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, task: Task, index: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ': // Space key
        e.preventDefault();
        handleTaskClick(task);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < paginatedTasks.length - 1) {
          setFocusedRowIndex(index + 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          setFocusedRowIndex(index - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedRowIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedRowIndex(paginatedTasks.length - 1);
        break;
    }
  };

  // Effect to focus the table row when focusedRowIndex changes
  useEffect(() => {
    if (focusedRowIndex !== null) {
      const rowElement = document.getElementById(`task-row-${focusedRowIndex}`);
      if (rowElement) {
        rowElement.focus();
      }
    }
  }, [focusedRowIndex]);

  // Function to handle header cell keyboard interaction
  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, columnId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(columnId);
    }
  };

  if (loading) {
    return (
      <StyledThemeProvider theme={theme}>
        <LoadingContainer>
          <CircularProgress aria-label="Loading tasks" />
        </LoadingContainer>
      </StyledThemeProvider>
    );
  }

  if (error) {
    return (
      <StyledThemeProvider theme={theme}>
        <NoDataContainer>
          <Typography color="error" role="alert">
            Error: {error}
          </Typography>
        </NoDataContainer>
      </StyledThemeProvider>
    );
  }

  if (sortedTasks.length === 0) {
    return (
      <StyledThemeProvider theme={theme}>
        <NoDataContainer>
          <Typography role="status">No tasks found.</Typography>
        </NoDataContainer>
      </StyledThemeProvider>
    );
  }

  return (
    <StyledThemeProvider theme={theme}>
      <TableContainer>
        <div ref={parentRef} style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}>
          <StyledTable aria-label="Tasks table">
            <TableHead>
              <TableHeaderRow>
                {columns
                  .filter(col => col.visible)
                  .map(column => (
                    <TableHeaderCell
                      key={column.id}
                      onClick={() => handleSort(column.id)}
                      onKeyDown={(e) => handleHeaderKeyDown(e, column.id)}
                      tabIndex={0}
                      role="columnheader"
                      aria-sort={sortConfig.key === column.id 
                        ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') 
                        : undefined}
                      width={column.width}
                    >
                      {column.label}
                      {sortConfig.key === column.id && (
                        <Box component="span" ml={0.5} sx={{ verticalAlign: 'middle', display: 'inline-flex' }}>
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUpward fontSize="small" aria-hidden="true" />
                          ) : (
                            <ArrowDownward fontSize="small" aria-hidden="true" />
                          )}
                        </Box>
                      )}
                    </TableHeaderCell>
                  ))}
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const task = paginatedTasks[virtualRow.index];
                return (
                  <TableRow
                    key={task.id}
                    id={`task-row-${virtualRow.index}`}
                    onClick={() => handleTaskClick(task)}
                    onKeyDown={(e) => handleKeyDown(e, task, virtualRow.index)}
                    tabIndex={focusedRowIndex === virtualRow.index ? 0 : -1}
                    role="row"
                    aria-selected={selectedTask?.id === task.id}
                  >
                    {columns
                      .filter(col => col.visible)
                      .map(column => {
                        if (column.id === 'status') {
                          return (
                            <StatusCell 
                              key={column.id} 
                              status={task.status}
                              role="cell"
                              aria-label={`Status: ${formatStatus(task.status)}`}
                            >
                              <span>{formatStatus(task.status)}</span>
                            </StatusCell>
                          );
                        }
                        if (column.id === 'priority') {
                          return (
                            <PriorityCell 
                              key={column.id} 
                              priority={task.priority}
                              role="cell"
                              aria-label={`Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`}
                            >
                              <span>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </PriorityCell>
                          );
                        }
                        return (
                          <TableCell 
                            key={column.id}
                            role="cell"
                          >
                            {task[column.id as keyof Task]?.toString() || ''}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })}
            </TableBody>
          </StyledTable>
        </div>
        
        <TableFooter>
          <Pagination
            count={Math.ceil(sortedTasks.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            aria-label="Table pagination"
          />
        </TableFooter>
      </TableContainer>
      
      <TaskDetailsDrawer
        task={selectedTask}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </StyledThemeProvider>
  );
};

export default TaskTable; 