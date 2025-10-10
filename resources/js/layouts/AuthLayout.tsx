import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import muiTheme from '../theme/muiTheme';
import NavigationDrawer from '../components/Navigation/NavigationDrawer';
import { FlashMessages } from '../components/FlashMessages';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box>
        {/* Header with burger menu */}
        <AppBar position="static">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
            }}
          >
            <Box sx={{ width: 48 }} /> {/* Spacer for centering */}
            
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
                letterSpacing: '0.5px',
                textAlign: 'center',
                flexGrow: 1,
              }}
            >
              PREDICTIONS LEAGUE
            </Typography>

            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sliding menu drawer */}
        <NavigationDrawer
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        />

        <Container
          className="mt-3"
          fixed={true}
          maxWidth="lg"
        >
          <Box
            sx={{
              minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pt: 6, // Reduced top padding
              pb: 3,
            }}
          >
            {children}
          </Box>
        </Container>

        {/* Flash Messages Handler */}
        <FlashMessages />
      </Box>
    </ThemeProvider>
  );
}
