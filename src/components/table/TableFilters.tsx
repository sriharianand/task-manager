import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Button,
  SelectChangeEvent,
  styled,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, TuneOutlined as FilterIcon } from '@mui/icons-material';
import { Task } from '../../store/tasksSlice';
import ColumnSelector, { Column } from './ColumnSelector';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

interface FilterProps {
  tasks: Task[];
  onFilter: (filteredTasks: Task[]) => void;
  columns: Column[];
  handleColumnsChange: (columns: Column[]) => void;
}

interface FilterState {
  status: string;
  priority: string;
  assignee: string;
  search: string;
}

const TableFilters: React.FC<FilterProps> = ({ tasks, onFilter, columns, handleColumnsChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    assignee: '',
    search: '',
  });

  // Get unique values for select options
  const getUniqueOptions = (field: keyof Task): string[] => {
    const values = new Set<string>();
    tasks.forEach(task => {
      if (task[field]) {
        values.add(task[field] as string);
      }
    });
    return Array.from(values).sort();
  };

  const statusOptions = getUniqueOptions('status');
  const priorityOptions = getUniqueOptions('priority');
  const assigneeOptions = getUniqueOptions('assignee');

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle select dropdown changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      search: '',
    });
  };

  // Apply filters whenever they change
  useEffect(() => {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        task =>
          task.name.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm) ||
          task.id.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    // Apply assignee filter
    if (filters.assignee) {
      filteredTasks = filteredTasks.filter(task => task.assignee === filters.assignee);
    }

    // Send filtered results to parent component
    onFilter(filteredTasks);
  }, [filters, tasks, onFilter]);

  // Helper to format displayed values
  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  };

  const formatPriority = (priority: string): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Check if any filters are active
  const hasActiveFilters = (): boolean => {
    return Object.values(filters).some(value => value !== '');
  };

  return (
    <StyledPaper elevation={0}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {/* Search Input */}
        <TextField
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          sx={{ width: { xs: '100%', md: '45%' } }}
          size="small"
          aria-label="Search tasks"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon aria-hidden="true" />
              </InputAdornment>
            ),
          }}
        />

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            name="status"
            value={filters.status}
            label="Status"
            onChange={handleSelectChange}
            aria-label="Filter by status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>
                {formatStatus(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Priority Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="priority-filter-label">Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            id="priority-filter"
            name="priority"
            value={filters.priority}
            label="Priority"
            onChange={handleSelectChange}
            aria-label="Filter by priority"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {priorityOptions.map(priority => (
              <MenuItem key={priority} value={priority}>
                {formatPriority(priority)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Assignee Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="assignee-filter-label">Assignee</InputLabel>
          <Select
            labelId="assignee-filter-label"
            id="assignee-filter"
            name="assignee"
            value={filters.assignee}
            label="Assignee"
            onChange={handleSelectChange}
            aria-label="Filter by assignee"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {assigneeOptions.map(assignee => (
              <MenuItem key={assignee} value={assignee}>
                {assignee}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleResetFilters}
          disabled={!hasActiveFilters()}
          aria-label="Reset all filters"
        >
          Reset
        </Button>
        
        <ColumnSelector columns={columns} onChange={handleColumnsChange} />
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }} role="region" aria-label="Active filters">
          {filters.status && (
            <Chip
              label={`Status: ${formatStatus(filters.status)}`}
              onDelete={() => setFilters(prev => ({ ...prev, status: '' }))}
              size="small"
              aria-label={`Remove status filter: ${formatStatus(filters.status)}`}
            />
          )}
          {filters.priority && (
            <Chip
              label={`Priority: ${formatPriority(filters.priority)}`}
              onDelete={() => setFilters(prev => ({ ...prev, priority: '' }))}
              size="small"
              aria-label={`Remove priority filter: ${formatPriority(filters.priority)}`}
            />
          )}
          {filters.assignee && (
            <Chip
              label={`Assignee: ${filters.assignee}`}
              onDelete={() => setFilters(prev => ({ ...prev, assignee: '' }))}
              size="small"
              aria-label={`Remove assignee filter: ${filters.assignee}`}
            />
          )}
          {filters.search && (
            <Chip
              label={`Search: ${filters.search}`}
              onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
              size="small"
              aria-label={`Clear search for "${filters.search}"`}
            />
          )}
        </Box>
      )}
    </StyledPaper>
  );
};

export default TableFilters; 