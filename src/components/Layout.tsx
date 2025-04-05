import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TableChart as TableIcon,
  Dashboard as DashboardIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import { RootState } from '../store';
import { toggleTheme, ThemeState } from '../store/themeSlice';
import StyledThemeProvider from '../theme/StyledThemeProvider';

const drawerWidth = 240;

const StyledContent = styled.div`
  padding: 24px;
  flex-grow: 1;
  min-height: calc(100vh - 64px);
  background-color: ${props => props.theme?.palette?.background?.default || '#f5f5f5'};
  margin-top: 64px;
`;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const themeState = useSelector((state: RootState) => state.theme as ThemeState);
  const mode = themeState.mode;


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateTo = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Table', icon: <TableIcon />, path: '/table' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Task Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigateTo(item.path)}
              component={Link}
              to={item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component={Link} 
            to="/dashboard" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              cursor: 'pointer'
            }}
          >
            Task Manager
          </Typography>
          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <StyledThemeProvider theme={theme}>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </StyledThemeProvider>
    </Box>
  );
};

export default Layout; 