import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import muiTheme from '../theme/muiTheme';

export default function GuestLayout({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
      >
        {/* Header without burger menu */}
        <AppBar 
          position="static" 
        >
          <Toolbar
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              px: 3,
            }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
                letterSpacing: '0.5px',
                textAlign: 'center'
              }}
            >
              PREDICTIONS LEAGUE
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
        className="mt-3"
        fixed={true}
          maxWidth="lg" 
        >
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
