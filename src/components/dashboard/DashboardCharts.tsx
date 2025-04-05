import React, { ReactElement } from 'react';
import { Paper, Typography, useTheme, Box } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Task } from '../../store/tasksSlice';

interface DashboardChartsProps {
  tasks: Task[];
}

// COLORS used for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#3498DB'];

interface ChartPaperProps {
  children: ReactElement;
  height?: number;
  title: string;
  description?: string;
}

const ChartPaper: React.FC<ChartPaperProps> = ({ children, height = 300, title, description }) => {
  const theme = useTheme();
  const chartId = `chart-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <Paper 
      sx={{ 
        p: 2, 
        display: 'flex',
        flexDirection: 'column',
        height, 
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: '16px',
        overflow: 'hidden'
      }}
      aria-labelledby={`${chartId}-title`}
      role="region"
    >
      <Typography 
        variant="h6" 
        gutterBottom
        id={`${chartId}-title`}
      >
        {title}
      </Typography>
      <Box 
        aria-label={description || `Chart: ${title}`}
        tabIndex={0}
        sx={{ flexGrow: 1, minHeight: '240px', width: '100%' }}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={240} aspect={16/9}>
          {children}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ tasks }) => {
  // NEW CHART 1: Completed per Day
  const completedPerDayData = React.useMemo(() => {
    const completedByDay: Record<string, number> = {};
    
    // Filter only completed tasks
    tasks
      .filter(task => task.status === 'completed')
      .forEach(task => {
        // Use due date as a proxy for completion date (since we don't have completion date)
        const date = new Date(task.dueDate);
        const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        completedByDay[dateString] = (completedByDay[dateString] || 0) + 1;
      });
    
    // Sort dates
    return Object.entries(completedByDay)
      .map(([date, count]) => ({
        date,
        count
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Show last 14 days
  }, [tasks]);

  // NEW CHART 2: Due Date per Day
  const duePerDayData = React.useMemo(() => {
    const dueByDay: Record<string, number> = {};
    
    tasks.forEach(task => {
      const date = new Date(task.dueDate);
      const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      dueByDay[dateString] = (dueByDay[dateString] || 0) + 1;
    });
    
    // Sort dates
    return Object.entries(dueByDay)
      .map(([date, count]) => ({
        date,
        count
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Show last 14 days
  }, [tasks]);

  // NEW CHART 3: Estimation Hours
  const estimationHoursData = React.useMemo(() => {
    // Define hour ranges
    const ranges = [
      { name: '0-2 hours', min: 0, max: 2 },
      { name: '3-5 hours', min: 3, max: 5 },
      { name: '6-8 hours', min: 6, max: 8 },
      { name: '9-16 hours', min: 9, max: 16 },
      { name: '17+ hours', min: 17, max: Infinity }
    ];
    
    const hoursCounts = ranges.map(range => ({
      name: range.name,
      value: tasks.filter(task => 
        task.estimatedHours >= range.min && task.estimatedHours <= range.max
      ).length
    }));
    
    return hoursCounts;
  }, [tasks]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Add accessibility descriptions for the charts
  const estimationDescription = React.useMemo(() => {
    if (!estimationHoursData.length) return "No data available for estimation hours";
    
    return `Estimation hours distribution: ${estimationHoursData
      .map(item => `${item.name}: ${item.value} tasks (${Math.round(item.value / tasks.length * 100)}%)`)
      .join(', ')}`;
  }, [estimationHoursData, tasks.length]);

  const completedDescription = React.useMemo(() => {
    if (!completedPerDayData.length) return "No data available for completed tasks per day";
    
    return `Completed tasks per day: ${completedPerDayData
      .map(item => `${formatDate(item.date)}: ${item.count} tasks`)
      .join(', ')}`;
  }, [completedPerDayData]);

  const dueDescription = React.useMemo(() => {
    if (!duePerDayData.length) return "No data available for tasks due per day";
    
    return `Tasks due per day: ${duePerDayData
      .map(item => `${formatDate(item.date)}: ${item.count} tasks`)
      .join(', ')}`;
  }, [duePerDayData]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {/* Completed Tasks Per Day Chart */}
      <Box sx={{ width: { xs: '100%', md: '48%' } }}>
        <ChartPaper 
          title="Completed Tasks per Day" 
          height={350}
          description={completedDescription}
        >
          {completedPerDayData.length > 0 ? (
            <LineChart
              data={completedPerDayData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
                formatter={(value) => [`${value} tasks`, 'Completed']}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Completed Tasks"
                stroke="#00C49F"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}
            >
              <Typography color="text.secondary">No completed tasks data available</Typography>
            </Box>
          )}
        </ChartPaper>
      </Box>

      {/* Tasks Due Per Day Chart */}
      <Box sx={{ width: { xs: '100%', md: '48%' } }}>
        <ChartPaper 
          title="Tasks Due per Day" 
          height={350}
          description={dueDescription}
        >
          {duePerDayData.length > 0 ? (
            <LineChart
              data={duePerDayData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
                formatter={(value) => [`${value} tasks`, 'Due']}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Tasks Due"
                stroke="#FF8042"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}
            >
              <Typography color="text.secondary">No due tasks data available</Typography>
            </Box>
          )}
        </ChartPaper>
      </Box>
      
      {/* Estimation Hours (Pie Chart) */}
      <Box sx={{ width: { xs: '100%', md: '60%' } }}>
        <ChartPaper 
          title="Estimation Hours" 
          height={350}
          description={estimationDescription}
        >
          {estimationHoursData.length > 0 && estimationHoursData.some(item => item.value > 0) ? (
            <PieChart
              margin={{
                top: 20,
                right: 30,
                left: 20,
              }}
            >
              <Pie
                data={estimationHoursData}
                cx="50%"
                cy="$45%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {estimationHoursData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}
            >
              <Typography color="text.secondary">No estimation hours data available</Typography>
            </Box>
          )}
        </ChartPaper>
      </Box>
    </Box>
  );
};

export default DashboardCharts; 