import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    theme: themeReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 