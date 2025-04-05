import { TasksState } from '../store/tasksSlice';
import { ThemeState } from '../store/themeSlice';

declare module 'react-redux' {
  interface DefaultRootState {
    tasks: TasksState;
    theme: ThemeState;
  }
} 