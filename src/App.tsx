import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RootState } from './store';
import { lightTheme, darkTheme } from './theme';
import { ThemeState } from './store/themeSlice';
import Layout from './components/Layout';
import TablePage from './pages/TablePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const themeState = useSelector((state: RootState) => state.theme as ThemeState);
  const mode = themeState.mode;
  const theme = mode === 'light' ? lightTheme : darkTheme;

  // Get the base path from the environment or use a default for local development
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
