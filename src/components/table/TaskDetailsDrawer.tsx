import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Stack,
  useTheme,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import styled from 'styled-components';
import { Task } from '../../store/tasksSlice';
import StyledThemeProvider from '../../theme/StyledThemeProvider';

interface TaskDetailsDrawerProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const DrawerContent = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const DrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DrawerFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid ${props => props.theme?.palette?.divider || '#e0e0e0'};
  background-color: ${props => props.theme?.palette?.background?.paper || '#fff'};
`;

const FieldLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${props => props.theme?.palette?.text?.secondary || '#666'};
  font-weight: 500;
`;

const FieldValue = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: ${props => props.theme?.palette?.text?.primary || '#333'};
  word-break: break-word;
`;

const StyledChip = styled(Chip)`
  border-radius: 12px;
  padding: 4px;
  font-weight: 500;
`;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return { bg: '#e6f7e6', text: '#388e3c' };
    case 'in_progress':
      return { bg: '#e3f2fd', text: '#1976d2' };
    case 'blocked':
      return { bg: '#ffebee', text: '#d32f2f' };
    case 'not_started':
      return { bg: '#f5f5f5', text: '#616161' };
    case 'in_review':
      return { bg: '#fff8e1', text: '#f57c00' };
    case 'deferred':
      return { bg: '#e8eaf6', text: '#3f51b5' };
    default:
      return { bg: '#f5f5f5', text: '#616161' };
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { bg: '#ffebee', text: '#d32f2f' };
    case 'high':
      return { bg: '#fff8e1', text: '#f57c00' };
    case 'medium':
      return { bg: '#e8f5e9', text: '#388e3c' };
    case 'low':
      return { bg: '#e8eaf6', text: '#3f51b5' };
    case 'normal':
      return { bg: '#f5f5f5', text: '#616161' };
    default:
      return { bg: '#f5f5f5', text: '#616161' };
  }
};

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ task, open, onClose }) => {
  const theme = useTheme();

  if (!task) {
    return null;
  }

  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority);

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label="Task details"
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          boxSizing: 'border-box',
          borderTopLeftRadius: { xs: 0, sm: '16px' },
          borderBottomLeftRadius: { xs: 0, sm: '16px' },
        },
      }}
    >
      <StyledThemeProvider theme={theme}>
        <DrawerContainer>
          <DrawerHeader>
            <Typography variant="h6">Task Details</Typography>
            <IconButton 
              onClick={onClose} 
              edge="end"
              aria-label="Close task details"
            >
              <CloseIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <DrawerContent>
            <Typography variant="subtitle1" gutterBottom fontWeight={500}>
              {task.name}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <StyledChip
                  label={formatStatus(task.status)}
                  size="small"
                  sx={{
                    bgcolor: statusColors.bg,
                    color: statusColors.text,
                  }}
                  aria-label={`Status: ${formatStatus(task.status)}`}
                />
                <StyledChip
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  size="small"
                  sx={{
                    bgcolor: priorityColors.bg,
                    color: priorityColors.text,
                  }}
                  aria-label={`Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`}
                />
              </Stack>
            </Box>

            <FieldLabel id="task-id-label">Task ID</FieldLabel>
            <FieldValue aria-labelledby="task-id-label">{task.id}</FieldValue>

            <FieldLabel id="task-description-label">Description</FieldLabel>
            <FieldValue aria-labelledby="task-description-label">{task.description}</FieldValue>

            <FieldLabel id="task-assignee-label">Assignee</FieldLabel>
            <FieldValue aria-labelledby="task-assignee-label">{task.assignee}</FieldValue>

            <FieldLabel id="task-duedate-label">Due Date</FieldLabel>
            <FieldValue aria-labelledby="task-duedate-label">{task.dueDate}</FieldValue>

            <FieldLabel id="task-hours-label">Estimated Hours</FieldLabel>
            <FieldValue aria-labelledby="task-hours-label">{task.estimatedHours}</FieldValue>

            <FieldLabel id="task-remarks-label">Remarks</FieldLabel>
            <FieldValue aria-labelledby="task-remarks-label">{task.remarks}</FieldValue>
          </DrawerContent>
          <DrawerFooter>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onClose}
              startIcon={<CloseIcon />}
              aria-label="Close drawer"
              sx={{ 
                width: '100%', 
                borderRadius: '8px',
                py: 1.2,
                fontWeight: 500,
                boxShadow: theme.shadows[2]
              }}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContainer>
      </StyledThemeProvider>
    </Drawer>
  );
};

export default TaskDetailsDrawer; 