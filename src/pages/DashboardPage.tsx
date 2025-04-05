import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Error as BlockedIcon,
  Schedule as InProgressIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { fetchTasks } from '../store/tasksSlice';
import { AppDispatch } from '../store';
import styled from 'styled-components';
import StyledThemeProvider from '../theme/StyledThemeProvider';
import DashboardCharts from '../components/dashboard/DashboardCharts';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled(Typography)`
  font-weight: 500;
  margin-bottom: 16px;
`;

const MetricCard = styled(Box)<{ bgcolor: string }>`
  background-color: ${props => props.bgcolor};
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  margin-right: 16px;
`;

const Title = styled(Typography)`
  margin-bottom: 24px;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
`;

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, status } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  // Calculate task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const blockedTasks = tasks.filter(task => task.status === 'blocked').length;

  return (
    <StyledThemeProvider theme={theme}>
      <Title variant="h4">Dashboard</Title>
      
      {/* Metrics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box sx={{ flex: '1 1 220px' }}>
          <MetricCard bgcolor="#6366F1">
            <IconBox>
              <TaskIcon fontSize="large" />
            </IconBox>
            <Box>
              <Typography variant="caption">Total Tasks</Typography>
              <Typography variant="h4">{totalTasks}</Typography>
            </Box>
          </MetricCard>
        </Box>
        
        <Box sx={{ flex: '1 1 220px' }}>
          <MetricCard bgcolor="#22C55E">
            <IconBox>
              <CompletedIcon fontSize="large" />
            </IconBox>
            <Box>
              <Typography variant="caption">Completed</Typography>
              <Typography variant="h4">{completedTasks}</Typography>
            </Box>
          </MetricCard>
        </Box>
        
        <Box sx={{ flex: '1 1 220px' }}>
          <MetricCard bgcolor="#3B82F6">
            <IconBox>
              <InProgressIcon fontSize="large" />
            </IconBox>
            <Box>
              <Typography variant="caption">In Progress</Typography>
              <Typography variant="h4">{inProgressTasks}</Typography>
            </Box>
          </MetricCard>
        </Box>
        
        <Box sx={{ flex: '1 1 220px' }}>
          <MetricCard bgcolor="#EF4444">
            <IconBox>
              <BlockedIcon fontSize="large" />
            </IconBox>
            <Box>
              <Typography variant="caption">Blocked</Typography>
              <Typography variant="h4">{blockedTasks}</Typography>
            </Box>
          </MetricCard>
        </Box>
      </Box>
      
      {/* Charts Section */}
      <Box sx={{ mb: 4 }}>
        <DashboardCharts tasks={tasks} />
      </Box>
    </StyledThemeProvider>
  );
};

export default DashboardPage; 