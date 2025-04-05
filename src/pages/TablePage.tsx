import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import TaskTable from '../components/table/TaskTable';
import TableFilters from '../components/table/TableFilters';
import { RootState } from '../store';
import { fetchTasks, Task } from '../store/tasksSlice';
import { AppDispatch } from '../store';
import { Column } from '../components/table/ColumnSelector';

// Default columns configuration
const defaultColumns: Column[] = [
    { id: 'id', label: 'ID', visible: true, width: '120px' },
    { id: 'name', label: 'Name', visible: true },
    { id: 'status', label: 'Status', visible: true, width: '140px' },
    { id: 'priority', label: 'Priority', visible: true, width: '120px' },
    { id: 'dueDate', label: 'Due Date', visible: true, width: '120px' },
    { id: 'estimatedHours', label: 'Est. Hours', visible: true, width: '100px' },
    { id: 'assignee', label: 'Assignee', visible: true, width: '160px' },
    { id: 'description', label: 'Description', visible: false },
  ];

const TablePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>(defaultColumns);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  useEffect(() => {
    setFilteredTasks(items);
  }, [items]);

  const handleFilterChange = useCallback((filtered: Task[]) => {
    setFilteredTasks(filtered);
  }, []);

  
  const handleColumnsChange = useCallback((newColumns: Column[]) => {
    setColumns(newColumns);
  }, []);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Task Manager
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Manage and monitor your tasks effectively
        </Typography>
      </Box>

      <TableFilters tasks={items} onFilter={handleFilterChange} columns={columns} handleColumnsChange={handleColumnsChange} />
      
      <TaskTable 
        tasks={filteredTasks} 
        loading={status === 'loading'} 
        error={error}
        columns={columns}
      />
    </Box>
  );
};

export default TablePage; 