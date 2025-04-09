import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  estimatedHours: number;
  description: string;
  assignee: string;
  remarks: string;
  priority: string;
}

export interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalTasks: number;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
  totalTasks: 0
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('https://run.mocky.io/v3/894221d5-fb36-4d0d-85ac-eb8f2e6a3548');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return await response.json();
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<{ status: string, totalTasks: number, tasks: Task[] }>) => {
        state.status = 'succeeded';
        state.items = action.payload.tasks;
        state.totalTasks = action.payload.totalTasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tasks';
      });
  }
});

export default tasksSlice.reducer; 
