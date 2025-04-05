import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { useTheme, Theme } from '@mui/material';

interface StyledThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

const StyledThemeProvider: React.FC<StyledThemeProviderProps> = ({ children, theme: propTheme }) => {
  const muiTheme = useTheme();
  const themeToUse = propTheme || muiTheme;
  
  return (
    <ThemeProvider theme={themeToUse}>
      {children}
    </ThemeProvider>
  );
};

export default StyledThemeProvider; 